// Items that persist through the levels. Everything gets reset on a level by level basis
game.persistent = {
	player: {
		weapons: [],
		gear: [],
		hp: 3,
		level: 'map1',
	},
	other: {
		deathcounter: 0
	},
};

// The player entity
game.PlayerEntity = game.CharacterEntity.extend({
	
	init: function(x, y, settings) {
		var self = this; 
		
		// Sets the level that the player is on -- this way we can continue our
		// progress and not restart after every death 
		if (game.persistent.player.level != me.game.currentLevel.name) {
			game.persistent.player.level = me.game.currentLevel.name;
		}
		
		// basic settings stuff
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		
		self.parent(x, y, settings);
		
		self.setVelocity(4, 13);
		
		self.hp = game.persistent.player.hp;
		self.hurt = false;
		self.accel.y = 1.2;
		
		// This is a kind of dumb hacky solution for the difficuly
		// of level 4 -- trying to make the jetpack fall less abruptly
		if (me.game.currentLevel.name === 'map4') {
			me.sys.gravity = .75;
		} else {
			this.gravity = 1;
		}

		// functions to check the players weapons / gear and equip them if he has them
		
		self.weapons = game.persistent.player.weapons;
		if(self.weapons.length > 0) {
			self.currentWep = 0;
			self.equipWep(self.weapons[self.currentWep]);
		} else {
			self.currentWep = null;
		}

		self.gear = game.persistent.player.gear;
		if(self.gear.length > 0) {
			self.currentGear = 0;
			self.equipGear(self.gear[self.currentGear]);
		} else {
			self.currentGear = null;
		}
		
		// animations
		self.addAnimation("stand", [0, 1]);
		self.addAnimation("walk", [1, 2, 3, 4]);
		self.addAnimation("attack", [2]);
		self.setCurrentAnimation("stand");

		self.updateColRect(9, 12, -1, 0);
		
		me.game.viewport.follow(self.pos, me.game.viewport.AXIS.BOTH);
	},
	
	// Update function to move/handle player keystrokes
	getMovements: function(hit) {
		var self = this;
		
		if (me.input.isKeyPressed('left')) {
			self.flipX(true);
			self.facing = 'left';
			self.vel.x -= self.accel.x * me.timer.tick;
			self.checkAnimation(true);
		} else if (me.input.isKeyPressed('right')) {
			self.flipX(false);
			self.facing = 'right';
			self.vel.x += self.accel.x * me.timer.tick;
			self.checkAnimation(true);
		} else {
			self.vel.x = 0;
			self.checkAnimation(false);
		}
		
		if (me.input.isKeyPressed('jump')) {
			if (!self.jumping && !self.falling) {
				self.vel.y = -self.maxVel.y * me.timer.tick;
				self.jumping = true;
			}
		}
		
		/*
		if(me.input.isKeyPressed('switch')) {
			if(!self.weapons[++self.currentWep]) {
				self.currentWep = 0;
				self.equipWep(self.weapons[self.currentWep]);
			} else {
				self.equipWep(self.weapons[self.currentWep]);
			}
		}
		*/
		
		if(me.input.isKeyPressed('fly') && this.equippedGear) {
			if(this.equippedGear.name === 'jetpack') {
				self.vel.y -= self.accel.y * me.timer.tick;
			}
		} 
	
		var res = me.game.collide(self);
		
		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT && !self.hurt) {
				self.removeHP(res.obj.dmg);
				self.hurt = true;
				self.flicker(45);
				setTimeout(function(){
					self.hurt = false;
				}, 750);
			}
		}

		if(hit.xprop.prop === 'hurt' || hit.yprop.prop === 'hurt') {
			self.removeHP(self.hp);
		}
		
		if(this.pos.y <= 0 + me.game.viewport.pos.y || this.pos.y >= 480 + me.game.viewport.pos.y) {
			this.removeHP(this.hp);
		}
		
	}
});
