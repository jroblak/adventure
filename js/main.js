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
		
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.X, "jump", true);
		
		me.state.change(me.state.PLAY);
	}

};

var PlayScreen = me.ScreenObject.extend({
	
	onResetEvent: function() {
		me.levelDirector.loadLevel('map1');
	},
	
	onDestroyEvent: function() {
		//placeholder
	}
});

window.onReady(function() {
	jsApp.onload();
});