game.StoryEntity = me.ObjectEntity.extend({
	init: function(x, y, story) {
		var self = this;
		self.parent(x, y, {image: "explode", spritewidth: 1});
		
		self.story = story;
		
		self.storySize = 24;

		self.storyX = this.pos.x - me.game.viewport.pos.x;
		self.storyY = this.pos.y - me.game.viewport.pos.y - 20;
		
		self.storyTeller = new me.Font('century gothic', self.storySize, 'black');
		
		var tween = new me.Tween(self)
			.to({storyX: 0,
				 storyY: 0,
				 storySize: 0
				}, 6000);
		tween.start();
		
	},
	
	draw: function(context) {
		this.storyTeller.draw(context, this.story, this.storyX, this.storyY);
		this.storyTeller.set('century gothic', this.storySize, 'black');
	}
});
