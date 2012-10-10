game.CharacterEntity = game.Sprite.extend({
	
	init: function(x, y, settings) {
		var self = this;
		settings.compose = '[{"name":"'+settings.name+'"}]';
		self.parent(x, y, settings);
		
		self.attacking = false;
		self.animated = false;
		self.standing = true;
		
		self.weapons = [];
		self.equipped = [];
		
		self.currentWep = null;
		self.currentGear = null;
		
		self.hp = 1;
		
		self.collidable = true;
		self.facing = 'right';
	},
	
	equipWep: function(wepstring) {
		if(this.equippedWep) {
			this.removeCompositionItem(this.equippedWep.name);
		}
		var wep = game.weapons[wepstring];
		this.equippedWep = wep; 
		this.addCompositionItem({"name":wep.name,"class":"game.weapon","image":wep.image, "spritewidth":wep.wWidth,"spriteheight":wep.wHeight});
		this.setCompositionOrder(this.name, wep.name);
	},
	
	equipGear: function(gearstring) {
		if(this.equippedGear) {
			this.removeCompositionItem(this.equippedGear.name);
		}
		var gear = game.equipable[gearstring];
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
	
	checkAnimation: function(moving) {
		if(moving) {
			if(this.animated) {
				return;
			} else {
				this.animated = true;
				this.standing = false;
				this.setCurrentAnimation("walk");
			}
		} else {
			if(self.standing) {
				return;
			} else {
				this.standing = true;
				this.animated = false;
				this.setCurrentAnimation("stand");
			}
		}
			
	},
	
	getMovements: function() {
		// add default movement for NPCs/Enemies
	},

	update: function() {
		
		if(this.visible) {
			this.getMovements();
			this.updateMovement();
			this.parent(this);
		}
		
		if(this.vel.x !=0 || this.vel.y != 0 || this.attacking) {
			return true;
		}
		return false;
		
	}
});