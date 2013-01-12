game.weapons = {
	sword: {
		name: 'sword',
		image: "sword",
		animation: [1, 2, 3, 4],
		rate: 500,
		damage: 1,
		speed: null,
		projectile: null,
		pWidth: null,
		pHeight: null,
		wWidth: 12,
		wHeight: 12,
		offsetX: 23,
		offsetY: 15,
		attackRect: [27, 23, 0, 32]
	},
	whip: {
		name: 'whip',
		image: "wipwhip",
		animation: [2, 3, 4, 5],
		rate: 500,
		damage: 1,
		speed: null,
		projectile: null,
		pWidth: null,
		pHeight: null,
		wWidth: 51,
		wHeight: 32,
		offsetX: 5,
		offsetY: -4,
		addOffset: -30,
		attackRect: [27, 23, 0, 32]
	}
};

game.weapon = me.ObjectEntity.extend({
	init: function(x, y, image, sw, sh, owner, settings) {
		// General init stuff
		var self = this;
		self.owner = owner;
		self.weapon = owner.equippedWep;
		self.parent(x, y, {image: self.weapon.image, spritewidth: sw, spriteheight: sh});
		
		self.collidable = true;
		self.needsUpdate = false;

		self.addOffet = 0;
		self.addAnimation("static", [0, 1]);
		self.setCurrentAnimation("static");
		
		self.updateColRect(0, 0, 0, 0);
		
		if(self.weapon.animation.length > 1) {
			self.addAnimation("attack", self.weapon.animation);
			self.animated = true;
		} 
		
		// Correct for if the player is facing left when the weapon is created
		if(self.owner.facing == 'left') {
			self.flipX(true);
			self.addOffset = self.weapon.addOffet;
		} else {
			self.addOffset = 0;
		}
		
		this.updatePosition();
	},
	
	attack: function() {
		var self = this;
		if(self.owner.facing == 'right') {
			self.updateColRect(self.weapon.attackRect[0], self.weapon.attackRect[1], self.weapon.attackRect[2], self.weapon.attackRect[3]);
		} else {
			self.updateColRect(0, self.weapon.attackRect[1], self.weapon.attackRect[2], self.weapon.attackRect[3]);
		}
		self.setCurrentAnimation("attack", "static");
		self.setAnimationFrame();
		
		setTimeout(function() {
			self.updateColRect(0, 0, 0, 0);
		}, 450);
		
	},
	
	updatePosition: function() {
		var self = this;
		
		self.needsUpdate = self.owner.attacking;
		
		if (me.input.isKeyPressed('left')) {
			self.flipX(true);
			self.addOffset = self.weapon.addOffset;
			self.needsUpdate = true;
		} else if (me.input.isKeyPressed('right')) {
			self.flipX(false);
			self.addOffset = 0;
			self.needsUpdate = true;
		} 
		
		if (me.input.isKeyPressed('attack') && !self.owner.attacking) {
			self.attack();
			self.owner.attacking = true;
			
			setTimeout(function() {
				self.owner.attacking = false;
			}, self.weapon.rate);
		}
		
		var res = me.game.collide(self);
		
		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				res.obj.removeHP(self.weapon.damage);
			} 
		}
		
		self.pos.x = self.owner.pos.x + self.weapon.offsetX + self.addOffset;
		self.pos.y = self.owner.pos.y + self.weapon.offsetY;
	},
	
	update: function() {
		this.updatePosition();
		this.parent(this);
		
		return this.needsUpdate;
	}
});

game.Death = me.ObjectEntity.extend({
	init: function() {
		var self = this;
		this.player = me.game.getEntityByName("player")[0];
		var x = this.player.pos.x;
		var y = this.player.pos.y;
		self.parent(x, y, {image: "chargib", spritewidth: 32});
		self.init = true;

		self.gravity = 0;
		self.animationspeed = 4;
		
		this.pos.x = x;
		this.pos.y = y;
		
		
	},

	update: function() {
		var self = this;
		
		if(self.init) {
			setTimeout(function() {
				me.game.remove(self);
			}, 500);
			self.init = false;
		}
		
		this.parent(this);
		
		return true;
	}
});