// Player Entity - conrols the player (duh)
// Extends a sprite object that draws the player as well as the gun at the same times
// fixes 'gun' object shadowing the player, and allows for upgrades/armor/guns to be
// drawn on/over the player

game.PlayerEntity = game.Sprite.extend({
	
	init: function(x, y, settings) {
		// Init 
		var self = this;
		settings.compose = '[{"name":"player"}]';
		self.parent(x, y, settings);
		
		// Set basic stuff - walk/jump speed, shooting, weapons
		self.setVelocity(10, 10);
		self.accel.y = 1.5;
		self.shooting = false;
		self.weapons = [game.weapons.basic, game.weapons.machinegun, game.weapons.rocket];
		self.equipped = [game.equipable.jetpack];
		self.currentWep = 0;
		self.currentGear = 0;
		self.hp = 10;
		
		// TO DO - Add animation for jumping and standing
		self.addAnimation("stand", [0]);
		self.addAnimation("walk", [0, 1, 2, 3, 4]);
		self.setCurrentAnimation("walk");
		
		// Change the collision rect to match the sprite -- off fix when sprite finalized
		self.updateColRect(4, 26, -1, 0);
		self.facing = 'right';
		
		// Equip the basic weapon and set the viewport to follow the player
		self.equipWep(self.weapons[self.currentWep]);
		self.equipGear(self.equipped[self.currentGear]);
		me.game.viewport.follow(self.pos, me.game.viewport.AXIS.BOTH);
	},
	
	// Function that equips a new weapon. Uses sprite composition 'manager' inherited from
	// SpriteObject (sprite.js)
	equipWep: function(wep) {
		if(this.equippedWep) {
			this.removeCompositionItem(this.equippedWep.name);
		}
		this.equippedWep = wep; 
		this.addCompositionItem({"name":wep.name,"class":"game.weapon","image":wep.gImg,"spritewidth":wep.gWidth,"spriteheight":wep.gHeight});
		this.setCompositionOrder(wep.name, "player");
	},
	
	equipGear: function(gear) {
		if(this.equippedGear) {
			this.removeCompositionItem(this.equippedGear.name);
		}
		this.equippedGear = gear;
		this.addCompositionItem({"name":gear.name,"class":"game.gear","image":gear.image,"spritewidth":gear.width,"spriteheight":gear.height});
		this.setCompositionOrder("player", gear.name);
	},
	
	// Function that shoots - just creates a new projectile object and adds it to the game
	shoot: function() {
		shot = new game.projectile(this.pos.x, this.pos.y, this.equippedWep, this);
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
		if(me.input.isKeyPressed('fly')) {
			if(this.equippedGear.name === 'jetpack') {
				self.vel.y -= self.accel.y * me.timer.tick;
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
		if (self.vel.x != 0 || self.vel.y != 0 ) {
			self.parent(self);
		}
		
		// If there is no movement or animation return false
		return true;
	}
});
