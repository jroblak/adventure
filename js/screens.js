// File that contains the various 'screens' for the game

// PlayerScreen - loads and changes levels, controls HUD and score
game.PlayScreen = me.ScreenObject.extend({
		
	onResetEvent: function() {
		// Load the first level on a reset event
		me.levelDirector.loadLevel('map1');
		
		// Add the HUD and a score item to the HUD
		me.game.addHUD(0, 0, 640, 480);
		me.game.HUD.addItem("score", new game.ScoreObject(575, 1));
		
		me.game.sort();
	},
		
	onDestroyEvent: function() {
		me.game.disableHUD();
	}
});

// The Custom load screen -- Placeholder taken directly from the default screen
game.CustomLoadScreen = me.ScreenObject.extend({

		init : function() {
			this.parent(true);
			// melonJS logo
			this.logo1 = new me.Font('century gothic', 32, 'white', 'middle');
			this.logo2 = new me.Font('century gothic', 32, 'white', 'middle');
			this.logo2.bold();

			// flag to know if we need to refresh the display
			this.invalidate = false;

			// handle for the susbcribe function
			this.handle = null;

			// load progress in percent
			this.loadPercent = 0;

		},

		// call when the loader is resetted

		// destroy object at end of loading
		onDestroyEvent : function() {
			// "nullify" all fonts
			this.logo1 = this.logo2 = null;
			// cancel the callback
			if (this.handle)  {
				me.event.unsubscribe(this.handle);
				this.handle = null;
			}
		},

		// make sure the screen is refreshed every frame 
		onProgressUpdate : function(progress) {
			this.loadPercent = progress;
			this.invalidate = true;
		},

		// make sure the screen is refreshed every frame 
		update : function() {
			if (this.invalidate === true) {
				// clear the flag
				this.invalidate = false;
				// and return true
				return true;
			}
			// else return false
			return false;
		},

		/*---
		
			draw function
		  ---*/

		draw : function(context) {

			// measure the logo size
			var logo1_width = this.logo1.measureText(context, "justin's").width;
			var xpos = (context.canvas.width - logo1_width - this.logo2.measureText(context, "GAME").width) / 2;
			var ypos = context.canvas.height / 2;

			// clear surface
			me.video.clearSurface(context, "black");

			// draw the melonJS logo
			this.logo1.draw(context, 'justin\'s', xpos , ypos);
			xpos += logo1_width;
			this.logo2.draw(context, 'GAME', xpos, ypos);

			ypos += this.logo1.measureText(context, "justin's").height / 2;

			// display a progressive loading bar
			var progress = Math.floor(this.loadPercent * context.canvas.width);

			// draw the progress bar
			context.strokeStyle = "silver";
			context.strokeRect(0, ypos, context.canvas.width, 6);
			context.fillStyle = "#89b002";
			context.fillRect(2, ypos + 2, progress - 4, 2);
		}

});