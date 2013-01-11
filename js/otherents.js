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

/*
game.HealthObject = me.HUD_Item.extend({
	init:function(x, y) {
		this.parent(x, y);
		this.font = new me.Font('century gothic', 24, 'white');
	},
	draw: function(context, x, y){
		this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
	}	
});
*/