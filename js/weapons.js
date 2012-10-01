var weapons = {
	basic: {
		firerate: 2,
		damage: 2,
		speed: .5,
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
		this.gravity = 0;
		
		if(me.game.getEntityByName("player")[0].facing == 'right') {
			this.facing = 'right';
		} else {
			this.facing = 'left';
		}
	},
	
	update: function() {
		
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
		
		this.updateMovement();
		return true;
	}
});