var PlayerEntity = me.ObjectEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.setVelocity(3, 15);
		
		this.equippedWep = weapons.basic;
		
		//change the collision rect to match the sprite
		this.updateColRect(4, 26, 12, 20);
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},
	
	update: function() {
		if (me.input.isKeyPressed('left')) {
			this.flipX(true);
			this.vel.x -= this.accel.x * me.timer.tick;
		} else if (me.input.isKeyPressed('right')) {
			this.flipX(false);
			this.vel.x += this.accel.x * me.timer.tick;
		} else {
			this.vel.x = 0;
		}
		if (me.input.isKeyPressed('jump')) {
			if (!this.jumping && !this.falling) {
				this.vel.y = -this.maxVel.y * me.timer.tick;
				this.jumping = true;
			}
		}
		if (me.input.isKeyPressed('shoot')) {
			shoot();
		}
		
		//update player movement
		this.updateMovement();
		
		var res = me.game.collide(this);
		
		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				if((res.y > 0) && !this.jumping) {
					this.falling = false;
					this.vel.y -this.maxVel.y * me.timer.tick;
					this.jumping = true;
				} else {
					this.flicker(45);
				}
			}
		}
		
		// if we moved report it to the engine to update animation
		if (this.vel.x != 0 || this.vel.y != 0) {
			this.parent(this);
			return true;
		}
		
		// if there is no movement or animation return false
		return false;
	},
	
	shoot: function() {
		type = equippedWep;
		bullet = new Projectile(type, x, y)
	}
});
