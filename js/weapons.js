weapons = {
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

game.bullet = me.ObjectEntity.extend({
	init: function(x, y, settings, owner) {
		this.parent(x, y, settings);
		this.gravity = 0;
		this.owner = owner;
		
		if(this.owner.facing == 'right') {
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

game.weapon = me.ObjectEntity.extend({
	init: function(x, y, settings, gun) {
		this.parent(x, y, settings);
		this.gravity = 0;
		this.gun = gun;
	},
	
	update: function() {
		//follow player 
		
		this.updateMovement();
		return true;
	}
});