'use strict';

import { StateManager } from './StateManager.js';

export class CanvasControl {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this._penDown = false;

		this.ctx.strokeStyle = "#000000";
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
		}
	}

	window.onmousemove = (e) => {
		if (StateManager.getDrawMode() == StateManager.CURSOR) {
			let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
			control.draw(adjustedPosition.x, adjustedPosition.y);
		}
	}
	
	window.onmouseup = (e) => {
		if (StateManager.getDrawMode() == StateManager.CURSOR) {
			control.penUp();
		}
	}
}
