
game.EnemyEntity = game.Sprite.extend({
	init:function(x, y, settings) {
		settings.image = 'bad1';
		settings.spritewidth = 32;
		this.hp = 4;
		this.aggroed = false;
		this.firstCheck = true;
		
		this.parent(x, y, settings);
		
		//set up patrol route
		this.startX = x;
		// The settings object comes from Tiled - settings.width is the width of the object
		// 'square' drawn in Tiled. This is used to create a path for the sprite to patrol around
		this.endX = x + settings.width - settings.spritewidth;
		
		this.pos.x = x + settings.width - settings.spritewidth;
		this.walkLeft = true;
		
		this.setVelocity(2, 6);
		
		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;
	},
	
	// Function that removes 'hp' from the enemy if its attacked - called by the projectile
	// object
	removeHP: function(dmg) {
		this.hp -= dmg;
		this.flicker(45);
		if(this.hp <= 0) {
			me.game.remove(this);
		}
	},
	
	checkLOS: function() {
		// only get the player entity once -- don't want to run through the full object list
		// every check
		if(this.firstCheck) {
			this.player = me.game.getEntityByName("player")[0];
			this.firstCheck = false;
		}

		if(this.walkLeft) {
			if(((this.pos.x - this.player.pos.x <= 100) && (this.pos.x - this.player.pos.x >= 0)) &&
				(this.pos.y - this.player.pos.y <= 150) && (this.pos.y - this.player.pos.y >= 0)) {
					return true;
			}
		} else {
			if (((this.pos.x - this.player.pos.x >= -100) && (this.pos.x - this.player.pos.x <= 0)) &&
				(this.pos.y - this.player.pos.y <= 150) && (this.pos.y - this.player.pos.y >= 0)) {
					return true;
			}
		}
		return false;
	},
	
	// Move the enemy
	update: function() {
		
		this.aggroed = this.checkLOS();
		
		if(this.aggroed) {
			console.log("shoot at player!");
		} else {
			if(this.walkLeft && this.pos.x <= this.startX) {
				this.walkLeft = false;
			} else if(!this.walkLeft && this.pos.x >= this.endX) {
				this.walkLeft = true;
			}
			
			this.flipX(this.walkLeft);
			this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
		}
		
		this.updateMovement();
		
		if(this.vel.x != 0 || this.vel.y != 0) {
			this.parent(this);
			return true;
		}
		return false;
	}
});