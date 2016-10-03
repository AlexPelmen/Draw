var brushSet = {
	width: 1,
	height: 1,
	widthRange: 0,
	heightRange: 0,
	step: 1,
	stepRange: 0,
	settingsHTML: 	'<div id = "sidebar_brush" class = "Sidebar_div" >' +
						'<p>Ширина кисти</p>' +
						'<input type = "range" name = "brush_width" class = "Range" id = "brush_width" value = "0" onchange = "tool.choose_brush()"/>' +
						'<p>Высота кисти</p>' +
						'<input type = "range" name = "brush_height" class = "Range" id = "brush_height" value = "0" onchange = "tool.choose_brush()"/>' +
						'<p>Шаг кисти</p>' +
						'<input type = "range" name = "brush_step" class = "Range" id = "brush_step" value = "0" onchange = "tool.choose_brush()"/>' +						
					'</div>'
}

function brush(){
	document.getElementById('settings').innerHTML = brushSet.settingsHTML;
	document.getElementById('brush_width').value = brushSet.widthRange;
	document.getElementById('brush_height').value = brushSet.heightRange;
	document.getElementById('brush_step').value = brushSet.stepRange;
	
	this.buf = context.getImageData(0,0, brushSet.width, brushSet.height);	
	this.lastClick = {
		x: null,
		y: null
	}
	this.down = function(event){
		this.point(getX(event), getY(event));
		this.lastClick.x = getX(event);
		this.lastClick.y = getY(event);	
	}
	this.up = function(event){}
	this.move = function(event){
		this.line(this.lastClick.x, this.lastClick.y, getX(event), getY(event));	
	}
	
	//function to draw line
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
	
	//function to choose width and height of brush
	this.choose_brush = function(){
		brushSet.widthRange = document.getElementById('brush_width').value;
		brushSet.heightRange = document.getElementById('brush_height').value;
		brushSet.stepRange = document.getElementById('brush_step').value;
		
		brushSet.width = brushSet.widthRange * brushSet.widthRange / 100 + 1;
		brushSet.height = brushSet.heightRange * brushSet.heightRange / 100 + 1;		
		this.count_step();
	
		//it's for point function (just like base imgdata)
		this.buf = context.getImageData(0,0, brushSet.width, brushSet.height);
	}	
		
	//function to draw a filled point (it does not support opacity)
	this.point = function(x, y){			
		for(var i = 0; i < (brushSet.width + 1) * (brushSet.height + 1) * 4; i += 4){
			this.buf.data[i] = color.main.R; //red chanel
			this.buf.data[i + 1] = color.main.G; //green chanel
			this.buf.data[i + 2] = color.main.B //blue chanel
		}						
		context.putImageData(this.buf, x, y);
	}	
	
	//function to find step between ...
	this.count_step = function(){
		if(brushSet.width * brushSet.stepRange > 5) 
			var s1 = Math.round(brushSet.width * brushSet.stepRange * 0.3); 
		else {
			brushSet.step = 1;
			return 0;
		}
		
		if(brushSet.height * brushSet.stepRange > 5) 
			var s2 = Math.round(brushSet.height * brushSet.stepRange * 0.3); 
		else { 
			brushSet.step = 1;
			return 0;
		}
		
		if(s1 > s2)
			brushSet.step = s2;
		else
			brushSet.step = s1;
	}
}
