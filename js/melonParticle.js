
var TO_RADIANS = Math.PI / 180; 

/*------------------- 
fire
-------------------------------- */
var FireEntity = me.InvisibleEntity.extend({
    /* -----
    constructor
    ------ */
    init: function (x, y, settings) {
        // init particles
        this.particles = [],
            this.MAX_PARTICLES = 100;
        // call the constructor
        this.parent(x, y, settings);
    },
    /* -----
    update 
    ------ */
    update: function () {
        return true;
    },
    /* -----
    draw 
    ------ */
    draw: function (context) {
        if (this.particles.length <= this.MAX_PARTICLES) {
            makeParticle(this, 1, this.pos.x + 18, this.pos.y + 10);
            // iteratate through each particle
            for (i = 0; i < this.particles.length; i++) {
                var particle = this.particles[i];
                // render it
                particle.render(context);
                // and then update
                particle.update();
            }
            // Keep taking the oldest particles away
            while (this.particles.length > this.MAX_PARTICLES) {
                this.particles.shift();
            }
        }
        return true;
    }
});

/*------------------- 
fire
-------------------------------- */
var SmokeEntity = me.InvisibleEntity.extend({
    /* -----
    constructor
    ------ */
    init: function (x, y, settings) {
        this.wait = 0;
        // init particles
        this.particles = [],
	        this.MAX_PARTICLES = 60,
	        this.particleImage = new Image();
        this.particleImage.src = "img/smoke.png";
        // call the constructor
        this.parent(x, y, settings);
    },
    /* -----
    update 
    ------ */
    update: function () {
        return true;
    },
    /* -----
    draw 
    ------ */
    draw: function (context) {
		console.log('here');
        if (this.particles.length <= this.MAX_PARTICLES) {
            this.wait = this.wait == 3 ? 0 : this.wait + 1;
            if (this.wait == 0) {
                makeImageParticle(this, 1, this.pos.x + 18, this.pos.y + 30);
            }
            // makeParticle(this, 1, this.pos.x + 18, this.pos.y + 10);
            this.particle.velX = randomRange(-0.5, 0.5);
            this.particle.velY = 0;
            this.particle.size = randomRange(0.4, 0.7);
            this.particle.maxSize = 1.3;
            this.particle.alpha = randomRange(0.4, 0.8);
            this.particle.gravity = -0.2;
            this.particle.drag = 0.96;
            this.particle.shrink = 1.04;
            this.particle.fade = 0.007;
            //particle.rotation = randomRange(0,360);
            this.particle.spin = randomRange(-5, 5);
            this.particle.compositeOperation = 'lighter';

            // iteratate through each particle
            for (i = 0; i < this.particles.length; i++) {
                var particle = this.particles[i];
                // render it
                particle.render(context);
                // and then update
                particle.update();
            }
            // Keep taking the oldest particles away
            while (this.particles.length > this.MAX_PARTICLES) {
                this.particles.shift();
            }
        }
        return true;
    }
});


/*------------------- 
fire
-------------------------------- */
var FlameEntity = me.InvisibleEntity.extend({
    /* -----
    constructor
    ------ */
    init: function (x, y, settings) {
        this.wait = 0;
        // init particles
        this.particles = [],
	        this.MAX_PARTICLES = 30,
	        this.particleImage = new Image();
        this.particleImage.src = "img/flame.png";
        // call the constructor
        this.parent(x, y, settings);
    },
    /* -----
    update 
    ------ */
    update: function () {
        return true;
    },
    /* -----
    draw 
    ------ */
    draw: function (context) {
        console.log(this.wait);
        if (this.particles.length <= this.MAX_PARTICLES) {
            this.wait = this.wait == 3? 0 : this.wait + 1;
            if(this.wait == 0){
                makeImageParticle(this, 1, this.pos.x + 18, this.pos.y + 10);
                this.particle.velX = randomRange(-0.5, 0.5);
                this.particle.velY = 0;
                this.particle.size = randomRange(0.8, 1);
                this.particle.maxSize = 0.7;
                this.particle.alpha = randomRange(0.7, 1);
                this.particle.gravity = -0.2;
                this.particle.drag = 0.96;
                this.particle.shrink = 1.04;
                this.particle.fade = 0.02;
                //particle.rotation = randomRange(0,360);
                this.particle.spin = randomRange(-5, 5);
                //this.particle.shimmer = true;	
                this.particle.compositeOperation = 'lighter';
            }
           

            // iteratate through each particle
            for (i = 0; i < this.particles.length; i++) {
                var particle = this.particles[i];
                // render it
                particle.render(context);
                // and then update
                particle.update();
            }
            // Keep taking the oldest particles away
            while (this.particles.length > this.MAX_PARTICLES) {
                this.particles.shift();
            }
        }
        return true;
    }
});


 function makeParticle(emitter, particleCount, x, y) {
    for (var i = 0; i < particleCount; i++) {
        //create particle
        var particle = new Particle(x, y); 

        particle.velX = randomRange(-0.5,0.5);
        particle.velY = 0;
		particle.size = randomRange(0.8,6);
		particle.maxSize = 1.2; 
		particle.alpha = randomRange(0.3,0.5);
		particle.gravity = -0.2; 
		particle.drag = 0.96;
		particle.shrink = 1.03; 
		particle.fade = 0.007; 

		particle.rotation = randomRange(0,360);
		particle.spin = randomRange(-5,5); 

        emitter.particles.push(particle);
    }
}

 function makeImageParticle(emitter, particleCount, x, y) {
    for (var i = 0; i < particleCount; i++) {
        //create particle
        emitter.particle = new ImageParticle(emitter.particleImage, x, y); 
        emitter.particles.push(emitter.particle);
    }
}


