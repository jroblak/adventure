game.PlayerEntity = game.CharacterEntity.extend({
	
	init: function(x, y, settings) {
		var self = this;
		self.parent(x, y, settings);
		
		self.setVelocity(3, 10);
		
		self.hp = 10;
		
		self.addAnimation("stand", [0]);
		self.addAnimation("walk", [0, 1, 2, 3, 4]);
		self.setCurrentAnimation("stand");
		
		self.updateColRect(4, 26, -1, 0);
		self.equipWep(game.weapons.whip);
		
		self.storySize = 14;
		self.fade = 10;
		self.storyPos = 0;
		self.storyUpdate = true;
		self.storyResetter = true;
		self.animTimeout = false;
		self.storyX = this.pos.x - me.game.viewport.pos.x;
		self.storyY = this.pos.y - me.game.viewport.pos.y;
		self.storyTeller = new me.Font('century gothic', self.storySize, 'black');
		
		me.game.viewport.follow(self.pos, me.game.viewport.AXIS.BOTH);
	},
	
	checkStory: function() {
		var self = this;
		self.storyX = this.pos.x - me.game.viewport.pos.x + self.fade;
		self.storyY = this.pos.y - me.game.viewport.pos.y - self.fade;
		
		if(!self.animTimeout) {
			self.storySize -= .05;
			self.fade += 1;
			self.animTimeout = true;
			setTimeout(function () {
				self.animTimeout = false;
			}, 100);
		}
		
		if(self.storyResetter) {
			self.storyResetter = false;
			setTimeout(function () {
				self.storyUpdate = false;
				self.resetStory();
				self.storyPos++;
			}, 5000);
		}
		
		return game.story[self.storyPos];
	},
	
	resetStory: function() {
		this.storyResetter = true;
		this.fade = 10;
		this.storySize = 14;
		this.storyX = this.pos.x - me.game.viewport.pos.x;
		this.storyY = this.pos.y - me.game.viewport.pos.y;
	},
	
	triggerStory: function() {
		this.storyUpdate = true;
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
		
		/*
		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				self.removeHP(res.obj.dmg);
				self.flicker(45);
			}
		}
		*/
	},
	
	draw: function(context) {
		this.parent(context);
		if(this.storyUpdate) {
			this.storyTeller.set('century gothic', this.storySize, 'black')
			this.storyTeller.draw(context, this.checkStory(), this.storyX, this.storyY); 
		}
	}
});
