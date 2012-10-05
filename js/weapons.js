// Object that holds all of the games weapons (objects)
// Each weapons object holds values for everything related to that weapon
// They're all pretty self-explainitory
// Put in separate file?
game.weapons = {
	basic: {
		name: 'handgun',
		firerate: 500,
		damage: 2,
		speed: 5,
		physics: {
			weight: .005,
			mass: 1,
			shape: 'round',
			rico: true
		},
		gImg: "bWep",
		projectile: "basic",
		pWidth: 4,
		gWidth: 8,
		gHeight: 8,
		offsetX: 23,
		offsetY: 15
	},
	machinegun: {
		name: 'machinegun',
		firerate: 150,
		damage: 1,
		speed: 4,
		physics: {
			weight: .007,
			mass: 1,
			shape: 'round',
			rico: false
		},		
		gImg: "mGun",
		projectile: "basic",
		pWidth: 4,
		gWidth: 10,
		gHeight: 10,
		offsetX: 25,
		offsetY: 15
	},
	rocket: {
		name: 'rocket',
		firerate: 1000,
		damage: 5,
		speed: 3,
		physics: {
			weight: .008,
			mass: 10,
			shape: 'round',
			rico: false
		},		
		gImg: "rGun",
		projectile: "rocket",
		explode: true,
		pWidth: 6,
		gWidth: 12,
		gHeight: 12,
		offsetX: 25,
		offsetY: 12
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
		
		// TO DO:
		// Implement new projectiles (rockets, flames, grenades)
		// Implement animations for special projectiles (rockets, flames, grenades)
		
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
		
		// Update projectile position
		// If it's ricocheting , convert angle to radians and use to adject movement
		// If it's bouncing - TO DO
		if(self.ricochet) {
			self.pos.x += Math.cos((Math.PI/180)*self.angle)*self.vel.x;
			self.pos.y += Math.sin((Math.PI/180)*self.angle)*self.vel.x;
		} else if (self.bounce) {
		} else {
			self.pos.x += self.vel.x;
		}
		
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
			
			// If the projectile is allowed to ricochet, set it's velocity, direction, and angle
			if(self.gun.physics.rico) {
				self.angle = game.physicsEngine.ranAngle(self.facing, 'solid');
				self.vel.x = (self.facing == 'right') ? -self.gun.speed : self.gun.speed;
				self.facing = (self.facing == 'right') ? self.facing = 'left' : self.facing = 'right';
				setTimeout(function() {
					me.game.remove(self);
				}, 25);
			// Else if it bounces, handle that - TO DO
			} else if(self.gun.physics.bounce) {
			}else {
				self.destroyMe();
			}
		// Handling for when it hits a slope - TO DO
		} else if(hit.xprop.type === 'lslope' || hit.xprop.type === 'rslope' ) {
			self.destroyMe();
		} else {
			if(!self.visible) {
				me.game.remove(self);
			} else if (self.pos.x <= 0) {
				self.destroyMe();
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
		self.gun = owner.equippedWep;
		self.parent(x, y, image, sw, sh);
		self.addOffet = 0;

		// Correct for if the player is facing left when the gun is created
		if(self.owner.facing == 'left') {
			self.flipX(true);
			self.addOffset = -self.gun.offsetX;
			self.pos.x = self.owner.pos.x + self.gun.offsetX + self.addOffset;
			self.pos.y = self.owner.pos.y + self.gun.offsetY;
		} else {
			self.addOffset = 0;
			self.pos.x = self.owner.pos.x + self.gun.offsetX + self.addOffset;
			self.pos.y = self.owner.pos.y + self.gun.offsetY;
		}
	},
	
	updatePosition: function() {
		var self = this;
		
		// If the player is moving, add a offset to correct for the 'shadowing'
		if (me.input.isKeyPressed('left')) {
			self.flipX(true);
			self.addOffset = -self.gun.offsetX;
		} else if (me.input.isKeyPressed('right')) {
			self.flipX(false);
			self.addOffset = 0;
		} 
		
		// update the X, Y pos
		self.pos.x = self.owner.pos.x + self.gun.offsetX + self.addOffset;
		self.pos.y = self.owner.pos.y + self.gun.offsetY;
	},
	
	update: function() {
		
		//update the sprite
		this.updatePosition();	
		this.parent();
	
		return true;
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
		
		this.parent();
		
		return true;
	}
});