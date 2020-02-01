class CanvasControl {
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
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let control = new CanvasControl(canvas);
	
	window.onmousedown = (e) => {
		let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
		control.penDown(adjustedPosition.x, adjustedPosition.y);
	}

	window.onmousemove = (e) => {
		let adjustedPosition = control.adjustScreenPos(e.pageX, e.pageY);
		control.draw(adjustedPosition.x, adjustedPosition.y);
	}
	
	window.onmouseup = (e) => {
		control.penUp();
	}
}
