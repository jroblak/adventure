// Player Entity - conrols the player (duh)
// Extends a sprite object that draws the player as well as the gun at the same times
// fixes 'gun' object shadowing the player, and allows for upgrades/armor/guns to be
// drawn on/over the player


game.PlayerEntity = game.CharacterEntity.extend({
	
	init: function(x, y, settings) {
		// Init 
		var self = this;
		self.parent(x, y, settings);
		
		self.setVelocity(3, 10);
		
		self.hp = 10;
		console.log(this.accel.x);
		
		self.addAnimation("stand", [0]);
		self.addAnimation("walk", [0, 1, 2, 3, 4]);
		self.setCurrentAnimation("stand");
		
		// Change the collision rect to match the sprite -- off fix when sprite finalized
		self.updateColRect(4, 26, -1, 0);
		self.facing = 'right';
		
		me.game.viewport.follow(self.pos, me.game.viewport.AXIS.BOTH);
	},
	
	// Update function to move/handle player keystrokes
	getMovements: function() {
		var self = this;
		
		// Check for keystrokes - fairly obvious
		if (me.input.isKeyPressed('left')) {
			self.flipX(true);
			self.facing = 'left';
			self.vel.x -= self.accel.x * me.timer.tick;
			
		} else if (me.input.isKeyPressed('right')) {
			self.flipX(false);
			self.facing = 'right';
			self.vel.x += self.accel.x * me.timer.tick;
			self.setCurrentAnimation("walk");
		} else {
			self.vel.x = 0;
		}
		if (me.input.isKeyPressed('jump')) {
			if (!self.jumping && !self.falling) {
				self.vel.y = -self.maxVel.y * me.timer.tick;
				self.jumping = true;
			}
		}
		// Check if the player pressed the shoot button, and make sure that it isn't currently
		// shooting (from gun's firerate)
		if (me.input.isKeyPressed('shoot') && !self.attacking) {
			// call attack function of weapon
			// self.equippedWep.attack();
			self.attacking = true;
			// Timeout to control firerate of the weapons (based on equipped weapon's firerate)
			setTimeout(function() {
				self.attacking = false;
			}, self.equippedWep.firerate);
		}
		// Check if switch weapon is pressed. If it is, switch to the next gun in the weapons array
		if(me.input.isKeyPressed('switch')) {
			// If we're at the end of the array, move to the 0 position
			if(!self.weapons[++self.currentWep]) {
				self.currentWep = 0;
				self.equipWep(self.weapons[self.currentWep]);
			} else {
				self.equipWep(self.weapons[self.currentWep]);
			}
		}
		if(me.input.isKeyPressed('fly')) {
			if(this.equippedGear.name === 'jetpack') {
				self.vel.y -= self.accel.y * me.timer.tick;
			}
		} 
	
		// Check for collisions
		var res = me.game.collide(self);
		
		// If the player hits an enemy and isn't jumping, flicker
		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				if((res.y > 0) && !self.jumping) {
					self.falling = false;
					self.vel.y -self.maxVel.y * me.timer.tick;
					self.jumping = true;
				} else {
					// TO DO: Add damage function
					self.flicker(45);
				}
			}
		}
	}
});
