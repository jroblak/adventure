game.EnemyEntity = me.ObjectEntity.extend({
	init:function(x, y, settings) {
		settings.image = 'bad1';
		settings.spritewidth = 32;
		this.hp = 4;
		
		this.parent(x, y, settings);
		this.updateColRect(4, 26, 12, 20);
		
		this.startX = x;
		this.endX = x + settings.width - settings.spritewidth;
		
		this.pos.x = x + settings.width - settings.spritewidth;
		this.walkLeft = true;
		
		this.setVelocity(4, 6);
		
		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;
	},
	
	onCollision: function(res, obj) {
		if(this.alive && (res.y > 0) && obj.falling) {
			this.flicker(45);
			this.collidable = false;
			me.game.HUD.updateItemValue("score", 250);
			me.game.remove(this);
		} 
	},
	
	removeHP: function(dmg) {
		this.hp -= dmg;
		if(this.hp <= 0) {
			me.game.remove(this);
		}
	},
	
	update: function() {
		if(!this.visible)
			return false;
		
		if(this.alive) {
			if(this.walkLeft && this.pos.x <= this.startX) {
				this.walkLeft = false;
			} else if(!this.walkLeft && this.pos.x >= this.endX) {
				this.walkLeft = true;
			}
			
			this.flipX(this.walkLeft);
			this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
		} else {
			this.vel.x = 0;
		}
		
		this.updateMovement();
		
		if(this.vel.x != 0 || this.vel.y != 0) {
			this.parent(this);
			return true;
		}
		return false;
	}
});