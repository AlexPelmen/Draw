var zoomSet = {
	width: paper.width,
	height: paper.height,
	x: 1.1,
	zoom: 1,
	sans: 20,
	settingsHTML: '<div id = "zoom_settings">' +
						'<div id = "btnZoomP" class = "SettingsBtn" onclick = "tool.chooseP()">Увеличить</div>' +
						'<div id = "btnZoomM" class = "SettingsBtn" onclick = "tool.chooseM()">Уменьшить</div>' +
						'<div id = "btnZoom100" class = "SettingsBtn" onclick = "tool.return100()">Реальный размер</div>' +
					'</div>'
					
}

function zoom(){
	document.getElementById('settings').innerHTML = zoomSet.settingsHTML;
	if(zoomSet.x > 1) 
		document.getElementById('btnZoomP').style.background = "#aaa";
	else
		document.getElementById('btnZoomM').style.background = "#aaa";
	
	this.unrecordable = true;
	this.up = function(){
		if(pressed && !this.moved) this.zoom();		
	} 
	this.zoom = function(){
		var z = zoomSet.zoom * zoomSet.x; 
		if( z < 11 && z > 0.05 ){
			zoomSet.width *= zoomSet.x;
			zoomSet.height *= zoomSet.x;
			zoomSet.zoom *= zoomSet.x;
		
			document.getElementById('paper').style.width = zoomSet.width;
			document.getElementById('paper').style.height = zoomSet.height;
		}		
	}
	this.clickPoint = {
		x: null,
		y: null,
	}
	this.moved = false;
	this.down = function(){
		this.clickPoint.x = event.pageX;
		this.clickPoint.y = event.pageY;
		this.moved = false;
	}	
	this.move = function(event){
		this.moved = true;
		var x = event.pageX;
		var k = x - this.clickPoint.x;
		if( Math.abs(k) > zoomSet.sans ){
			var lastX = zoomSet.x;
			
			if(k > 0) 
				zoomSet.x = 1.1;
			else
				zoomSet.x = 0.9;
			
			this.zoom();
			zoomSet.x = lastX;
			this.clickPoint.x = x;
			this.clickPoint.y = event.pageY;
		}			
	}
	this.return100 = function(){
		zoomSet.width = paper.width;
		zoomSet.height = paper.height;
		zoomSet.zoom = 1;
		document.getElementById('paper').style.width = zoomSet.width;
		document.getElementById('paper').style.height = zoomSet.height;		
	}
	
	this.chooseP = function(){
		zoomSet.x = 1.1;
		document.getElementById('btnZoomP').style.background = "#aaa";
		document.getElementById('btnZoomM').style.background = null;
	}
	this.chooseM = function(){
		zoomSet.x = 0.9;
		document.getElementById('btnZoomM').style.background = "#aaa";
		document.getElementById('btnZoomP').style.background = null;
	}
}