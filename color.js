

function palette(){
	this.main = {
		R: 0,
		G: 0,
		B: 0
	}
	this.second = {
		R: 255,
		G: 255,
		B: 255
	}
	this.clearColor = {
		R: 255,
		G: 0,
		B: 0
	}
	this.color_is_main = true;
	this.rainbow = {
		pointer_width: 5,
		pointer_buf: null,
		pointer_range: 0,
		pressed: false,
		buf: null,
		
		mouseOffsetX: document.getElementById('rainbow').offsetLeft + document.getElementById('palette').offsetLeft,
		mouseScale: null,
	}
	this.SB_palette = {
		size: 300,
		pointer_size: 4,
		pointer_buf: null,
		pointer_x: 0,
		pointer_y: 0,
		buf: null,
		pressed: false,
		
		mouseOffsetX: document.getElementById('SB-palette').offsetLeft + document.getElementById('palette').offsetLeft,
		mouseOffsetY: document.getElementById('SB-palette').offsetTop + document.getElementById('palette').offsetTop,
		mouseScale: null,
	}
	//initialization of upper objects (SB_palette and rainbow)
	this.rainbow.pointer_buf = rainbowCxt.getImageData(0, 0, this.rainbow.pointer_width, 1);
	this.rainbow.mouseScale = 360 / document.getElementById('rainbow').offsetWidth;
	
	this.SB_palette.buf = SB_context.getImageData(0, 0, this.SB_palette.size, this.SB_palette.size );
	this.SB_palette.pointer_buf = SB_context.getImageData(0, 0, this.SB_palette.pointer_size, this.SB_palette.pointer_size );
	this.SB_palette.mouseScale = this.SB_palette.size / document.getElementById('SB-palette').offsetWidth; 
	//end of init

	
	this.createPalette = function(){
		var buf = rainbowCxt.getImageData(0,0,360,1);
		var divR = 0;
		var divG = 0;
		var divB = 0;
		var curColor = {
			R: 255,
			G: 0,
			B: 0,
		}
		//the first pixel is red
		buf.data[0] = 255;
		buf.data[1] = 0;
		buf.data[2] = 0;
		buf.data[3] = 255;
		//others...
		for(var H = 1; H < 360; H++){
			var part = Math.ceil(H / 60);
			switch(part){
				case 1:
					divR = 0;
					divG = 255 / 60;
					divB = 0;
					break;
				case 2:
					divR = -255 / 60;;
					divG = 0;
					divB = 0;
					break;
				case 3:
					divR = 0;
					divG = 0;
					divB = 255 / 60;
					break;
				case 4:
					divR = 0;
					divG = -255 / 60;
					divB = 0;
					break;
				case 5:
					divR = 255 / 60;
					divG = 0;
					divB = 0;
					break;
				case 6:
					divR = 0;
					divG = 0;
					divB = -255 / 60;
					break;
			}
			curColor.R += divR;
			curColor.G += divG;
			curColor.B += divB;
			
			buf.data[H * 4    ] = curColor.R;
			buf.data[H * 4 + 1] = curColor.G;
			buf.data[H * 4 + 2] = curColor.B;
			buf.data[H * 4 + 3] = 255;				
		}
		rainbowCxt.putImageData(buf,0,0);
		this.rainbow.buf = buf;
	}
	
	this.choose_H = function(x){
		x = Math.round(x);
		
		var ITC = this.rainbow;
		var s = ITC.pointer_width + rainbowCxt.lineWidth;
		rainbowCxt.putImageData(ITC.pointer_buf, ITC.pointer_range - s, 0);		
		ITC.pointer_buf = rainbowCxt.getImageData(x - s, 0, s*2, 1);
		rainbowCxt.strokeRect(x - ITC.pointer_width, 0, ITC.pointer_width * 2, 1);
		
		ITC.pointer_range = x;
		
		this.clearColor.R = ITC.buf.data[ x * 4     ];
		this.clearColor.G = ITC.buf.data[ x * 4 + 1 ];
		this.clearColor.B = ITC.buf.data[ x * 4 + 2 ];
		this.change_SB();	
	}
	rainbowCxt.lineWidth = 2;
	
	this.change_SB = function(){			
		var currentColor = {
			R: null,
			G: null,
			B: null				
		}					
		var saturationColor = {
			R: null,
			G: null,
			B: null
		}		
		
		currentColor.R    = this.clearColor.R;
		currentColor.G    = this.clearColor.G;
		currentColor.B    = this.clearColor.B;
		
		saturationColor.R = this.clearColor.R;
		saturationColor.G = this.clearColor.G;
		saturationColor.B = this.clearColor.B;
			
		var i     = 0;	
		var RdevB = 0;
		var GdevB = 0;
		var BdevB = 0;
		var RdevS = 0;
		var GdevS = 0;
		var BdevS = 0;
		
		if(currentColor.R === 0) RdevB = 0; else RdevB = currentColor.R / this.SB_palette.size; 
		if(currentColor.G === 0) GdevB = 0; else GdevB = currentColor.G / this.SB_palette.size; 
		if(currentColor.B === 0) BdevB = 0; else BdevB = currentColor.B / this.SB_palette.size;
		
		for(var B = 0; B < this.SB_palette.size; B++){
			currentColor.R = saturationColor.R;
			currentColor.G = saturationColor.G;
			currentColor.B = saturationColor.B;
			if(currentColor.R === 255) RdevS = 0; else RdevS = (255 - currentColor.R) / this.SB_palette.size;
			if(currentColor.G === 255) GdevS = 0; else GdevS = (255 - currentColor.G) / this.SB_palette.size;
			if(currentColor.B === 255) BdevS = 0; else BdevS = (255 - currentColor.B) / this.SB_palette.size;
			
			for(var S = 0; S < this.SB_palette.size; S++){
				this.SB_palette.buf.data[i++] = currentColor.R;
				this.SB_palette.buf.data[i++] = currentColor.G;
				this.SB_palette.buf.data[i++] = currentColor.B;
				this.SB_palette.buf.data[i++] = 255;				
				currentColor.R += RdevS;
				currentColor.G += GdevS;
				currentColor.B += BdevS;
			}
			saturationColor.R -= RdevB;
			saturationColor.G -= GdevB;
			saturationColor.B -= BdevB;
		}
		SB_context.putImageData(this.SB_palette.buf,0,0);
		var s = this.SB_palette.pointer_size + SB_context.lineWidth;
		var x = this.SB_palette.pointer_x;
		var y = this.SB_palette.pointer_y;
		
		this.SB_palette.pointer_buf = SB_context.getImageData(x - s, y - s, s*2, s*2);
		this.choose_SB(x,y);
	}
	this.mainClick = function(){
		color.color_is_main = true; 
		color.showPalette();
		document.getElementById('mainColor').style.border = "5px solid #ddd";
		document.getElementById('secondColor').style.border = null;
	}
	this.secondClick = function(){
		color.color_is_main = false; 
		color.showPalette();
		document.getElementById('secondColor').style.border = "5px solid #ddd";
		document.getElementById('mainColor').style.border = null;
	}
	this.showPalette = function(){
		document.getElementById('palette').style.visibility = 'visible';
	}
	this.hidePalette = function(){
		document.getElementById('palette').style.visibility = "hidden";
		document.getElementById('mainColor').style.border = null;
		document.getElementById('secondColor').style.border = null;
	}
	this.choose_SB = function(x,y){
		var ITC = this.SB_palette;
		x = Math.round(x);
		y = Math.round(y);		
		
		var s = ITC.pointer_size + SB_context.lineWidth;
		SB_context.putImageData(ITC.pointer_buf, ITC.pointer_x - s, ITC.pointer_y - s);
		ITC.pointer_buf = SB_context.getImageData(x - s, y - s, s*2, s*2);	
		ITC.pointer_x = x;
		ITC.pointer_y = y;	
		
		if(x < ITC.size / 2 && y > ITC.size / 2) 
			SB_context.strokeStyle = "#fff";
		else
			SB_context.strokeStyle = "#000";
		SB_context.strokeRect(x - ITC.pointer_size, y - ITC.pointer_size, ITC.pointer_size * 2, ITC.pointer_size * 2);

		if(this.color_is_main){
			this.main.R = ITC.buf.data[ ( y * ITC.size + x) * 4      ];
			this.main.G = ITC.buf.data[ ( y * ITC.size + x) * 4  + 1 ];
			this.main.B = ITC.buf.data[ ( y * ITC.size + x) * 4  + 2 ];
			document.getElementById('mainColor').style.background = "RGB(" + this.main.R + ',' + this.main.G + ',' +  this.main.B + ")";
		}
		else{
			this.second.R = ITC.buf.data[ ( y * ITC.size + x) * 4      ];
			this.second.G = ITC.buf.data[ ( y * ITC.size + x) * 4  + 1 ];
			this.second.B = ITC.buf.data[ ( y * ITC.size + x) * 4  + 2 ];
			document.getElementById('secondColor').style.background = "RGB(" + this.second.R + ',' + this.second.G + ',' +  this.second.B + ")";
		}
	}
	SB_context.lineWidth = 2;
}