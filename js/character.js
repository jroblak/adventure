
// TO DO: Make more generic (character) and then use to extend a new player entity and enemy entity
// doesn't make sense to duplicate the code among player and enemies
// Maybe remove the shooting logic from here and move it to the weapon object

game.CharacterEntity = game.Sprite.extend({
	
	init: function(x, y, settings) {
		// Init 
		var self = this;
		settings.compose = '[{"name":"'+settings.name+'"}]';
		self.parent(x, y, settings);
		
		self.attacking = false;
		
		self.weapons = [];
		self.equipped = [];
		
		self.currentWep = null;
		self.currentGear = null;
		self.collidable = true;
		
		self.hp = 1;
		
		self.facing = 'right';
		
		if(self.currentWep) {
			self.equipWep(self.weapons[self.currentWep]);
		} 
		if(self.currentWep) {
			self.equipGear(self.equipped[self.currentGear]);
		}
	},
	
	// Function that equips a new weapon. Uses sprite composition 'manager' inherited from
	// SpriteObject (sprite.js)
	equipWep: function(wep) {
		if(this.equippedWep) {
			this.removeCompositionItem(this.equippedWep.name);
		}
		this.equippedWep = wep; 
		this.addCompositionItem({"name":wep.name,"class":"game.weapon","image":wep.gImg,"spritewidth":wep.gWidth,"spriteheight":wep.gHeight});
		this.setCompositionOrder(wep.name, this.name);
	},
	
	equipGear: function(gear) {
		if(this.equippedGear) {
			this.removeCompositionItem(this.equippedGear.name);
		}
		this.equippedGear = gear;
		this.addCompositionItem({"name":gear.name,"class":"game.gear","image":gear.image,"spritewidth":gear.width,"spriteheight":gear.height});
		this.setCompositionOrder(this.name, gear.name);
	},
	
	// Function that removes 'hp' from the enemy if its attacked - called by the projectile
	// object
	removeHP: function(dmg) {
		this.hp -= dmg;
		this.flicker(45);
		if(this.hp <= 0) {
			me.game.remove(this);
		}
	},
	
	getMovements: function() {
		
	},

	update: function() {
		
		if(this.visible) {
			this.getMovements();
			this.updateMovement();
		}
		if(this.vel.x != 0 || this.vel.y != 0) {
	    	return this.parent();
		}
		
	}
});