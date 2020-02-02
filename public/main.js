'use strict';

import { StateManager } from './StateManager.js';

export class CanvasControl {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this._penDown = false;

		this.ctx.strokeStyle = "#000000";

		this._lastPan = {
			x: 0,
			y: 0
		}
	}

	penDown(x, y) {
		this.ctx.moveTo(x, y);
		this.ctx.beginPath();
		this._penDown = true;
	}
	draw(x, y) {
		if (this._penDown == true) {
			this.ctx.lineTo(x, y);
			this.ctx.stroke();
		}
	}
	penUp() {
		this._penDown = false;
	}
	
	panStart(clientX, clientY) {
		this._lastPan = {
			x: this.canvas.offsetLeft,
			y: this.canvas.offsetTop,
			mouseX: clientX,
			mouseY: clientY
		}
		this._penDown = true;
	}

	pan(clientX, clientY) {
		if (this._penDown == true) {
			this.canvas.style.left = (clientX - this._lastPan.mouseX) + this._lastPan.x + "px";
			this.canvas.style.top = (clientY - this._lastPan.mouseY) + this._lastPan.y + "px";
		}
	}

	adjustScreenPos(pageX, pageY) {
		return {
			x: pageX - this.canvas.offsetLeft,
			y: pageY - this.canvas.offsetTop
		};
	}

	clearCanvas() {
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
	}
}

function getPosFromAcc()
{}



window.onload = () => {
	let canvas = document.getElementById("c");
	
	canvas.width = 640;
	canvas.height = 480;
	
	canvas.style.position = "absolute";
	canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
	canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
	
	let control = new CanvasControl(canvas);
	
	control.clearCanvas();

	// Socketing stuff
	let onServConn = new CustomEvent("onServConn", { detail: { id : "0000" } });
	let socket = io.connect("https://applenoodlesmoothie.tech");
	
	socket.on("id", (e) => {
		onServConn.detail.id = e.id;
		document.dispatchEvent(onServConn);
	});


	window.onmousedown = (e) => {
		let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "down",
			x: adjustedPosition.x,
			y: adjustedPosition.y
		});
	}
	
	window.ontouchstart = (e) => {
		let adjustedPosition;
		switch (StateManager.getDrawMode())
		{
		case StateManager.CURSOR:
			adjustedPosition = control.adjustScreenPos(e.touches[0].pageX, e.touches[0].pageY);
				break;
		case StateManager.GYRO:
			adjustedPosition = getPosFromAcc();
		}
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "down",
			x: adjustedPosition.x,
			y: adjustedPosition.y
		});
	}

	window.onmousemove = (e) => {
		let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "move",
			x: adjustedPosition.x,
			y: adjustedPosition.y
		});
	}

	window.ontouchmove = (e) => {
		let adjustedPosition = control.adjustScreenPos(e.touches[0].pageX, e.touches[0].pageY);
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "move",
			x: adjustedPosition.x,
			y: adjustedPosition.y
		});
	}
	
	window.onmouseup = (e) => {
		let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "up",
			x: adjustedPosition.x,
			y: adjustedPosition.y
		});
	}

	window.ontouchend = (e) => {
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "up",
			x: null,
			y: null
		});
	}
	
	window.ontouchcancel = (e) => {
		socket.emit("canvas_data",{
			mode: StateManager.getDrawMode(),
			event: "up",
			x: null,
			y: null
		});
	}
	socket.on("draw_data", (data) => {
		switch(data.event) {
			case "down":
				mouseDown(data);
				break;
			case "move":
				mouseMove(data);
				break;
			case "up":
				mouseUp(data);
				break;
		}
	});

	function mouseDown(data) {
		if (data.mode == StateManager.CURSOR) {
			control.penDown(data.x, data.y);
		} else if (data.mode == StateManager.PAN) {
			control.panStart(data.x, data.y);
		}
	}

	function mouseMove(data) {
		if (data.mode == StateManager.CURSOR) {
			control.draw(data.x, data.y);
		} else if (data.mode == StateManager.PAN) {
			control.pan(data.x, data.y);
		}
	}

	function mouseUp(data) {
		if (data.mode == StateManager.CURSOR || data.mode == StateManager.PAN) {
			control.penUp();
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
	
	let ACC = new Accelerometer({frequency: 60});

        let accData = {
                x: 0,
                y: 0,
                z: 0
        };

	ACC.addEventListener("reading", (e)=>
		{
			accData = {x:ACC.x, y:ACC.y, z:ACC.z};
		}
	)

	ACC.start();


}
