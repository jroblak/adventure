game.weapons = {
	basic: {
		firerate: 500,
		damage: 2,
		speed: 5,
		physics: {
			weight: .005,
			mass: 1,
			shape: 'round'
		},
		gImg: "bWep",
		projectile: "basic",
		pWidth: 4,
		gWidth: 8,
		offsetX: 25,
		offsetY: 15
	},
	machinegun: {
		firerate: 150,
		damage: 1,
		speed: 4,
		physics: {
			weight: .05,
			mass: 1,
			shape: 'round'
		},		
		gImg: "mGun",
		projectile: "basic",
		pWidth: 4,
		gWidth: 10,
		offsetX: 25,
		offsetY: 15
	}
};

game.bullet = me.ObjectEntity.extend({
	init: function(x, y, gun, owner) {
		var self = this;
		
		self.parent(x, y, {image: gun.projectile, spriteWidth: gun.pWidth});
		self.gravity = gun.physics.weight;
		self.gun = gun;
		self.collidable = true;
		self.owner = owner;
		self.pos.y = self.owner.pos.y + self.gun.offsetY;
		
		
		if(self.owner.facing == 'right') {
			self.facing = 'right';
			self.vel.x = gun.speed;
			self.pos.x = self.owner.pos.x + self.gun.offsetX;
		} else {
			self.facing = 'left';
			self.vel.x = -gun.speed;
			self.pos.x = self.owner.pos.x;
		}
	},
	
	update: function() {
		var self = this;
		/*
		if(self.ricochet) {
			self.pos.x += Math.cos((Math.PI/180)*self.angle)*self.vel.x;
			self.pos.y += Math.sin((Math.PI/180)*self.angle)*self.vel.x;
		} else {
		*/
			self.pos.x += self.vel.x;
		//}
		
		var res = me.game.collide(self);
		var hit = self.updateMovement();

		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				res.obj.removeHP(self.gun.damage);
				me.game.remove(self);
			}
		} else if(hit.xprop.type === 'solid') {
			/*
			self.angle = game.physicsEngine.ranAngle(self.facing, 'solid');
			self.ricochet = true;
			self.vel.x = (self.facing == 'right') ? -self.gun.speed : self.gun.speed;
			self.facing = (self.facing == 'right') ? self.facing = 'left' : self.facing = 'right';
			setTimeout(function() {
				me.game.remove(self);
			}, 100);
			*/
			me.game.remove(self);
		} else if(hit.xprop.type === 'lslope' || hit.xprop.type === 'rslope' ) {
			me.game.remove(self);
		} else {
			setTimeout(function() {
				me.game.remove(self);
			}, 2000);
		}
		
		if (self.vel.x != 0 || self.vel.y != 0) {
			self.parent(self);
			return true;
		}
	}
});

game.weapon = me.SpriteObject.extend({
	init: function(x, y, gun, owner) {
		var self = this;
		
		self.parent(x, y, me.loader.getImage(gun.gImg), gun.gWidth);
		self.addOffset = 0;
		self.moveOffset = 0;
		self.jumpOffset = 0;
		self.owner = owner;
		self.gun = gun;
	},
	
	updatePos: function() {
		var self = this;
		
		if (me.input.isKeyPressed('left')) {
			self.moveOffset = -3;
			self.flipX(true);
			self.addOffset = -26;
		} else if (me.input.isKeyPressed('right')) {
			self.moveOffset = 3;
			self.flipX(false);
			self.addOffset = 0;
		} else {
			self.moveOffset = 0;
		}
		if (self.owner.jumping) {
			self.jumpOffset = -4;
		} else if (self.owner.falling) {
			self.jumpOffset = 5;
		} else {
			self.jumpOffset = 0;
		}
		
		self.pos.x = self.owner.pos.x + self.gun.offsetX + self.addOffset + self.moveOffset;
		self.pos.y = self.owner.pos.y + self.gun.offsetY + self.jumpOffset;
	},
	
	update: function() {
		
		this.updatePos();		
	
		return true;
	}
});