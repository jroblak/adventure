game.EnemyEntity = game.CharacterEntity.extend({
	init:function(x, y, settings) {
		settings.image = 'bad1';
		settings.spritewidth = 32;
		this.hp = 4;
		this.aggroed = false;
		this.firstCheck = true;
		this.dmg = 1;
		
		this.parent(x, y, settings);
		

		this.startX = x;
		this.endX = x + settings.width - settings.spritewidth;
		this.pos.x = x + settings.width - settings.spritewidth;
		this.walkLeft = true;
		
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
			//console.log("attack player!");
		} else {
			if(this.walkLeft && this.pos.x <= this.startX) {
				this.walkLeft = false;
			} else if(!this.walkLeft && this.pos.x >= this.endX) {
				this.walkLeft = true;
			}
			
			this.flipX(this.walkLeft);
			this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
		}
	}
});