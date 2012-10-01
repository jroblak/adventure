game.weapons = {
	basic: {
		firerate: 2,
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
		firerate: 15,
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
		this.parent(x, y, {image: gun.projectile, spriteWidth: gun.pWidth});
		//change all this to do it right -- actual physics; work on
		//grenade launcher next
		this.gravity = gun.physics.weight;
		this.gun = gun;
		this.collidable = true;
		this.owner = owner;
		this.pos.y = this.owner.pos.y + this.gun.offsetY;
		
		if(this.owner.facing == 'right') {
			this.facing = 'right';
			this.vel.x = gun.speed;
			this.pos.x = this.owner.pos.x + this.gun.offsetX;
		} else {
			this.facing = 'left';
			this.vel.x = -gun.speed;
			this.pos.x = this.owner.pos.x;
		}
	},
	
	update: function() {

		if(this.ricochet) {
			//change this to a helper function / calls to physics lib
			this.pos.x += Math.cos((Math.PI/180)*this.angle)*this.vel.x;
			this.pos.y += Math.sin((Math.PI/180)*this.angle)*this.vel.x;
		} else {
			this.pos.x += this.vel.x;
		}
		
		var res = me.game.collide(this);
		var hit = this.updateMovement();

		if(res) {
			if(res.obj.type == me.game.ENEMY_OBJECT) {
				res.obj.removeHP(this.gun.damage);
				me.game.remove(this);
			}
		} else if(hit.xprop.type === 'solid') {
			this.angle = game.physicsEngine.ranAngle(this.facing, 'solid');
			this.ricochet = true;
			this.vel.x = (this.facing == 'right') ? -this.gun.speed : this.gun.speed;
			this.facing = (this.facing == 'right') ? this.facing = 'left' : this.facing = 'right';
		} else if(hit.xprop.type === 'lslope' || hit.xprop.type === 'rslope' ) {
			me.game.remove(this);
		}
		
		return true;
	}
});

game.weapon = me.SpriteObject.extend({
	init: function(x, y, gun, owner) {
		this.parent(x, y, me.loader.getImage(gun.gImg), gun.gWidth);
		this.addOffset = 0;
		this.moveOffset = 0;
		this.jumpOffset = 0;
		this.owner = owner;
		this.gun = gun;
	},
	
	updatePos: function() {
		if (me.input.isKeyPressed('left')) {
			this.moveOffset = -3;
			this.flipX(true);
			this.addOffset = -26;
		} else if (me.input.isKeyPressed('right')) {
			this.moveOffset = 3;
			this.flipX(false);
			this.addOffset = 0;
		} else {
			this.moveOffset = 0;
		}
		if (this.owner.jumping) {
			this.jumpOffset = -4;
		} else if (this.owner.falling) {
			this.jumpOffset = 5;
		} else {
			this.jumpOffset = 0;
		}
		
		this.pos.x = this.owner.pos.x + this.gun.offsetX + this.addOffset + this.moveOffset;
		this.pos.y = this.owner.pos.y + this.gun.offsetY + this.jumpOffset;
	},
	
	update: function() {
		
		this.updatePos();		
	
		return true;
	}
});