// Object for a basic enemy -- Not really going to document this since it's just a placeholder
// from the me tutorial
game.EnemyEntity = me.ObjectEntity.extend({
	init:function(x, y, settings) {
		settings.image = 'bad1';
		settings.spritewidth = 32;
		this.hp = 4;
		
		this.parent(x, y, settings);
		this.updateColRect(4, 26, 12, 20);
		
		this.startX = x;
		// The settings object comes from Tiled - settings.width is the width of the object
		// 'square' drawn in Tiled. This is used to create a path for the sprite to patrol around
		this.endX = x + settings.width - settings.spritewidth;
		
		this.pos.x = x + settings.width - settings.spritewidth;
		this.walkLeft = true;
		
		this.setVelocity(4, 6);
		
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
	
	// Move the enemy
	update: function() {
		
		if(this.alive) {
			if(this.walkLeft && this.pos.x <= this.startX) {
				this.walkLeft = false;
			} else if(!this.walkLeft && this.pos.x >= this.endX) {
				this.walkLeft = true;
			}
			
			this.flipX(this.walkLeft);
			this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
		} else {
			this.vel.x = 0;
		}
		
		this.updateMovement();
		
		if(this.vel.x != 0 || this.vel.y != 0) {
			this.parent(this);
			return true;
		}
		return false;
	}
});