game.PlayerEntity = me.ObjectEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.setVelocity(3, 15);
		
		//add Animation for jumping
		this.addAnimation("walk", [0, 1, 2, 3, 4]);
		this.setCurrentAnimation("walk");
		
		//change the collision rect to match the sprite
		this.updateColRect(4, 26, 12, 20);
		this.facing = 'right';
		
		this.equipWep(game.weapons.basic);
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},
	
	equipWep: function(wep) {
		//check to make sure it exists before trying to remove it
		if(gun) {
			me.game.remove(gun);
		}
		this.equippedWep = wep; 
		var gun = new game.weapon(this.pos.x, this.pos.y, this.equippedWep, this);
		me.game.add(gun, 2);
		me.game.sort();
	},
	
	shoot: function() {
		shot = new game.bullet(this.pos.x, this.pos.y, this.equippedWep, this);
		me.game.add(shot, 2);
		me.game.sort();
	},
	
	update: function() {
		if (me.input.isKeyPressed('left')) {
			this.flipX(true);
			this.facing = 'left';
			this.vel.x -= this.accel.x * me.timer.tick;
		} else if (me.input.isKeyPressed('right')) {
			this.flipX(false);
			this.facing = 'right';
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
			this.shoot();
		}
		if(me.input.isKeyPressed('switch')) {
			//to do
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
	}
});
