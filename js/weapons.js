game.weapons = {
	sword: {
		name: 'sword',
		animation: [1, 2, 3, 4],
		rate: 500,
		damage: 1,
		speed: null,
		gImg: "sword",
		projectile: null,
		pWidth: null,
		pHeight: null,
		wWidth: 12,
		wHeight: 12,
		offsetX: 23,
		offsetY: 15
	}
};

// Projectile object -- created every time a player 'fires' a weapon
game.projectile = me.ObjectEntity.extend({
	init: function (x, y, gun, owner) {
		// Basic init stuff
		var self = this;
		self.gun = gun;
		self.owner = owner;
		
		self.parent(x, y, {image: self.gun.projectile, spriteWidth: self.gun.pWidth});
		
		if(self.gun.explode) {
			self.canBreakTile = true;
		}
		
		//set up bullet "physics"
		self.gravity = gun.physics.weight;
		self.collidable = true;
		
		//set up initial position and direction
		if(self.owner.facing == 'right') {
			self.facing = 'right';
			self.vel.x = gun.speed;
			self.pos.x = self.owner.pos.x + self.gun.offsetX;
		} else {
			self.facing = 'left';
			self.flipX(true);
			self.vel.x = -gun.speed;
			self.pos.x = self.owner.pos.x;
		}
		self.pos.y = self.owner.pos.y + self.gun.offsetY;
	},
	
	//function that creates an explosion
	explode: function() {
		var boom = new game.Explosion(this.pos.x, this.pos.y, this.facing);
		me.game.add(boom, 2);
		me.game.sort();
	},
	
	// function to remove/blowup projectiles
	destroyMe: function() {
		if(this.gun.explode && !this.exploded) {
				this.explode();
				this.exploded = true;
			}	
		me.game.remove(this);	
	},
	
	update: function() {
		var self = this;

		self.pos.x += self.vel.x;
		
		// Collision check objects
		var res = me.game.collide(self);
		var hit = self.updateMovement();
		
		// console.log(res);
		// console.log(hit);
		
		// Checks collisions -- first checks to see if it hits an enemy object
		// Next checks to see if it hits a tile, and if so what kind
		// This is getting too jumbled; Find a way to do this better -
		// break out into more function, put into the physics objects, etc.
		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				res.obj.removeHP(self.gun.damage);
				self.destroyMe();
			} 
		}
		
		// If it hit a solid or breakable tile
		if (hit.xprop.type === 'solid' || hit.yprop.type === 'solid' || hit.xprop.type === 'breakable' || hit.yprop.type === 'breakable') {
			//if we break a breakable tile, shut off its collision to allow the player to walk through
			if (self.canBreakTile && (hit.xprop.type === 'break' || hit.yprop.type === 'break')) {
				me.game.currentLevel.clearTile(hit.x, hit.y);
				self.canBreakTile = false;
			}
			
			self.destroyMe();
			
		} else {
			if(!self.visible) {
				me.game.remove(self);
			}
		}
		
		// If the position changes, return true to update, otherwise don't
		if (self.vel.x != 0 || self.vel.y != 0) {
			self.parent(self);
			return true;
		}
		
		return false;
	}
});

// Game weapon Sprite Object -- simple sprite that moves with the player
// Created/changes whenever the player equips a new weapon
game.weapon = me.AnimationSheet.extend({
	init: function(x, y, image, sw, sh, owner, settings) {
		// General init stuff
		var self = this;
		self.owner = owner;
		self.weapon = owner.equippedWep;
		self.parent(x, y, image, sw, sh);
		
		self.addOffet = 0;
		self.addAnimation("static", [0]);
		self.setCurrentAnimation("static");
		
		if(self.weapon.animation.length > 1) {
			self.addAnimation("attack", self.weapon.animation);
			self.animated = true;
		} 
		
		// Correct for if the player is facing left when the weapon is created
		if(self.owner.facing == 'left') {
			self.flipX(true);
			self.addOffset = -self.weapon.offsetX;
			self.pos.x = self.owner.pos.x + self.weapon.offsetX + self.addOffset;
			self.pos.y = self.owner.pos.y + self.weapon.offsetY;
		} else {
			self.pos.x = self.owner.pos.x + self.weapon.offsetX + self.addOffset;
			self.pos.y = self.owner.pos.y + self.weapon.offsetY;
		}
	},
	
	attack: function() {
		var self = this;
		self.setCurrentAnimation("attack");
		setTimeout(function() {
			self.setCurrentAnimation("static");
		}, 500);
	},
	
	updatePosition: function() {
		var self = this;
		
		// If the player is moving, add a offset to correct for the 'shadowing'
		if (me.input.isKeyPressed('left')) {
			self.flipX(true);
			self.addOffset = -self.weapon.offsetX;
		} else if (me.input.isKeyPressed('right')) {
			self.flipX(false);
			self.addOffset = 0;
		} 
		
		if (me.input.isKeyPressed('attack') && !self.owner.attacking) {
			self.attack();
			self.owner.attacking = true;
			
			setTimeout(function() {
				self.owner.attacking = false;
			}, self.weapon.rate);
		}
		
		self.pos.x = self.owner.pos.x + self.weapon.offsetX + self.addOffset;
		self.pos.y = self.owner.pos.y + self.weapon.offsetY;
	},
	
	update: function() {
		this.updatePosition();
		this.parent(this);
	}
});

game.Explosion = me.ObjectEntity.extend({
	init: function(x, y, facing) {
		var self = this;
		self.parent(x, y, {image: "explode", spritewidth: 32});
		self.init = true;
		self.facing = facing;
		self.gravity = 0;
		self.animationspeed = 4;
		
		// offsets for explosion -- just subtract the offsets added to the rocket gun
		// fix these 'magic' numbers later theyre still not right
		this.pos.y -= 12;
		if(self.facing === 'right') {
			this.pos.x -= 25;
		}
		
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