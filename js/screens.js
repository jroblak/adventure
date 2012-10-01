game.PlayScreen = me.ScreenObject.extend({
		
	onResetEvent: function() {
		me.levelDirector.loadLevel('map1');
			
		me.game.addHUD(0, 0, 640, 40);
		me.game.HUD.addItem("score", new game.ScoreObject(575, 1));
		me.game.sort();
	},
		
	onDestroyEvent: function() {
		me.game.disableHUD();
	}
});