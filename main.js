var se;
var turn;
var panel;
var c_0,c_1;
var canv,cont;

var turnDisplay;
var doc=document;

var stone={black:2,white:2,};
var mouse={x:0,y:0,};
var index={x:0,y:0,};

window.onload=()=>{
	turnDisplay=doc.getElementById('turn');
	canv=doc.getElementById('game');

	c_0=doc.getElementById('c_0');
	c_1=doc.getElementById('c_1');
	cont=canv.getContext('2d');
	
	canv.width=640;
	canv.height=640;
	canv.style.backgroundColor='#009900';
	
	turn=2;
	init();
	
	se=new Audio();
	se.src='stone.mp3';
	
	drawScreen();

	canv.addEventListener('mousemove',e=>{
		let rect=e.target.getBoundingClientRect();
		mouse.x=e.clientX-rect.left;
		mouse.y=e.clientY-rect.top;
	});

	canv.addEventListener('mousedown',e=>{
		$x=~~(mouse.x/80);
		$y=~~(mouse.y/80);

		if(!panel[$y][$x]){
			inMyRad=
			get($x,$y,0,-1)+get($x,$y,1,-1)+get($x,$y,1,0)
			+get($x,$y,1,1)+get($x,$y,0,1)+get($x,$y,-1,1)+get($x,$y,-1,0)+get($x,$y,-1,-1);

			if(inMyRad&&changeCheck($x,$y,turn,false)){
				changeCheck($x,$y,turn,true);
				panel[$y][$x]=turn;
				drawScreen();
				se.play();
				
				drawDot($x*80+40,$y*80+40,7,'#BB0000');

				turn=turn%2+1;
				turnDisplay.innerText=['WHITE','BLACK'][turn-1];

				countStones();

				c_0.innerText=stone.black;
				c_1.innerText=stone.white;
			}		
		}
	});
}

// Draw function methods

function drawPanel(){
	// Grid lines
	for(i=0;i<9;i++){
		drawLine(0,i*(640/8),canv.width,i*(640/8));

	}
	for(i=0;i<9;i++){

		drawLine(i*(640/8),0,i*(640/8),canv.height);
	}

	// 4 Dot points	
	drawDot(160,160,7,'#1B1B1B');
	drawDot(480,160,7,'#1B1B1B');
	drawDot(160,480,7,'#1B1B1B');
	drawDot(480,480,7,'#1B1B1B');
}

function setStroke(color,bold){
	cont.beginPath();

	cont.lineWidth=bold;
	cont.strokeStyle=color;
}

function drawLine(x,y,x1,y1,bold,color){
	setStroke(color,bold);

	cont.moveTo(x,y);
	cont.lineTo(x1,y1);
	cont.closePath();

	cont.stroke(); // Just draw method
}

function drawDot(x,y,size,color){
	cont.beginPath();
	cont.fillStyle=color;
	cont.arc(x,y,size,0,Math.PI*2,false);
	cont.fill(); // Just draw method
}

function drawStone(){
	for(i=0;i<8;i++){
		for(j=0;j<8;j++){
			let stone=panel[i][j];
			if(stone){
				drawDot(j*80+40,i*80+40,24,['#FFF','#000'][stone-1]);
			}
		}
	}
}

function drawScreen(){
	cont.clearRect(0,0,canv.width,canv.height);
	drawPanel();
	drawStone();
}

// System function methods

function init(){
	panel=[
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,1,2,0,0,0],
		[0,0,0,2,1,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
	];
}

function get(x,y,dx,dy){
	if(panel[y+dy]==void(0)||panel[0][x+dx]==void(0))return 0;
	let stack=panel[y+dy][x+dx];
	return panel[y+dy][x+dx];
}

function changeCheck(x,y,i,mode){
	stack=0;
	stack+=goAndReturn(x,y,0,-1,i,mode);
	stack+=goAndReturn(x,y,1,-1,i,mode);
	stack+=goAndReturn(x,y,1,0,i,mode);
	stack+=goAndReturn(x,y,1,1,i,mode);
	stack+=goAndReturn(x,y,0,1,i,mode);
	stack+=goAndReturn(x,y,-1,1,i,mode);
	stack+=goAndReturn(x,y,-1,0,i,mode);
	stack+=goAndReturn(x,y,-1,-1,i,mode);

	return stack;
}

function goAndReturn(x,y,dx,dy,id,change){
	stack={x:x,y:y,};
	if(panel[y+dy]==void(0)||panel[0][x+dx]==void(0))return 0;
	if(panel[y+dy][x+dx]==id%2+1){
		for(;;){
			x+=dx;
			y+=dy;
			if(panel[y]==void(0)||panel[0][x]==void(0))return 0;
			if(panel[y][x]==id){if(change){break}else{return 1}}
			if(panel[y][x]<1)return 0;
		}
		for(;;){
			panel[y][x]=id;
			x-=dx;
			y-=dy;
			if(x==stack.x&&y==stack.y)return 0;
		}
	}else{
		return 0;
	}
}

function countStones(){
	stone.black=0;
	stone.white=0;
	for(i=0;i<8;i++){
		for(j=0;j<8;j++){
			stone.black+=panel[i][j]==2;
			stone.white+=panel[i][j]==1;
		}
	}
}
