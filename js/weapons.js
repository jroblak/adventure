// Object used to store data on all available weapons in the game
game.weapons = {
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

// A weapon entity -- used to control, animate, do dmg, etc for weapons
// Created when a player or enemy picks up / equips a weapon
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
		
		self.updateColRect(1, 1, 1, 1);
		
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
	
	// Change the collision rect and animation when attacking so it can do damage
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
			self.updateColRect(1, 1, 1, 1);
		}, 450);
		
	},
	
	updatePosition: function() {
		var self = this;
		
		self.needsUpdate = self.owner.attacking;
		
		// Offsets so the weapon remains in the players hand
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
		
		if(res && self.owner.attacking) {
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