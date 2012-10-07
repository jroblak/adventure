game.CharacterEntity = game.Sprite.extend({
	
	init: function(x, y, settings) {
		var self = this;
		settings.compose = '[{"name":"'+settings.name+'"}]';
		self.parent(x, y, settings);
		
		self.attacking = false;
		
		self.weapons = [];
		self.equipped = [];
		
		self.currentWep = null;
		self.currentGear = null;
		
		self.hp = 1;
		
		self.collidable = true;
		self.facing = 'right';
	},
	
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
	
	removeHP: function(dmg) {
		this.hp -= dmg;
		this.flicker(45);
		if(this.hp <= 0) {
			me.game.remove(this);
		}
	},
	
	addHP: function(newhealth) {
		this.hp += newhealth;
	},
	
	getMovements: function() {
		// add default movement for NPCs/Enemies
	},

	update: function() {
		
		if(this.visible) {
			this.getMovements();
			this.updateMovement();
		}
		
		if(this.vel.x != 0 || this.vel.y != 0) {
	    	this.parent(this);
			return true;
		}
		
		return false;
		
	}
});