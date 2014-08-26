function LevelRenderer(level){

	var self = this;
	self.level = level;

	/*********************

	1. DRAW THE VISIBLE LAYER
	- The map's static background
	- The wall screen
	- The floor realobjects
	- The solid realobjects
	- Mask in the same canvas

	2. DRAW THE CCTV LAYER
	? Just use grayscale
	- New canvas for the masks
	- Mask it

	3. DRAW THEM TOGETHER
	- Translate to camera position
	- Draw Poppy, because she's gotta appear on top of everything.
	- Draw both layers onto the main canvas

	*********************/

	self.init = function(){

		var canvasWidth = self.level.map.width * W;
		var canvasHeight = self.level.map.height * H;

		// SEEN Canvas
		self.seenCanvas = document.createElement("canvas");
		self.seenCanvas.width = canvasWidth;
		self.seenCanvas.height = canvasHeight;
		self.seenContext = self.seenCanvas.getContext('2d');

		// CCTV Canvas
		self.cctvCanvas = document.createElement("canvas");
		self.cctvCanvas.width = canvasWidth;
		self.cctvCanvas.height = canvasHeight;
		self.cctvContext = self.cctvCanvas.getContext('2d');

		// Camera Translations
		self.camera = {
			x: canvasWidth/2,
			y: canvasHeight/2,
			gotoX: canvasWidth/2,
			gotoY: canvasHeight/2
		};

	};

	self.draw = function(gameContext){

		var lvl = self.level;

		///////////////////////////////
		// 1. DRAW THE VISIBLE LAYER //
		///////////////////////////////

		var ctx = self.seenContext;
		ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

		// - The map's static background
		lvl.map.draw(ctx);

		// - The screen wallobjects
		lvl.walls.draw(ctx);
		
		// - The floor realobjects
		
		// - The solid realobjects, depth sorted
		var reals = lvl.realobjects.sort(function(a,b){
			return a.y-b.y;
		});
		for(var i=0;i<reals.length;i++){
			reals[i].draw(ctx);
		}

		// - Mask in the same canvas

		ctx.globalCompositeOperation = "destination-in";
		ctx.beginPath();
		var _sightPolygon = SightAndLight.compute(lvl.player, lvl.shadow.shadows);
		var p0 = _sightPolygon[0];
		ctx.moveTo(p0.x*W, p0.y*H);
		for(var i=1;i<_sightPolygon.length;i++){
			var p = _sightPolygon[i];
			ctx.lineTo(p.x*W, p.y*H);
		}
		ctx.fill();
		ctx.globalCompositeOperation = "source-over";

		////////////////////////////
		// 2. DRAW THE CCTV LAYER //
		////////////////////////////

		///////////////////////////
		// 3. DRAW THEM TOGETHER //
		///////////////////////////

		var ctx = gameContext;
		ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

		ctx.save();

		// - Translate to camera position
		var cam = self.camera;
		cam.x = cam.x*0.8 + cam.gotoX*0.2;
		cam.y = cam.y*0.8 + cam.gotoY*0.2;
		ctx.translate(Game.canvas.width/2, Game.canvas.height/2);
		ctx.translate(-cam.x*W, -cam.y*H);
		
		// - Draw Poppy, because she's gotta appear on top of everything.

		// - Draw both layers onto the main canvas
		ctx.drawImage(self.seenCanvas,0,0);

		ctx.restore();
		

	};

}