//function to choose a tool
function choose_tool(newTool){
	document.getElementById(choosenTool).style.opacity = null;
	document.getElementById(newTool).style.opacity = 1;
	
	choosenTool = newTool;
	
	if(newTool === 'brush') tool = new brush();
	if(newTool === 'pencil') tool = new pencil();
	if(newTool === 'line') tool = new line();
	if(newTool === 'zoom') tool = new zoom();
	
	mouse_offset.width = document.getElementById('tools').offsetWidth;
}

//function to get valid coords for tools
function getX(event){
	return Math.round((event.pageX - mouse_offset.width) / zoomSet.zoom);
}
function getY(event){
	return Math.round((event.pageY - mouse_offset.height) / zoomSet.zoom);
}


//Checkout of old backup
function checkoutPreBackup(){
	if(Backups.cur !== Backups.maxlen) if(Backups.stack[ Backups.cur + 1]) Backups.cur++;
	context.putImageData( Backups.stack[ Backups.cur ], 0, 0 );
}

function checkoutNextBackup(){
	if(Backups.cur !== 0) Backups.cur--;
	context.putImageData( Backups.stack[ Backups.cur ], 0, 0 );	
}


//Save current backup
function recordBackup(){
	PictureBuf = context.getImageData( 0 ,0 ,paper.width ,paper.height );
	//We add one element with index "0" and the length of array become more
	if(!Backups.cur){
		Backups.stack.unshift(PictureBuf);
		Backups.stack.length = Backups.maxlen;
	}
	else{
		var i = Backups.cur;
		var k = 1;
		while(i < Backups.maxlen){
			Backups.stack[k++] = Backups.stack[i++];
		}
		Backups.stack[0] = PictureBuf;
	}	
	Backups.cur = 0;
}


/*//function to draw a point (it supports opacity)
function point(x,y){
	Toolsbuf = context.getImageData(x, y, tool.width, tool.height );				
	
	for(var i = 0; i < buf.data.length; i += 4){
		buf.data[i] = tool.color.R; //red chanel
		buf.data[i + 1] = tool.color.G; //green chanel
		buf.data[i + 2] = tool.color.B //blue chanel
	}
					
	context.putImageData(buf,x,y);			
}*/			


function MyTestFunction(){
	//alert('none in test function!');
	alert(color.main.R + ' ' + color.main.G + ' ' + color.main.B);
}
