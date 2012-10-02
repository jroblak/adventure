// main.js
var game = {
	
	onload: function() {			
			if (!me.video.init('gamescreen', 640, 480, false, 1.0)) {
				console.log('browser doesn\'t support html 5 canvas');
				return;
			}
			me.state.set(me.state.LOADING, new game.CustomLoadScreen());
			
			me.audio.init('mp3, ogg');
			me.loader.onload = this.loaded.bind(this);
			this.load();
			
			me.state.change(me.state.LOADING);
	},
	
	load: function() {
		var resources = [];
		
		this.resources['img'].forEach(function (value) {
			resources.push({
				name: value,
				type: "image",
				src: "img/" + value + ".png"
			})
		});
		
		this.resources['map'].forEach(function (value) {
			resources.push({
				name: value,
				type: "tmx",
				src: "tiles/" + value + ".tmx"
			})
		});
		
		me.loader.preload(resources);
	},
	
	loaded: function() {
			me.state.set(me.state.PLAY, new game.PlayScreen());
			
			me.entityPool.add("player", game.PlayerEntity);
			me.entityPool.add("coin", game.CoinEntity);
			me.entityPool.add("enemy", game.EnemyEntity);
			
			me.input.bindKey(me.input.KEY.LEFT, "left");
			me.input.bindKey(me.input.KEY.RIGHT, "right");
			me.input.bindKey(me.input.KEY.X, "jump", true);
			me.input.bindKey(me.input.KEY.Z, "shoot", false);
			me.input.bindKey(me.input.KEY.C, "switch", true);
			
			me.state.change(me.state.PLAY);
			
	}

};