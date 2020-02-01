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
}

window.onload = () => {
	let canvas = document.getElementById("c");
	
	canvas.width = 640;
	canvas.height = 480;
	
	canvas.style.position = "absolute";
	console.log(canvas.style.left);
	canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
	canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
	
	let ctx = canvas.getContext('2d');
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let control = new CanvasControl(canvas);
	
	window.onmousedown = (e) => {
		if (StateManager.getDrawMode() == StateManager.CURSOR) {
			let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
			control.penDown(adjustedPosition.x, adjustedPosition.y);
		} else if (StateManager.getDrawMode() == StateManager.PAN) {
			control.panStart(e.clientX, e.clientY);
		}
	}

	window.onmousemove = (e) => {
		if (StateManager.getDrawMode() == StateManager.CURSOR) {
			let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
			control.draw(adjustedPosition.x, adjustedPosition.y);
		} else if (StateManager.getDrawMode() == StateManager.PAN) {
			control.pan(e.clientX, e.clientY);
		}
	}
	
	window.onmouseup = (e) => {
		if (StateManager.getDrawMode() == StateManager.CURSOR || StateManager.getDrawMode() == StateManager.PAN) {
			control.penUp();
		}
	}

	window.addEventListener("keydown", (e) => {
		if (e.key == "h") {
			StateManager.setDrawMode(StateManager.PAN);
		}
	});
}
