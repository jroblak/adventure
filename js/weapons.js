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
	},
	
	update: function() {
		//follow player
		//velocity from the weapons object?
		this.vel.x -= 1;
		
		//do collision
		
		this.updateMovement();
		return true;
	}
});

var weapon = me.ObjectEntity.extend({
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.collidable = true;
	},
	
	update: function() {
		//follow player
		
		this.updateMovement();
		return true;
	}
});