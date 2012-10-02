game.PlayerEntity = me.ObjectEntity.extend({
	
	init: function(x, y, settings) {
		var self = this;
		
		self.parent(x, y, settings);
		self.setVelocity(3, 10);
		self.shooting = false;
		self.weapons = [game.weapons.basic, game.weapons.machinegun];
		self.currentWep = 0;
		
		//add Animation for jumping
		self.addAnimation("walk", [0, 1, 2, 3, 4]);
		self.setCurrentAnimation("walk");
		
		//change the collision rect to match the sprite -- off fix when sprite finalized
		self.updateColRect(4, 26, 12, 20);
		self.facing = 'right';
		
		self.equipWep(self.weapons[self.currentWep]);
		me.game.viewport.follow(self.pos, me.game.viewport.AXIS.BOTH);
	},
	
	equipWep: function(wep) {
		var self = this;
		//check to make sure it exists before trying to remove it
		if(self.gun) {
			me.game.remove(self.gun);
		}
		self.equippedWep = wep; 
		self.gun = new game.weapon(self.pos.x, self.pos.y, self.equippedWep, self);
		me.game.add(self.gun, 2);
		me.game.sort();
	},
	
	shoot: function() {
		var self = this;
		
		shot = new game.bullet(self.pos.x, self.pos.y, self.equippedWep, self);
		me.game.add(shot, 2);
		me.game.sort();
	},
	
	update: function() {
		var self = this;
		
		if (me.input.isKeyPressed('left')) {
			self.flipX(true);
			self.facing = 'left';
			self.vel.x -= self.accel.x * me.timer.tick;
		} else if (me.input.isKeyPressed('right')) {
			self.flipX(false);
			self.facing = 'right';
			self.vel.x += self.accel.x * me.timer.tick;
		} else {
			self.vel.x = 0;
		}
		if (me.input.isKeyPressed('jump')) {
			if (!self.jumping && !self.falling) {
				self.vel.y = -self.maxVel.y * me.timer.tick;
				self.jumping = true;
			}
		}
		if (me.input.isKeyPressed('shoot') && !self.shooting) {
			self.shoot();
			self.shooting = true;
			setTimeout(function() {
				self.shooting = false;
			}, self.equippedWep.firerate);
		}
		if(me.input.isKeyPressed('switch')) {
			if(!self.weapons[++self.currentWep]) {
				self.currentWep = 0;
				self.equipWep(self.weapons[self.currentWep]);
			} else {
				self.equipWep(self.weapons[self.currentWep]);
			}
		}
		
		//update player movement
		self.updateMovement();
		
		var res = me.game.collide(self);
		
		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				if((res.y > 0) && !self.jumping) {
					self.falling = false;
					self.vel.y -self.maxVel.y * me.timer.tick;
					self.jumping = true;
				} else {
					self.flicker(45);
				}
			}
		}
		
		// if we moved report it to the engine to update animation
		if (self.vel.x != 0 || self.vel.y != 0) {
			self.parent(self);
			return true;
		}
		
		// if there is no movement or animation return false
		return false;
	}
});
