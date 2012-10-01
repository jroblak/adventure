game.physicsEngine = {
	
	//helper function that returns a random angle for the bullet to ricochet
	ranAngle: function(dir, type) {
		if(type === 'solid') {
			if(dir === 'right') {
				return Math.floor(Math.random() * (181)) + 90;
			} else {
				var ran = Math.random();
				if(ran < .5) {
					return Math.floor(Math.random() * (90)) + 1
				} else {
					return Math.floor(Math.random() * (91)) + 270;	
				}
			}
		}
	}
};