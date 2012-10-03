// Object that holds all of the games weapons (objects)
// Each weapons object holds values for everything related to that weapon
// They're all pretty self-explainitory
// Put in separate file?
game.weapons = {
	basic: {
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
		offsetX: 23,
		offsetY: 15
	},
	machinegun: {
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
		offsetX: 25,
		offsetY: 15
	},
	rocket: {
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
		offsetX: 25,
		offsetY: 12
	}
};

// Projectile object -- created every time a player 'fires' a weapon
// Right now it's fairly basic - an init function and an update function
game.projectile = me.ObjectEntity.extend({
	init: function (x, y, gun, owner) {
		// Basic init
		var self = this;
		self.gun = gun;
		self.owner = owner;
		self.parent(x, y, {image: self.gun.projectile, spriteWidth: self.gun.pWidth});
		
		// TO DO:
		// Implement new projectiles (rockets, flames, grenades
		// Implement animations for special projectiles (rockets, flames, grenades)
		
		
		//set up bullet physics
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
	
	explode: function() {
		var boom = new game.Explosion(this.pos.x, this.pos.y);
		me.game.add(boom, 3);
		me.game.sort();
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
		
		// Checks collisions -- first checks to see if it hits an enemy object
		// Next checks to see if it hits a tile, and if so what kind
		// This is getting too jumbled; Find a way to do this better -
		// break out into more function, put into the physics objects, etc.
		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				res.obj.removeHP(self.gun.damage);
				if(self.gun.explode && !self.exploded) {
					self.explode();
					self.exploded = true;
				}	
				me.game.remove(self);
			}
		// If it hit a solid tile and hasn't ricocheted yet (to keep it simple/for now)
		} else if(hit.xprop.type === 'solid' && !self.ricochet) {
			// If the projectile is allowed to ricochet, set it's velocity, direction, and angle
			if(self.gun.physics.rico) {
				self.angle = game.physicsEngine.ranAngle(self.facing, 'solid');
				self.ricochet = true;
				self.vel.x = (self.facing == 'right') ? -self.gun.speed : self.gun.speed;
				self.facing = (self.facing == 'right') ? self.facing = 'left' : self.facing = 'right';
				setTimeout(function() {
					me.game.remove(self);
				}, 75);
			// Else if it bounces, handle that - TO DO
			} else if(self.gun.physics.bounce) {
				//placeholder for bounces (grenades);
			// Otherwise explode and/or destroy the projectile
			} else {
				if(self.gun.explode && !self.exploded){
					self.exploded = true;
					self.explode();
					me.game.remove(self);
				} else {
					me.game.remove(self);
				}
			}
		// Handling for when it hits a slope - TO DO
		} else if(hit.xprop.type === 'lslope' || hit.xprop.type === 'rslope' ) {
			if(self.gun.explode && !self.exploded){
					self.exploded = true;
					self.explode();
					me.game.remove(self);
			} else {
				me.game.remove(self);
			}
		// If it doesn't hit anything, explode or destroy it after 2000ms
		} else {
			setTimeout(function() {
					me.game.remove(self);
			}, 2000);
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
		self.parent(x, y, me.loader.getImage(self.gun.gImg), self.gun.gWidth, self.gun.gWidth);
		self.addOffet = 0;
		// Offsets - the sprite 'shadows' the player, so I used these to correct for that
		// Not the optimal solution, but a quick easy hack and it mostly works
		
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
	
		return true;
	},
	
	draw: function(context, x, y) {
		this.parent(context);
        var viewport = me.game.viewport.pos;
	}
});

game.Explosion = me.ObjectEntity.extend({
	init: function(x, y) {
		var self = this;
		self.parent(x, y, {image: "explode", spritewidth: 32});
		self.init = true;
		this.gravity = 0;
		
	},
	update: function() {
		var self = this;
		
		if(self.init) {
			setTimeout(function() {
				me.game.remove(self);
			}, 500);
			self.init = false;
		}
		
		self.updateMovement();
		
		return true;
	}
});