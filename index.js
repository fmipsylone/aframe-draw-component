module.exports.component = {
	schema: {
		width: {
			default: 256
		},
		height: {
			default: 256
		},
		background: {
			default: "#FFFFFF"
		}
	},

	init: function () {
		this.registers = []; //order of eventing after render
		this.update();
	},

	register: function(render) {
		this.registers.push(render);
	},

	update: function (oldData) {
		if (!oldData) this.createCanvas(this.data.width, this.data.height);
	},

	createCanvas: function (w, h) {
		var _ = this;
		var canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		canvas.style = "display: none";
		_.canvas = canvas;
		_.ctx = canvas.getContext("2d");

		this.texture = new THREE.Texture(_.canvas); //renders straight from a canvas
		if(this.el.tagName == 'A-SPRITE'){
			this.hotspotMaterial = new THREE.SpriteMaterial({map: this.texture});
			var _created = false;
			
			if(this.sprite === undefined) {
				this.sprite = new THREE.Sprite(this.hotspotMaterial);
				_created = true;
			}
			
			var _sprite = this.el.components.sprite;

	        resizeData = _sprite.data.resize.split(' ');
	        this.sprite.scale.set( resizeData[0], resizeData[1], resizeData[2] );
			
			if(_created) this.el.setObject3D('mesh', this.sprite);
		} else {
			if(this.el.object3D.children.length > 0) { //backwards compatibility
				this.el.object3D.children[0].material = new THREE.MeshBasicMaterial();
				this.el.object3D.children[0].material.map = this.texture;
				this.el.object3D.children[0].material.transparent = true;	 
			}
			else { //backwards compatibility
				this.el.object3D.material = new THREE.MeshBasicMaterial();
				this.el.object3D.material.map = this.texture;
				this.el.object3D.material.transparent = true;
			}
		}
		if(!this.el.hasLoaded) this.el.addEventListener("loaded", function() {
			_.render();
		});
		else _.render();
	},

	render: function() {
		if(this.registers.length > 0) { //backwards compatibility
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillStyle = this.data.background;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.registers.forEach(function(item) {
				item();
			});
		}
		this.texture.needsUpdate = true;
	},

	//not the most removable component out there, so will leave blank for now
	remove: function () {}
};
