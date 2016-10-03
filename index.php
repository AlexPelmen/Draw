<!-- git repository: /media/alex/D484E8F3AF07E028/Wamp64/www/Draw -->

<HTML>
	<HEAD>
		<meta  http-equiv = "Content-Type" name = "bot" content="text/html charset = UTF-8" />
		<link rel="stylesheet" type="text/css" href="styles/test.css">
		<title>Графическая составляющая сайта</title>
	</HEAD>
	<BODY  onselectstart =" return false">
		<!--We include kit for others tools -->
		<script src = "vars.js"></script>
		<script src = "kit.js"></script>
		<script src = "tools.js"></script>
		<script src = "color.js"></script>
		
		<!--Here we try to include all js-tools in folder "tools"-->
		<script src = "tools/brush.js"></script>
		<script src = "tools/pencil.js"></script>
		<script src = "tools/line.js"></script>
		<script src = "tools/zoom.js"></script>
				
		<!--Here we try to include all pictures in folder "images"-->
		<div id = "tools">			
			<script>
				for(var i = 0; i < filenames.length; i++){
					document.write('<img src = "images/' + filenames[i] + '.png" alt = "Херня какая-то" id = "' + filenames[i] + '" class = "ToolIcon" onclick = "choose_tool(\'' + filenames[i] + '\')" />');
				}
			</script>			
		</div>
		
		<div id = "palette">
			<p>Выберите цвет</p>
			<div>
				<canvas width = "360" height = "1" id = "rainbow"></canvas>
				<canvas width = "300" height = "300" id = "SB-palette"></canvas>
			</div>
			<div id = "closeBtn" class = "SettingsBtn" onclick = "">Отменить</div>
			<div id = "closeBtn" class = "SettingsBtn" onclick = "color.hidePalette()" >Cкрыть</div>
		</div>
		
		<div id = "sidebar">
			<div id = "backups" class = "Sidebar_div" >
				<div id = "redo" class = "BackupImgs" onclick = "checkoutNextBackup()" >
					REDO
				</div>
				<div id = "undo" class = "BackupImgs" onclick = "checkoutPreBackup()">
					UNDO
				</div>				
			</div>
			<div id = "sidebar_color" class = "Sidebar_div" >
				<p>Выбрать цвет:</p>
				<div id = "secondColor" class = "ColorDIV" onclick = "color.secondClick()" ></div>
				<div id = "mainColor" class = "ColorDIV" onclick = "color.mainClick()" ></div>	
			</div>
			<div id = "settings">
			</div>	
		</div>
		
		<script>
			var rainbow = document.getElementById('rainbow');
			var SB_palette = document.getElementById('SB-palette');
			var rainbowCxt = rainbow.getContext('2d');
			var SB_context = SB_palette.getContext('2d');
			
			color = new palette();
			//Create the first palette
			color.createPalette();			
			//We create the SB - palette with procedure
			color.change_SB();
			
									
		</script>
	</body>
</html>
			
		</script>
		
		<!--Mouse collibration and creating canvas -->
		<script>						
			document.write('<canvas id = "paper" class = "Canvas" width = "' + paper.width + '" height = "' + paper.height +'" ></canvas>');
			
			document.getElementById('paper').style.width = paper.width;
			document.getElementById('paper').style.height = paper.height;
			
			//The main canvas
			var canvas = document.getElementById('paper');		
			//The context of main canvas
			var context = canvas.getContext('2d');	
			//Let's make the canvas white
			PictureBuf = context.getImageData(0,0,paper.width,paper.height);
			for(var i = 0; i < PictureBuf.data.length; i += 4){
				PictureBuf.data[i] = 255; //Red chanal
				PictureBuf.data[i + 1] = 255; //Green chanal
				PictureBuf.data[i + 2] = 255; //Blue chanal				
				PictureBuf.data[i + 3] = 255; //alpha chanal				
			}
			context.putImageData(PictureBuf,0,0);				
			
			//we collibrate mouse
			var mouse_offset = {
				width: document.getElementById('tools').offsetWidth,
				height: 0
			}
			
			//The tool
			var tool = new brush();
			
			
			
			//LISTENERS							
			
			//Mouse down listener (just canvas)
			canvas.onmousedown = function(){
				pressed = true;
				tool.down(event);
			}		
			
			//Mouse up listener (just canvas)
			canvas.onmouseup = function(){
				if(!tool.unrecordable) recordBackup();
			}
			
			//Mouse move listener		
			addEventListener("mousemove",function(event){
				if(pressed)	tool.move(event);
				if(color.SB_palette.pressed){
					var x = event.pageX - color.SB_palette.mouseOffsetX;
					var y = event.pageY - color.SB_palette.mouseOffsetY;
					x *= color.SB_palette.mouseScale;
					y *= color.SB_palette.mouseScale;
					if(x < 0) x = 0;
					if(x > color.SB_palette.size - 1) x = color.SB_palette.size - 1;
					if(y < 0) y = 0;
					if(y > color.SB_palette.size - 1) y = color.SB_palette.size - 1;
					color.choose_SB(x,y);					
				}
				if(color.rainbow.pressed){
					var x = event.pageX - color.rainbow.mouseOffsetX;				
					x *= color.rainbow.mouseScale;
					if(x < 0) x = 0;
					if(x > 359) x = 359;
					color.choose_H(x);
				}
			});
			
			//Mouse up listener		
			addEventListener("mouseup",function(){
				tool.up();				
				pressed = false;
				color.SB_palette.pressed = false;
				color.rainbow.pressed = false;
			});				
				
			//Key down listener
			addEventListener("keydown", function(event){
				if(event.keyCode === 17) ctrl = true;
				if(ctrl && event.keyCode === 90) checkoutPreBackup();
				if(ctrl && event.keyCode === 89) checkoutNextBackup();
				if(ctrl && event.keyCode === 18) MyTestFunction();
			});
			//Key up listener
			addEventListener("keyup", function(event){
				if(event.keyCode === "17") ctrl = false;
			});	
			
			//SB-palette listener
			SB_palette.onmousedown = function(event){
				color.SB_palette.pressed = true;
				var x = event.pageX - color.SB_palette.mouseOffsetX;
				var y = event.pageY - color.SB_palette.mouseOffsetY;				
				x *= color.SB_palette.mouseScale;
				y *= color.SB_palette.mouseScale;			
				color.choose_SB(x,y);
			}
			
			//SB-palette listener
			rainbow.onmousedown = function(event){
				color.rainbow.pressed = true;
				var x = event.pageX - color.rainbow.mouseOffsetX;				
				x *= color.rainbow.mouseScale;		
				color.choose_H(x);
			}
			//The initialisation part of code (constructor)		
			recordBackup();
		</script>
		
	</BODY>
</HTML> 
