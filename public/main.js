'use strict';

import { StateManager } from './StateManager.js';
import { CanvasControl } from './CanvasControl.js';
import { Pointer } from './Pointer.js';


let phoneOriOffset = {
	a: 0,
	b: 0,
	c: 0
}


let phoneVel = {
	x: 0,
	y: 0,
	z: 0
};

let socket;


let prev = 
{
	time : Date.now(),

	x:
		{
			a:0,
			v:0,
		},
	y:
		{
			a:0,
			v:0,
		},
	z:
		{
			a:0,
			v:0,
		}
}

function debug(stuff)
{

	socket.emit("debug", stuff);

}
function handleAcc(e)
{
}
/*
function accrealbad()
{
	if (StateManager.getDrawMode() == StateManager.GYRO)
	{
		let ctime = Date.now();

		let delta = (ctime - prev.time)*0.01;

		prev.time = ctime;

		let as = 0;
		let ax = e.acceleration.x;
		accState.peak += Math.round(ax);
		fq.enqueue(accState.peak);
		let v = fq.variance();
		debug("v: " + v + "    " + fq.l);
		if (v >= 2)
		{
			prev.x.v = Math.sign(accState.peak)*4;
		}
		else
		{
			prev.x.v = 0
		}
	}
}
*/

let calib = 
	{
		alpha: 0,
		beta: 0,
		gamma: 0
	}

function recalibrate()
{
	calib.alpha = lastAngle.alpha;
	calib.beta = lastAngle.beta;
	calib.gamma = lastAngle.gamma;
}

const x_sensitivity = 2;
const y_sensitivity = 3;

let lastAngle = 
	{
		alpha: 0,
		beta: 0,
		gamma: 0
	}


function handleOri(e)
{
	lastAngle.beta = e.beta;
	//lastAngle.gamma = e.gamma;
	lastAngle.alpha = e.alpha-180;

	// guaranteed -1 <= x,y <= 1
	let y = -(lastAngle.beta-calib.beta)/90;
	let x = -(lastAngle.alpha-calib.alpha)/45
	//let x = (e.gamma-calib.gamma)/90;

	y = Math.max(Math.min( y_sensitivity*y , 1),-1);
	x = Math.max(Math.min( x_sensitivity*x , 1), -1);

	socket.emit("cursor", 
		{
			y: (y + 1)*CanvasControl.getCanvasHeight()/2,
			x: (x + 1)*CanvasControl.getCanvasWidth()/2
		});
}


