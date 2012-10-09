// Sprite object - borrowed graciously from Jason Oster's Neverwell Moor (http://parasyte.kodewerx.org/projects/lpcgame/)
// Basically a composition manager for my player object

game.Sprite = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        var self = this;
        var GUID = me.utils.createGUID();

        settings.GUID = GUID;

        // Create this object.
        self.parent(x, y, settings);

        // Set some things that the engine wants.
        self.GUID = GUID;
        self.name = settings.name ? settings.name.toLowerCase() : "";
        self.isEntity = true;

        // Compose additional sprites.
        if (settings.compose) {
            try {
                var compose = JSON.parse(settings.compose);
            }
            catch (e) {
                throw "Composition setting error. JSON PARSE: " + e + " in " + settings.compose;
            }
            self.composition = [];
            self.children = {};

            if (!Array.isArray(compose)) {
                throw "Composition setting error. NOT AN ARRAY: " + JSON.stringify(compose);
            }

            self.compose = compose;
            self.compose.forEach(function forEach(item) {
                self.addCompositionItem(item);
            });

            // Render this object first, if it is not referenced in the composition list.
            if (self.composition.indexOf(self.name) === -1) {
                self.composition.unshift(self.name);
            }
        }
    },

	// function that adds an item to the sprite
    addCompositionItem: function(item) {
        var self = this;

        // Validate composition item format.
        if (!game.isObject(item)) {
            throw "Composition setting error. NOT AN OBJECT: " + JSON.stringify(item);
        }

        // Special case for defining rendering order.
        if (item.name === self.name) {
            self.composition.push(item.name);
            return;
        }

        // Require keys.
        [ "name", "class", "image", "spritewidth", "spriteheight" ].forEach(function forEach(key) {
            if (!item.hasOwnProperty(key)) {
                throw "Composition setting error. MISSING KEY `" + key + "`: " + JSON.stringify(item);
            }
        });

        function getClass(str) {
            var node = window;
			//console.log(typeof str);
            var tokens = str.split(".");
            tokens.forEach(function forEach(token) {
                if (typeof(node) !== "undefined") {
                    node = node[token];
                }
            });
            return node;
        }

        var image = (typeof(item.image) === "string" ? me.loader.getImage(item.image) : item.image);
        // creates a new object
        self.children[item.name] = new (getClass(item.class))(
            self.pos.x,
            self.pos.y,
            image,
            item.spritewidth,
            item.spriteheight,
            self,
            item
        );

        self.composition.push(item.name);
    },
	
	removeCompositionItem: function(itemname) {
        if(this.children[itemname]) {
			console.log(this.composition);
			me.game.remove(this.children[itemname]);
			this.composition = this.composition.splice(itemname, 1);
			console.log(this.composition);
		}

    },

	// function that sets the 'order' that the sprites are drawn in
    setCompositionOrder: function(name, target, after) {
        after = (after ? 1 : -1);

        var current_idx = this.composition.indexOf(name);

        if (typeof(target) === "number") {
            this.composition.splice(current_idx, 1);
            if (target === -1) {
                this.composition.push(name);
            }
            else {
                this.composition.splice(target + +(target < 0), 0, name);
            }
        }
        else {
            var target_idx = this.composition.indexOf(target);

            if (current_idx !== (target_idx + after)) {
                if (current_idx > target_idx) {
                    this.composition.splice(current_idx, 1);
                    this.composition.splice(target_idx, 0, name);
                }
                else {
                    this.composition.splice(target_idx + 1, 0, name);
                    this.composition.splice(current_idx, 1);
                }
            }
        }
    },

    update: function() {
        var self = this;
        var results = [];

        // Update this sprite animation.
        results.push(self.parent());

        // Update composited sprite animations.
        if (self.composition) {
            self.composition.forEach(function forEach(name) {
                if (name !== self.name) {
                    results.push(self.children[name].update());
                }
            });
        }

        // Return true if any of the sprites want to be rendered.
        return results.some(function some(result) {
            return result;
        });
    },

    draw: function(context) {
        if (!this.composition) {
            this.parent(context);
            return;
        }

        // Render all composed sprites in the proper order.
        var self = this;
        self.composition.forEach(function forEach(name) {
            if (name === self.name) {
                self.parent(context);
            }
            else {
                self.children[name].draw(context);
            }
        });
    }
});