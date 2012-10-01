var weapons = {
	basic: {
		firerate: 2,
		damage: 2,
		speed: 2,
		gravity: 2,
		gImg: "bWep",
		projectile: "basic",
		pWidth: 4,
		gWidth: 8
	},
	machinegun: {
		firerate: 15,
		damage: 1,
		speed: 2,
		gravity: 2,
		gImg: "mGun",
		projectile: "basic",
		pWidth: 4,
		gWidth: 10
	}
};

var bullet = me.ObjectEntity.extend({
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.collidable = true;
		this.gravity = 0;
	},
	
	update: function() {
		
		//velocity from the weapons object, player facing
		this.vel.x += 1;
		
		//do collision
		
		this.updateMovement();
		return true;
	}
});

var weapon = me.ObjectEntity.extend({
	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.gravity = 0;
	},
	
	update: function() {
		//follow player
		this.pos.x = me.game.getEntityByName("player")[0].pos.x + 27;
		this.pos.y = me.game.getEntityByName("player")[0].pos.y + 15;
		
		this.updateMovement();
		return true;
	}
});