window.onload = () => {
	let canvas = document.getElementById("c");
	
	canvas.width = 960;
	canvas.height = 720;
		
	
	canvas.style.position = "absolute";
	canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
	canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
	
	CanvasControl.init(canvas);

	window.navigator.permissions.query({name:"accelerometer"})
                                 .then((res) => {console.log(res.state)});

	if (window.DeviceMotionEvent)
	{
	//	window.addEventListener("devicemotion", handleAcc);
		window.addEventListener("deviceorientation", handleOri);
	}
	else                y = Math.max(Math.min( sensitivity*y , 1),-1);

	{
		console.log("no accelerometer");
	}

	
	let control = CanvasControl;
	
	control.clearCanvas();

	// Socketing stuff
	let onServConn = new CustomEvent("onServConn", { detail: { id : "0000" } });
	socket = io.connect("https://applenoodlesmoothie.tech");
	
	socket.on("id", (e) => {
		onServConn.detail.id = e.id;
		document.dispatchEvent(onServConn);
	});

	debug("");debug("");debug("");debug("");debug("");debug("");debug("");debug("");debug("");debug("");debug("");debug("");
	// Pointer shiz
	Pointer.init(document.getElementById("pointer"));
	
	let personalDrawingID = 0;
	let isDrawing = false;

	CanvasControl.getHTMLCanvas().onmousedown = (e) => {
		if (StateManager.getDrawMode() == StateManager.PAN) {
			control.panStart(e.pageX, e.pageY);
		}
		if (StateManager.getDrawMode() == StateManager.GYRO) {
			return; // Don't get up in our monkey bussiness
		}
		isDrawing = true;
		let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
		personalDrawingID = CanvasControl.generateUniqueID();
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "mdown",
			x: adjustedPosition.x,
			y: adjustedPosition.y,
			id: personalDrawingID,
			extraData: {
				color: CanvasControl.getDrawColor(),
				thickness: CanvasControl.getThickness()
			}
		});
	}
	
	CanvasControl.getHTMLCanvas().ontouchstart = (e) => {
		if (StateManager.getDrawMode() == StateManager.PAN) {
			control.panStart(e.touches[0].pageX, e.touches[0].pageY);
			return;
		}
		isDrawing = true;
		let adjustedPosition;
		if (StateManager.getDrawMode() == StateManager.GYRO) {
			let p = Pointer.getPos();
			adjustedPosition = control.adjustScreenPos(p.x, p.y);
		} else {
			adjustedPosition = control.adjustScreenPos(e.touches[0].pageX, e.touches[0].pageY);
		}
		personalDrawingID = CanvasControl.generateUniqueID();
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "tdown",
			x: adjustedPosition.x,
			y: adjustedPosition.y,
			id: personalDrawingID,
			extraData: {
				color: CanvasControl.getDrawColor(),
				thickness: CanvasControl.getThickness()
			}
		});
	}

	window.onmousemove = (e) => {
		if (StateManager.getDrawMode() == StateManager.PAN) {
			control.pan(e.pageX, e.pageY);
			return;
		}
		if (StateManager.getDrawMode() == StateManager.GYRO) {
			return; // Don't get up in our monkey bussiness
		}
		if (isDrawing == true) {
			let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
			socket.emit("canvas_data",{
				mode: StateManager.getDrawMode(),
				event: "mmove",
				x: adjustedPosition.x,
				y: adjustedPosition.y,
				id: personalDrawingID
			});
		}
	}

	window.ontouchmove = (e) => {
		if (StateManager.getDrawMode() == StateManager.PAN) {
			control.pan(e.touches[0].pageX, e.touches[0].pageY);
			return;
		}
		if (isDrawing == true) {
			let adjustedPosition;
			if (StateManager.getDrawMode() == StateManager.GYRO) {
				let p = Pointer.getPos();
				adjustedPosition = control.adjustScreenPos(p.x, p.y);
			} else {
				adjustedPosition = control.adjustScreenPos(e.touches[0].pageX, e.touches[0].pageY);
			}
			socket.emit("canvas_data",{
				mode: StateManager.getDrawMode(),
				event: "tmove",
				x: adjustedPosition.x,
				y: adjustedPosition.y,
				id: personalDrawingID
			});
		}
	}
	
	window.onmouseup = (e) => {
		if (StateManager.getDrawMode() == StateManager.PAN) {
			control.panEnd();
			return;
		}
		if (StateManager.getDrawMode() == StateManager.GYRO) {
			return; // Don't get up in our monkey bussiness
		}
		isDrawing = false;
		let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "mup",
			x: adjustedPosition.x,
			y: adjustedPosition.y,
			id: personalDrawingID
		});
	}

	window.ontouchend = (e) => {
		if (StateManager.getDrawMode() == StateManager.PAN) {
			control.panEnd();
			return;
		}
		isDrawing = false;
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "tup",
			x: null,
			y: null,
			id: personalDrawingID
		});
	}
	
	window.ontouchcancel = (e) => {
		if (StateManager.getDrawMode() == StateManager.PAN) {
			control.panEnd();
			return;
		}
		isDrawing = false;
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "tup",
			x: null,
			y: null,
			id: personalDrawingID
		});
	}

	document.addEventListener("clearCanvas", (e) => {
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "clear",
			x: null,
			y: null,
			id: personalDrawingID
		});	
	});

	socket.on("draw_data", (data) => {
		switch(data.event) {
			case "mdown":
			case "tdown":
				mouseDown(data);
				break;
			case "mmove":
			case "tmove":
				mouseMove(data);
				break;
			case "mup":
			case "tup":
				mouseUp(data);
				break;
			case "clear":
				control.clearCanvas();
				break;
		}
	});

	function mouseDown(data) {
		if (data.mode == StateManager.CURSOR || data.mode == StateManager.GYRO) {
			control.penDown(data.x, data.y, data.id, data.extraData);
		}
	}

	function mouseMove(data) {
		if (data.mode == StateManager.CURSOR || data.mode == StateManager.GYRO) {
			control.draw(data.x, data.y, data.id);
		} else if (data.mode == StateManager.PAN) {
			control.pan(data.x, data.y);
		}
	}

	function mouseUp(data) {
		if (data.mode == StateManager.CURSOR || data.mode == StateManager.PAN || data.mode == StateManager.GYRO) {
			control.penUp(data.id);
		}
	}

	window.addEventListener("keydown", (e) => {
		if (e.key == "h") {
			document.querySelector("body").style.cursor = "grab";
			StateManager.setDrawMode(StateManager.PAN);
		}
	});
	
	document.addEventListener("pairRequest", (e) => {
		socket.emit("pair", e.detail.id);
	});

	document.addEventListener("recalibrate", (e) => {
		recalibrate();
	});

	socket.on("cursor", (pos) => {

		pos = control.adjustScreenPos(-pos.x, -pos.y);
		Pointer.point(-pos.x, -pos.y);
		//debug((-pos.x) + ", " + (-pos.y));
		if (StateManager.getDrawMode() == StateManager.GYRO && isDrawing == true) {
			let p = Pointer.getPos();
			let adjustedPosition = control.adjustScreenPos(p.x, p.y);
			socket.emit("canvas_data",{
				mode: StateManager.getDrawMode(),
				event: "tmove",
				x: adjustedPosition.x,
				y: adjustedPosition.y,
				id: personalDrawingID
			});
		} 
	});

}
