// extend LevelEntity so that only our player triggers level changes, not any other objects
game.LevelChangeEntity = me.LevelEntity.extend({
	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},
	
	onCollision: function(res, obj) {
		if(obj.name === 'player') {
			this.goTo(this.gotolevel);
		}
	}
});

// Coin entity -- simple gets collected and adds to the score when it does.
// TO DO: Fix so guns don't collect/destroy them
game.CoinEntity = me.CollectableEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},
	
	onCollision: function(res, obj) {
		if(obj.name === 'player') {
			me.game.HUD.updateItemValue("score", 250);
			this.collidable = false;
			me.game.remove(this);
		}
	}
});

// A special entity that allows an entity to pick up a weapon or gear
game.PickupEntity = me.CollectableEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.item = settings.item;
		this.itemType = settings.itemType;
		this.animationpause = true;
	},
	
	onCollision: function(res, obj) {
		if(obj.name === 'player') {
			if(this.itemType === 'weapon') {
				obj.weapons.push(this.item);
				if(obj.currentWep != null) {
					obj.currentWep = obj.currentWep++;
				} else {
					obj.currentWep = 0;
				}
				obj.equipWep(this.item);
			} else {
				obj.gear.push(this.item);
				obj.equipGear(this.item);
			}
			this.collidable = false;
			me.game.remove(this);
		}
	}
});

// A special entity that can be used to trigger a special event
// I use it for the credits and jetpack exploding
game.EventEntity = me.LevelEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.item = settings.item;
		this.event = settings.event;
	},
	
	onCollision: function(res, obj) {
		if(obj.name === 'player') {
			if(this.event === 'remove') {
				var explosion = new game.Explode();
				me.game.add(explosion, 2);
				me.game.sort();
				obj.equippedGear = null;
				obj.removeCompositionItem(this.item);
			} else if (this.event === 'theend') {
				var credits = new game.CreditsEntity(obj.pos.x, obj.pos.y);
				me.game.add(credits, 3);
				me.game.sort();
				me.input.unbindKey(me.input.KEY.LEFT, "left");
				me.input.unbindKey(me.input.KEY.RIGHT, "right");
				me.input.unbindKey(me.input.KEY.X, "jump", true);
				me.input.unbindKey(me.input.KEY.Z, "attack");
				me.input.unbindKey(me.input.KEY.C, "switch", true);
				me.input.unbindKey(me.input.KEY.SPACE, "fly");
			}
			this.collidable = false;
			me.game.remove(this);
		}
	}
});

// Score object for the HUD. Just text that gets updated
game.ScoreObject = me.HUD_Item.extend({
	init:function(x, y) {
		this.parent(x, y);
		this.font = new me.Font('century gothic', 24, 'white');
	},
	draw: function(context, x, y){
		this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
	}	
});


game.HealthObject = me.HUD_Item.extend({
	init:function(x, y) {
		this.parent(x, y, game.persistent.player.hp);
		this.image = me.loader.getImage("health");
	},
	draw: function(context){
		for(var i = 0; i < this.value; i++) {
			context.drawImage(this.image,this.pos.x+(i*32),this.pos.y);
		}
	}	
});

// Entity used to display the credits
game.CreditsEntity = me.ObjectEntity.extend({
	init: function(x, y) {
		var self = this;
		// Need to set an image even though we don't use it
		// Set this up wrong originally and didn't feel like fixing it
		// since it works
		self.parent(x, y, {image: "explode", spritewidth: 1});

		self.credits1 = "         The End";
		self.credits2 = "   By: Justin Oblak";
		self.credits3 = "  You died " + game.persistent.other.deathcounter + " times!";
		self.credits4 = "Refresh to play again!";

		self.creditsSize = 24;

		self.creditsX = this.pos.x - me.game.viewport.pos.x + 100;
		self.creditsY = this.pos.y - me.game.viewport.pos.y + 400;

		self.credits = new me.Font('century gothic', self.creditsSize, 'black');

		var tween = new me.Tween(self)
			.to({creditsX: self.creditsX,
				 creditsY: -200,
				 creditsSize: 24
				}, 15000);
		tween.start();

	},

	draw: function(context) {
		this.credits.draw(context, this.credits1, this.creditsX, this.creditsY);
		this.credits.draw(context, this.credits2, this.creditsX, this.creditsY + 50);
		this.credits.draw(context, this.credits3, this.creditsX, this.creditsY + 100);
		this.credits.draw(context, this.credits4, this.creditsX, this.creditsY + 350);
		this.credits.set('century gothic', this.creditsSize, 'black');
	}
});

// An entity used to display the death animation of the player.
game.Death = me.ObjectEntity.extend({
	init: function() {
		var self = this;
		this.player = me.game.getEntityByName("player")[0];
		var x = this.player.pos.x;
		var y = this.player.pos.y;
		self.parent(x, y, {image: "chargib", spritewidth: 32});
		self.init = true;

		self.gravity = 0;
		self.animationspeed = 4;
		
		this.pos.x = x;
		this.pos.y = y;
	},

	update: function() {
		var self = this;
		
		if(self.init) {
			setTimeout(function() {
				me.game.remove(self);
			}, 500);
			self.init = false;
		}
		
		this.parent(this);
		
		return true;
	}
});

// Entity used to display the explosion animation
game.Explode = me.ObjectEntity.extend({
	init: function() {
		var self = this;
		this.player = me.game.getEntityByName("player")[0];
		var x = this.player.pos.x;
		var y = this.player.pos.y;
		self.parent(x, y, {image: "explode", spritewidth: 32});
		self.init = true;
		self.gravity = 0;
		self.animationspeed = 4;
		
		this.pos.x = x-10;
		this.pos.y = y;
	},

	update: function() {
		var self = this;
		
		if(self.init) {
			setTimeout(function() {
				me.game.remove(self);
			}, 500);
			self.init = false;
		}
		
		this.parent(this);
		
		return true;
	}
});