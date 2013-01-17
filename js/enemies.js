// Basic enemy entity - just extends the character entity and adds an 'aggro' function
// -- basically just follow the player if it gets within a certain range.
game.EnemyEntity = game.CharacterEntity.extend({
	init:function(x, y, settings) {
		settings.image = 'bad1';
		settings.spritewidth = 32;
		this.parent(x, y, settings);
		
		this.hp = 1;
		
		this.dmg = 1;
		this.aggroed = false;
		this.firstCheck = true;
		this.walkLeft = false;
		
		this.startX = x;
		this.endX = x + settings.width - settings.spritewidth;
		
		this.setVelocity(2, 6);
		
		this.type = me.game.ENEMY_OBJECT;
	},
	
	checkLOS: function() {
		
		// This is so we only check through the entities list one time, not every frame
		if(this.firstCheck) {
			this.player = me.game.getEntityByName("player")[0];
			this.firstCheck = false;
		}

		if(!this.walkLeft) {
			if(((this.pos.x - this.player.pos.x <= 100) && (this.pos.x - this.player.pos.x >= 0)) &&
				(this.pos.y - this.player.pos.y <= 150) && (this.pos.y - this.player.pos.y >= 0)) {
					this.vel.x += -this.accel.x * me.timer.tick;
					this.walkLeft = true;
					return true;
			}
		} else {
			if (((this.pos.x - this.player.pos.x >= -100) && (this.pos.x - this.player.pos.x <= 0)) &&
				(this.pos.y - this.player.pos.y <= 150) && (this.pos.y - this.player.pos.y >= 0)) {
					this.vel.x += this.accel.x * me.timer.tick;
					this.walkLeft = false;
					return true;
			}
		}
		this.flipX(this.walkLeft);
		return false;
	},
	
	// This just moves it back and forth
	patrol: function() {

		if(this.walkLeft && this.pos.x <= this.startX) {
			this.walkLeft = false;
		} else if (!this.walkLeft && this.pos.x >= this.endX) {
			this.walkLeft = true;
		}
		
		this.flipX(this.walkLeft);
		this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
		
	},
	
	getMovements: function() {
		
		this.vel.x = 0; //change velocity every update; maybe dumb
		this.aggroed = this.checkLOS();
		if(!this.aggroed) {
			this.patrol();
		} 
	}
});


// The same as above, except it moves vertically and has no aggro function
game.FlyingEnemyEntity = game.CharacterEntity.extend({
	init:function(x, y, settings) {
		settings.image = 'bad2';
		settings.spritewidth = 32;
		this.parent(x, y, settings);
		
		this.hp = 1;
		
		this.dmg = 1;

		this.firstCheck = true;
		
		this.startY = y;
		this.endY = y + settings.height - settings.spritewidth; // spritewidth and height are the same
		this.setVelocity(0, 3);
		
		this.type = me.game.ENEMY_OBJECT;
	},
	
	
	patrol: function() {
	
		if(this.pos.y <= this.startY) {
			this.goUp = false;
		} else if (this.pos.y >= this.endY) {
			this.goUp = true;
		}
		
		this.vel.y += (this.goUp) ? -this.accel.y * me.timer.tick : this.accel.y * me.timer.tick;
		
	},
	
	getMovements: function() {
		
		this.vel.y = 0; //change velocity every update; maybe dumb
		this.patrol();
	}
});