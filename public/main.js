class CanvasControl {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this._penDown = false;

		this.ctx.strokeStyle = "#000000";
	}

	penDown(x, y) {
		this.ctx.moveTo(x - this.canvas.offsetLeft, y - this.canvas.offsetTop);
		this.ctx.beginPath();
		this._penDown = true;
	}
	draw(x, y) {
		if (this._penDown == true) {
			this.ctx.lineTo(x - this.canvas.offsetLeft, y - this.canvas.offsetTop);
			this.ctx.stroke();
		}
	}
	penUp() {
		this._penDown = false;
	}
}

window.onload = () => {
	let canvas = document.getElementById("c");
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let control = new CanvasControl(canvas);
	
	window.onmousedown = (e) => {
		control.penDown(e.clientX, e.clientY);
	}

	window.onmousemove = (e) => {
		control.draw(e.clientX, e.clientY);
	}
	
	window.onmouseup = (e) => {
		control.penUp();
	}
}
