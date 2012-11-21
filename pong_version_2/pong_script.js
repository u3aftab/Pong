
var can=document.getElementById("pongframe");
var pong=can.getContext("2d");

var max_score=10; //score required to win the game

var stats={
	comp_score: 0,
	player_score: 0,
};
var ball={
	thickness:10,
	angle:Math.PI*9/8,
	x:290,
	y:100,
	speed:2,  //nominal 2.5 for the game -->determines difficulty, higher speed = more difficult
}	
var racket={
	width: 15,
	height:50,
};
var player={
	x: 560,
	y: 158,
	speed: 1.8, //speed of player paddle
};
var computer={
	x: 25,
	y: 180,
	speed:1.2,  //nominal 1.2 for the game (keep below 2) -->determines difficulty, higher = more difficulty
};
var clock={};

var bottom=can.height-racket.height;	
var keyboard = { };

function reset_vars() {
	stats.comp_score=0;
	stats.player_score=0;
	ball.speed=2;
	computer.speed=1.2;
}

function updatePlayer() {
	if(stats.player_score<max_score && stats.comp_score<max_score) {
		if(keyboard[38]) {
			player.y-=player.speed;
			if(player.y<=0) player.y=0;
		}
		if(keyboard[40]) {
			player.y+=player.speed;
			if(player.y>=bottom) player.y=bottom;
		}
	}
};	

function drawSide(pong, side) {
	pong.fillStyle=("white");
	pong.fillRect(side.x, side.y, racket.width, racket.height);
};	

function drawBackground(pong) { // from [1]
	pong.fillStyle="#000000";
	pong.fillRect(0,0,can.width,can.height);
};

function addLine(pong) {
	for (i=0;i<18;i++) {
		pong.fillStyle=("white");
		pong.fillRect(299,i*23,3,11);
	}
}

function drawBall(pong) {
	pong.fillStyle=("white");
	pong.fillRect(ball.x, ball.y, ball.thickness,ball.thickness);
}

function updateBall() {		
	if (ball.x>=-ball.thickness && ball.x<=can.width) {
		if (Math.cos(ball.angle)<0) {
			ball.x-=ball.speed;
			
		}
		else if (Math.cos(ball.angle)>0) {
			ball.x+=ball.speed;
		}
	}
	if (ball.y>=2 && ball.y<=can.height-ball.thickness-1) {
		ball.y=ball.y-Math.sin(ball.angle)*ball.speed;
	}
	if (ball.y<8) {
		if (Math.cos(ball.angle)<0) {
			ball.angle=Math.PI+(Math.PI-ball.angle)
		}
		else if (Math.cos(ball.angle)>0) {
			ball.angle=-ball.angle;
		}			
	}
	if (ball.y>can.height-ball.thickness-8) {
		if (Math.cos(ball.angle)<0) {
			ball.angle=Math.PI-(ball.angle-Math.PI)
		}
		else if (Math.cos(ball.angle)>0) {
			ball.angle=-ball.angle;
		}		
	}
}

function checkHit() {
	if (ball.x+ball.thickness==player.x && (ball.y+ball.thickness>=player.y && ball.y<=player.y+racket.height+2)) {
		var deflection_ratio=(((player.y+racket.height/2)-(ball.y+ball.thickness/2))/(racket.height/2))
		if (Math.sin(ball.angle)>0) {
			ball.angle=Math.PI-deflection_ratio*1/3*Math.PI
		}
		else if (Math.sin(ball.angle)<0) {
			ball.angle=Math.PI+deflection_ratio*1/3*Math.PI
		}
	}
	if (ball.x==computer.x+racket.width && (ball.y+ball.thickness>=computer.y && ball.y<=computer.y+racket.height+2)) {
		var deflection_ratio=(((computer.y+racket.height/2)-(ball.y+ball.thickness/2))/(racket.height/2))
		if (Math.sin(ball.angle)>0) {
			ball.angle=deflection_ratio*1/3*Math.PI
		}
		else if (Math.sin(ball.angle)<0) {
			ball.angle=-deflection_ratio*1/3*Math.PI
		}
	}	
}

function updateComputer() {
	if (computer.y<ball.y) {
		computer.y+=computer.speed
	}
	else {
		computer.y-=computer.speed
	}
}

function updateGame() {
	if (ball.x<=2) {
		stats.player_score++;
		ball.angle=Math.PI*15/8+Math.random()/(1/100*Math.PI);
		ball.x=290;
		ball.y=100;
	}
	else if (ball.x>=can.width-2) {
		stats.comp_score++;
		ball.angle=Math.PI*9/8+Math.random()/(1/100*Math.PI);
		ball.x=290;
		ball.y=100;
	}
}

function updateScore(pong) {
	pong.fillStyle="white";
	pong.font="35pt 'Press Start 2P', cursive";
	pong.fillText(stats.comp_score, 205, 50)
	pong.fillText(stats.player_score,355,50)
}

function checkGame(pong) {
	if (stats.comp_score>=max_score) {
		ball.speed=0;
		computer.speed=0;
		pong.fillStyle="white";
		pong.font="40pt 'Press Start 2P', cursive";
		pong.fillText("Game Over", 80, 250);
	}
	if (stats.player_score>=max_score) {
		ball.speed=0
		computer.speed=0;
		pong.fillStyle="white";
		pong.font="38pt 'Press Start 2P', cursive";
		pong.fillText("You Win!", 120, 250);
	}
}
	
function mainLoop() {
	var pong=can.getContext("2d");
	updateGame();
	updateComputer();
	updateBall();
	checkHit();
	updatePlayer();
	drawBackground(pong);
	addLine(pong);
	drawSide(pong,computer);
	drawSide(pong,player);
	drawBall(pong);
	updateScore(pong);
	checkGame(pong);
	
};
			
function doSetup() { //from Josh Marinacci's "Canvas Deep Dive" <http://joshondesign.com/p/books/canvasdeepdive/toc.html>
	attachEvent(document, "keydown", function(e) {
		keyboard[e.keyCode] = true;
	});
	attachEvent(document, "keyup", function(e) {
		keyboard[e.keyCode] = false;
	});
};

function attachEvent(node,name,func) { //from Josh Marinacci's "Canvas Deep Dive"
	if(node.addEventListener) {
		node.addEventListener(name,func,false);
	} else if(node.attachEvent) {
		node.attachEvent(name,func);
	}
};			

doSetup();

function startgame() {
	clearInterval(clock);
	reset_vars();
	clock=setInterval(mainLoop,5);
}

drawBackground(pong);
pong.fillStyle="white";
pong.font="bold 15pt Courier";
pong.fillText("Click below to start game.", 60, 320); 


