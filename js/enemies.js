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
		this.endX = x + 200; // remove magic number later
		
		this.setVelocity(2, 6);
		
		this.type = me.game.ENEMY_OBJECT;
	},
	
	checkLOS: function() {
		if(this.firstCheck) {
			this.player = me.game.getEntityByName("player")[0];
			this.firstCheck = false;
		}

		if(!this.walkLeft) {
			if(((this.pos.x - this.player.pos.x <= 100) && (this.pos.x - this.player.pos.x >= 0)) &&
				(this.pos.y - this.player.pos.y <= 150) && (this.pos.y - this.player.pos.y >= 0)) {
					this.vel.x += -this.accel.x * me.timer.tick;
					return true;
			}
		} else {
			if (((this.pos.x - this.player.pos.x >= -100) && (this.pos.x - this.player.pos.x <= 0)) &&
				(this.pos.y - this.player.pos.y <= 150) && (this.pos.y - this.player.pos.y >= 0)) {
					this.vel.x += this.accel.x * me.timer.tick;
					return true;
			}
		}
		return false;
	},
	
	
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

game.FlyingEnemyEntity = game.CharacterEntity.extend({
	init:function(x, y, settings) {
		settings.image = 'bad2';
		settings.spritewidth = 32;
		this.parent(x, y, settings);
		
		this.hp = 1;
		
		this.dmg = 2;

		this.firstCheck = true;
		
		this.startY = y;
		this.endY = y + 150; // remove magic number later
		
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

game.FlyingShootingEnemyEntity = game.CharacterEntity.extend({
	init:function(x, y, settings) {
		settings.image = 'bad2';
		settings.spritewidth = 32;
		this.parent(x, y, settings);
		
		this.hp = 1;
		
		this.dmg = 2;

		this.firstCheck = true;
		
		this.startY = y;
		this.endY = y + 150; // remove magic number later
		
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