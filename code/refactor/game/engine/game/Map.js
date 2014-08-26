function Map(level){

	var self = this;

	// MY PARSING CONSTANTS
	self.WALL = "#";
	self.SCREEN = "=";
	self.SPACE = " ";
	self.CARPET = ".";

	// MY FILL CONSTANTS
	self.FILL_CARPET = "carpet";
	self.FILL_WALL = "#000000";
	self.FILL_SCREEN = "#202328";
	self.FILL_SPACE = "#999999";

	///////////////////////////////////

	self.level = level;
	self.tiles = level.config.map;

	/////////////////////////////

	self.init = function(){

		// Dimensions
		self.width = self.tiles[0].length;
		self.height = self.tiles.length;

		// Background Canvas
		self.bgCanvas = document.createElement("canvas");
		self.bgCanvas.width = self.width * W;
		self.bgCanvas.height = self.height * H;
		self.bgContext = self.bgCanvas.getContext('2d');

		// CREATE TEXTURES
		var _createTextureIfNeeded = function(fill){
			if(fill[0]=="#") return fill; // color
			return self.bgContext.createPattern(Asset.image[fill], 'repeat'); // texture
		};
		self.FILL_CARPET = _createTextureIfNeeded(self.FILL_CARPET);
		self.FILL_WALL = _createTextureIfNeeded(self.FILL_WALL);
		self.FILL_SCREEN = _createTextureIfNeeded(self.FILL_SCREEN);
		self.FILL_SPACE = _createTextureIfNeeded(self.FILL_SPACE);

		// DRAW STATIC BACKGROUND
		var ctx = self.bgContext;
		for(var y=0;y<self.tiles.length;y++){
			for(var x=0;x<self.tiles[y].length;x++){
				var fill;
				switch(self.tiles[y][x]){
					case self.SPACE: fill=self.FILL_SPACE; break;
					case self.CARPET: fill=self.FILL_CARPET; break;
					case self.WALL: fill=self.FILL_WALL; break;
					case self.SCREEN: fill=self.FILL_SCREEN; break;
				}
				ctx.fillStyle = fill;
				ctx.fillRect(x*W, y*H, W, H);
			}
		}

	};

	// DRAW EVERY FRAME
	self.draw = function(ctx){
		ctx.drawImage(self.bgCanvas,0,0);
	}

	///////////////////////

	self.hitTest = function(x,y){

		// Out of bounds
		if(x<0 || x>=self.width || y<0 || y>=self.height) return true;
		
		// If not, return if it's hitting a Wall or Screen
		var tile = self.tiles[Math.floor(y)][Math.floor(x)];
	    return( tile==self.WALL || tile==self.SCREEN );

	}

}