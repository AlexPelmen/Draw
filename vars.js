var paper = {
	width: 500,
	height: 500
}
var mouse_offset = {
	width: null,
	height: null
}
var PictureBuf = null;
//The stack of backups 
var Backups = {
	maxlen: 20,
	cur: null,
	stack: new Array(20)
}
//The identify of pressed mouse button on canvas
var pressed = false;
//The identify of pressed ctrl
var ctrl = false;					
//Choosen Tool
var choosenTool = 'brush';