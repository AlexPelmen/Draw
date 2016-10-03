var lineSet = {
	width: 1,
	widthRange: 0,
	settingsHTML: 	'<div id = "sidebar_line" class = "Sidebar_div" >' +
						'<p>Толщина линии: </p>' +
						'<input type = "range" name = "line_width" class = "Range" id = "line_width" value = "0" onchange = "tool.choose_line()"/>' +											
					'</div>'
}

function line() {
	document.getElementById('settings').innerHTML = lineSet.settingsHTML;
	document.getElementById('line_width').value = lineSet.widthRange;
	
	context.lineWidth = lineSet.width;
	
	
	this.firstLinePoint = {
		x: null,
		y: null
	}
	
	this.rightUpperLinePoint = {
		x: null,
		y: null
	}
	
	this.lastClick = {
		x: null,
		y: null
	}
	

	this.down = function(event){
		this.lastClick.x = getX(event);
		this.lastClick.y = getY(event);
		this.firstLinePoint.x = this.lastClick.x;
		this.firstLinePoint.y = this.lastClick.y;
	}
	this.up = function(){}
	this.move = function(event){
		if(this.lastClick.x !== this.firstLinePoint.x || this.lastClick.y !== this.firstLinePoint.y){
			context.putImageData(this.buf, this.rightUpperLinePoint.x - 3, this.rightUpperLinePoint.y - 3);
		}
		this.lastClick.x = getX(event);
		this.lastClick.y = getY(event);
		if(this.lastClick !== this.firstLinePoint){
			var width = Math.abs(this.lastClick.x - this.firstLinePoint.x) + lineSet.width;
			var height = Math.abs(this.lastClick.y - this.firstLinePoint.y) + lineSet.width;
			if(this.lastClick.x > this.firstLinePoint.x)
				var x = this.firstLinePoint.x;
			else
				var x = this.lastClick.x;
				
			if(this.lastClick.y > this.firstLinePoint.y)
				var y = this.firstLinePoint.y;
			else
				var y = this.lastClick.y;
			
			x -= lineSet.width / 2;
			y -= lineSet.width / 2;
			
			if(x < 0) x = 0;
			if(y < 0) y = 0;
			
			this.rightUpperLinePoint.x = x;
			this.rightUpperLinePoint.y = y;
				
			this.buf = context.getImageData(x - 3, y - 3, width + 6, height + 6);
			context.beginPath()
			context.moveTo(this.firstLinePoint.x,this.firstLinePoint.y);
			context.lineTo(this.lastClick.x,this.lastClick.y);
			context.stroke();
		}		
	}
	
	this.choose_line = function(){
		lineSet.widthRange = document.getElementById('line_width').value;		
		lineSet.width = lineSet.widthRange * lineSet.widthRange / 100 + 1;
		context.lineWidth = lineSet.width;	
	}
}