function Particle(posx, posy) {
	// the position of the particle
	this.posX = posx; 
	this.posY = posy; 
	// the velocity 
	this.velX = 0; 
	this.velY = 0; 
	
	// multiply the particle size by this every frame
	this.shrink = 1; 
	this.size = 1; 

	// drag
	this.drag = 1; 
	// add this to the yVel every frame to simulate gravity
	this.gravity = 0; 
	// current transparency of the image
	this.alpha = 1; 
	// subtracted from the alpha every frame to make it fade out
	this.fade = 0; 

	this.update = function() {
		// simulate drag
		this.velX *= this.drag; 
		this.velY *= this.drag;
		// add gravity force to the y velocity 
		this.velY += this.gravity; 
		// and the velocity to the position
		this.posX += this.velX;
		this.posY += this.velY; 
		// shrink the particle
		this.size *= this.shrink;
		// and fade it out
		this.alpha -= this.fade; 
	};

	this.render = function (c) {
	    if(this.alpha<0.03) return; 
	    // set the fill style to have the right alpha
	    c.fillStyle = "rgba(255,255,255," + this.alpha + ")";
	    // draw a circle of the required size
	    c.beginPath();
	    c.arc(this.posX, this.posY, this.size, 0, Math.PI * 2, true);
	    // and fill it
	    c.fill();
	};
}


function ImageParticle(img, posx, posy) {
	// the position of the particle
	this.posX = posx; 
	this.posY = posy; 
	// the velocity 
	this.velX = 0; 
	this.velY = 0; 
	
	// multiply the particle size by this every frame
	this.shrink = 1; 
	this.size = 1; 
	// if maxSize is a positive value, limit the size of 
	// the particle (this is for growing particles).
	this.maxSize = -1;
	
	// if true then make the particle flicker
	this.shimmer = false;	

	// multiply the velocity by this every frame to create
	// drag. A number between 0 and 1, closer to one is 
	// more slippery, closer to 0 is more sticky. values
	// below 0.6 are pretty much stuck :) 
	this.drag = 1; 
	
	// add this to the yVel every frame to simulate gravity
	this.gravity = 0; 
	
	// current transparency of the image
	this.alpha = 1; 
	// subtracted from the alpha every frame to make it fade out
	this.fade = 0; 

	// the amount to rotate every frame
	this.spin = 0; 
	// the current rotation
	this.rotation = 0; 
	
	// the blendmode of the image render. 'source-over' is the default
	// 'lighter' is for additive blending.
	this.compositeOperation = 'source-over';

	// the image to use for the particle. 
	this.img = img; 

	this.update = function() {
		// simulate drag
		this.velX *= this.drag; 
		this.velY *= this.drag;
		
		// add gravity force to the y velocity 
		this.velY += this.gravity; 
		
		// and the velocity to the position
		this.posX += this.velX;
		this.posY += this.velY; 
		
		// shrink the particle
		this.size *= this.shrink;
		// if maxSize is set and we're bigger, resize!
		if((this.maxSize>0) && (this.size>this.maxSize)){
		    this.size = this.maxSize; 
		}
		
		
		// and fade it out
		this.alpha -= this.fade; 	
		if(this.alpha<0) this.alpha = 0; 
		
		// rotate the particle by the spin amount. 
		this.rotation += this.spin; 
	};

	this.render = function (c) {
	    // if we're fully transparent, no need to render!
	    if (this.alpha < 0.02) return;
	    // save the current canvas state
	    c.save();
	    // move to where the particle should be
	    c.translate(this.posX, this.posY);
	    // scale it dependent on the size of the particle
	    var s = this.shimmer ? this.size * Math.random() : this.size; //this.shimmer ? this.size * 0 : this.size; 
	    c.scale(s, s);
	    // and rotate
	    c.rotate(this.rotation * TO_RADIANS);
	    // move the draw position to the center of the image
	    c.translate(img.width * -0.5, img.width * -0.5);
	    // set the alpha to the particle's alpha
	    c.globalAlpha = this.alpha;
	    // set the composition mode
	    c.globalCompositeOperation = this.compositeOperation;
	    // and draw it! 
	    c.drawImage(img, 0, 0);
	    // and restore the canvas state
	    c.restore();
	};
}


// returns a random number between the two limits provided 
function randomRange(min, max)
{
	return ((Math.random()*(max-min)) + min); 
}