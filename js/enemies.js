game.EnemyEntity = game.CharacterEntity.extend({
	init:function(x, y, settings) {
		settings.image = 'bad1';
		settings.spritewidth = 32;
		this.parent(x, y, settings);
		
		this.hp = 1;
		
		this.dmg = 1;
		this.aggroed = false;
		this.firstCheck = true;
		
		this.setVelocity(2, 6);
		
		this.type = me.game.ENEMY_OBJECT;
	},
	
	checkLOS: function() {
		if(this.firstCheck) {
			this.player = me.game.getEntityByName("player")[0];
			this.firstCheck = false;
		}

		if(this.walkLeft) {
			if(((this.pos.x - this.player.pos.x <= 100) && (this.pos.x - this.player.pos.x >= 0)) &&
				(this.pos.y - this.player.pos.y <= 150) && (this.pos.y - this.player.pos.y >= 0)) {
					return true;
			}
		} else {
			if (((this.pos.x - this.player.pos.x >= -100) && (this.pos.x - this.player.pos.x <= 0)) &&
				(this.pos.y - this.player.pos.y <= 150) && (this.pos.y - this.player.pos.y >= 0)) {
					return true;
			}
		}
		return false;
	},

	getMovements: function() {
		
		this.aggroed = this.checkLOS();
		
		if(this.aggroed) {
		} 
	}
});