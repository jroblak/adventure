game.physicsEngine = {
	
	//helper function - return random number between min and max
	rand: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	
	//returns a random angle based on the collision object, and initial direction of projectile
	ranAngle: function(dir, type) {
		if(type === 'solid') {
			if(dir === 'right') {
				return rand(90, 270);
				return Math.floor(Math.random() * (181)) + 90;
			} else {
				if(rand(1,10) < 5) {
					return rand(1, 90);
				} else {
					return rand(270, 360);
				}
			}
		}
	}
};