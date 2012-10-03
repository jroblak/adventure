// Player Entity - conrols the player (duh)
game.PlayerEntity = game.Sprite.extend({
	
	init: function(x, y, settings) {
		// Init 
		var self = this;
		settings.compose = '[{"name":"player"}]';
		self.parent(x, y, settings);
		
		// Set basic stuff - walk/jump speed, shooting, weapons
		self.setVelocity(3, 10);
		self.shooting = false;
		self.weapons = [game.weapons.basic, game.weapons.machinegun, game.weapons.rocket];
		self.currentWep = 0;
		
		// TO DO - Add animation for jumping and standing
		self.addAnimation("walk", [0, 1, 2, 3, 4]);
		self.setCurrentAnimation("walk");
		
		// Change the collision rect to match the sprite -- off fix when sprite finalized
		self.updateColRect(4, 26, 12, 20);
		self.facing = 'right';
		
		// Equip the basic weapon and set the viewport to follow the player
		self.equipWep(self.weapons[self.currentWep]);
		me.game.viewport.follow(self.pos, me.game.viewport.AXIS.BOTH);
	},
	
	// Function that equips a new weapon. If a gun exists, remove it, then generate a new
	// gun SpriteObject and add it to the game
	equipWep: function(wep) {
		var self = this;
		//check to make sure it exists before trying to remove it
		if(self.gun) {
			me.game.remove(self.gun);
		}
		self.equippedWep = wep; 
		//self.gun = new game.weapon(self.pos.x, self.pos.y, self.equippedWep, self);
		self.addCompositionItem({"name":"weapon","class":"game.weapon","image":"self.equippedWep.gImg","spritewidth":"8","spriteheight":"8"});
		//self.setCompositionOrder("weapon", "player");
		//me.game.add(self.gun, 2);
		//me.game.sort();
	},
	
	// Function that shoots - just creates a new projectile object and adds it to the game
	shoot: function() {
		var self = this;
		
		shot = new game.projectile(self.pos.x, self.pos.y, self.equippedWep, self);
		me.game.add(shot, 2);
		me.game.sort();
	},
	
	// Update function to move/handle player keystrokes
	update: function() {
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
		if (me.input.isKeyPressed('shoot') && !self.shooting) {
			self.shoot();
			self.shooting = true;
			// Timeout to control firerate of the weapons (based on equipped weapon's firerate)
			setTimeout(function() {
				self.shooting = false;
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
		
		// Update player movement
		self.updateMovement();
		
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
					// O DO: Add damage function
					self.flicker(45);
				}
			}
		}
		
		// If we moved report it to the engine to update animation
		if (self.vel.x != 0 || self.vel.y != 0) {
			self.parent(self);
			return true;
		}
		
		// If there is no movement or animation return false
		return false;
	}
});
