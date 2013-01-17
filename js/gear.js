// Just an object containing the attributes of available gear
game.equipable = {
	jetpack: {
		name: 'jetpack',
		image: 'jetpack',
		width: 8,
		height: 22,
		speed: 5,
		offsetX: 2,
		offsetY: 10
	}
}

//  Generic "gear" entity -- created when a player or enemy picks up a piece of gear
game.gear = me.AnimationSheet.extend({
	init: function(x, y, image, sw, sh, owner, settings) {
		// General init stuff
		var self = this;
		self.owner = owner;
		self.gear = owner.equippedGear;
		self.parent(x, y, image, sw, sh);
		self.addOffet = 20;
		self.needsUpdate = false;
		
		self.addAnimation("idle", [0]);
		self.addAnimation("flying", [1, 2, 3, 4]);
		self.setCurrentAnimation("idle");

		// Correct for if the player is facing left when the gear is created
		if(self.owner.facing == 'left') {
			self.flipX(true);
			self.addOffset = 20;
		} else {
			self.addOffset = 0;
		}
		self.updatePosition();
	},
	
	updatePosition: function() {
		var self = this;
		self.needsUpdate = false;
		
		// When the player changes left or right, change the offset so it stays "behind" the player
		if (me.input.isKeyPressed('left')) {
			self.flipX(true);
			self.addOffset = 20;
			self.needsUpdate = true;
		} else if (me.input.isKeyPressed('right')) {
			self.flipX(false);
			self.addOffset = 0;
			self.needsUpdate = true;
		} 
		
		if(me.input.isKeyPressed('fly')) {
			self.setCurrentAnimation("flying");
			self.needsUpdate = true;
		} else {
			self.setCurrentAnimation("idle");
		}
		
		// update the X, Y pos
		self.pos.x = self.owner.pos.x + self.gear.offsetX + self.addOffset;
		self.pos.y = self.owner.pos.y + self.gear.offsetY;
	},
	
	update: function() {
		
		//update the sprite
		this.updatePosition();	
		this.parent(this);
	
		return self.needsUpdate;
	}
});