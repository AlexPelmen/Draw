var pencilSet = {
	width: 1,
	height: 1,
	widthRange: 0,
	heightRange: 0,
	step: 1,
	stepRange: 0,
	settingsHTML: '<div id = "sidebar_pencil" class = "Sidebar_div" >' +
						'<p>Толщина грифеля </p>' +
						'<input type = "range" name = "pencil_width" class = "Range" id = "pencil_width" value = "0" onchange = "tool.choose_pencil()"/>' +											
					'</div>'
}

function pencil(){
	document.getElementById('settings').innerHTML = pencilSet.settingsHTML;
	document.getElementById('pencil_width').value = pencilSet.widthRange;
	
	this.buf = context.getImageData(0,0, pencilSet.width, pencilSet.width);	
	this.lastClick = {
		x: null,
		y: null
	}
	this.down = function(event){
		this.point(getX(event), getY(event));
		this.lastClick.x = getX(event);
		this.lastClick.y = getY(event);	
	}
	this.up = function(){}
	
	this.move = function(event){
		this.line(this.lastClick.x, this.lastClick.y, getX(event), getY(event));	
	}

	this.line = function(x1,y1,x2,y2){
		//The theory: y(x) = kx + b;
		//We also draw our line with the same arguments	
		this.lastClick.x = x2;
		this.lastClick.y = y2; //remember where is the final point								
					
		var value; //just variable
		var b; //argument from example
		var k; //argument from example
				
		if(x2 !== x1) k = (y2 - y1)/(x2 - x1); else k = 9999;	//Count argument k						
		if(Math.abs(k) < 1){
			if(x1 > x2){ //exchange two vars
				value = x2;
				x2 = x1;
				x1 = value;
				value = y2;
				y2 = y1;
				y1 = value;
			}
			b = y1 - k * x1; //b argument
			for(;x1 < x2+1; x1 += brushSet.step) this.point(x1, Math.round(k*x1 + b)); //Draw all points
		}
		else{
			if(k) k = 1/k; else k = 99999;
			if(y1 > y2){						
				value = y2;
				y2 = y1;
				y1 = value;
				value = x2;
				x2 = x1;
				x1 = value;
			}
			b = x1 - k * y1;
			for(;y1 < y2+1; y1 += brushSet.step) this.point(Math.round(k*y1 + b), y1);
		}													
	}
	
	//function to choose width and height of pencil
	this.choose_pencil = function(){
		pencilSet.widthRange = document.getElementById('pencil_width').value;		
		pencilSet.width = pencilSet.widthRange * pencilSet.widthRange / 100 + 1;
		context.lineWidth = pencilSet.width; 	
		this.buf = context.getImageData(0,0, pencilSet.width, pencilSet.width);
	}	
		
	//function to draw a filled point (it does not support opacity)
	this.point = function(x, y){			
		for(var i = 0; i < (pencilSet.width + 1) * (pencilSet.width + 1) * 4; i += 4){
			this.buf.data[i] = color.main.R; //red chanel
			this.buf.data[i + 1] = color.main.R; //green chanel
			this.buf.data[i + 2] = color.main.R; //blue chanel
		}						
		context.putImageData(this.buf, x, y);
	}	
	
	
}
