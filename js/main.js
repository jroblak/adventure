// main.js
var g_resources = [{
		name: 'map1tiles',
		type: 'image',
		src: 'img/map1tiles.png'
	}, {
		name: 'map1',
		type: 'tmx',
		src: 'tiles/map1.tmx'
	}, {
		name: 'char',
		type: 'image',
		src: 'img/char.png'
	}, {
		name: 'staticbgmt',
		type: 'image',
		src: 'img/staticbgmt.png'
	}, {
		name: 'parallaxbgmt',
		type: 'image',
		src: 'img/parallaxbgmt.png'
	}, {
		name: 'bad1',
		type: 'image',
		src: 'img/bad1.png'
	}, {
		name: 'coin',
		type: 'image',
		src: 'img/coin.png'
}];

var jsApp = {
	
	onload: function() {
		if (!me.video.init('jsapp', 640, 480, false, 1.0)) {
			console.log('browser doesn\'t support html 5 canvas');
			return;
		}
		
		me.audio.init('mp3, ogg');
		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(g_resources);
		me.state.change(me.state.LOADING);
	},
	
	loaded: function() {
		me.state.set(me.state.PLAY, new PlayScreen());
		
		me.entityPool.add("player", PlayerEntity);
		me.entityPool.add("coin", CoinEntity);
		me.entityPool.add("enemy", EnemyEntity);
		//me.debug.renderHitBox = true;
		
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.X, "jump", true);
		me.input.bindKey(me.input.KEY.Z, "shoot", true)
		
		me.state.change(me.state.PLAY);
	}

};

var PlayScreen = me.ScreenObject.extend({
	
	onResetEvent: function() {
		me.levelDirector.loadLevel('map1');
		
		me.game.addHUD(0, 0, 640, 40);
		me.game.HUD.addItem("score", new ScoreObject(575, 1));
		me.game.sort();
	},
	
	onDestroyEvent: function() {
		me.game.disableHUD();
	}
});

window.onReady(function() {
	jsApp.onload();
});