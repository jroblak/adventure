// Coin entity -- simple gets collected and adds to the score when it does.
// TO DO: Fix so guns don't collect/destroy them
game.CoinEntity = me.CollectableEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},
	
	onCollision: function() {
		me.game.HUD.updateItemValue("score", 250);
		this.collidable = false;
		me.game.remove(this);
	}
});

// Score object for the HUD. Just text that gets updated
game.ScoreObject = me.HUD_Item.extend({
	init:function(x, y) {
		this.parent(x, y);
		this.font = new me.Font('century gothic', 24, 'black');
	},
	draw: function(context, x, y){
		this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
	}	
});