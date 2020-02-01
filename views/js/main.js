class CanvasControl {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.penDown = false;

		this.ctx.strokeStyle = "#000000";
	}

	penDown(x, y) {
		ctx.moveTo(x, y);
		ctx.beginPath();
		this.penDown = true;
	}
	draw(x, y) {
		if (this.penDown == true) {
			this.lineTo(x, y);
		}
	}
	penUp() {
		this.penDown = false;
	}
}

document.onload = () => {
	console.log("butt hol");
	let canvas = document.getElementById("c");

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
