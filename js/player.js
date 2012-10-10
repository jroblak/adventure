game.persistant = {
	player: {
		weapons: [],
		gear: []
	},
	other: {
	},
};

game.PlayerEntity = game.CharacterEntity.extend({
	
	init: function(x, y, settings) {
		var self = this;
		self.parent(x, y, settings);
		
		self.setVelocity(3, 13);
		
		self.hp = 10;
		self.accel.y = 1;

		self.weapons = game.persistant.player.weapons;
		if(self.weapons.length > 0) {
			self.currentWep = 0;
			self.equipWep(self.weapons[self.currentWep]);
		} else {
			self.currentWep = null;
		}

		self.gear = game.persistant.player.gear;
		if(self.gear.length > 0) {
			self.currentGear = 0;
			self.equipGear(self.gear[self.currentGear]);
		} else {
			self.currentGear = null;
		}
		
		self.addAnimation("stand", [0]);
		self.addAnimation("walk", [0, 1, 2, 3, 4]);
		self.setCurrentAnimation("stand");

		self.updateColRect(4, 26, -1, 0);
		
		me.game.viewport.follow(self.pos, me.game.viewport.AXIS.BOTH);
	},
	
	triggerStory: function(story) {
		var storyUpdate = new game.StoryEntity(this.pos.x, this.pos.y, story);
		me.game.add(storyUpdate, 2);
		me.game.sort();
	},
	
	// Update function to move/handle player keystrokes
	getMovements: function() {
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
		
		
		if(me.input.isKeyPressed('switch')) {
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
	
		var res = me.game.collide(self);
		
		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				//self.removeHP(res.obj.dmg);
				self.flicker(45);
			}
		}
		
	}
});
