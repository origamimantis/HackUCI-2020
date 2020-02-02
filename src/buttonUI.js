'use strict';

import { StateManager } from './StateManager.js';
import { CanvasControl } from './main.js';

class ToggleButton extends React.Component {
	constructor(props) {
		super(props);
		this.variants = {
			StateManager.CURSOR: {
				mode: StateManager.GYRO,
				text: "CURSOR"
			},
			StateManager.GYRO: {
				mode: StateManager.CURSOR,
				text: "GYRO"
			},
			StateManager.PAN: {
				mode: StateManager.CURSOR,
				text: "PAN"
			}
		}
	}

	render() {
		let variant = this.variants[StateManager.getDrawMode()];

		return (
			<button onClick={() => {
				StateManager.setDrawMode(variant.mode);
				this.setState({ changed: true });
				document.querySelector("body").style.cursor = "default";
			}}>
				{variant.text}
			</button>
		);	
	}
}

class IDField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: "",
		}
	
		document.addEventListener("onServConn", (e) => {
			this.setState({id: e.detail.id});	
		});
	}

	render() {
		return (
			<h1>Your id is: {this.state.id} </h1>
		);
	}
}

class PairForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.pairEvent = new CustomEvent('pairRequest', { detail: {id: "000000"} })
		
	}
	
	handleChange(event) {
		this.setState({value: event.target.value});
	}
	
	handleSubmit(event) {
		event.preventDefault();
		this.pairEvent.detail.id = this.state.value;
		document.dispatchEvent(this.pairEvent);
	}


	render() {
		return (
			<form id = "pairform" onSubmit={this.handleSubmit}>
				<input key = "1" name="id" type="text" value ={this.state.value} onChange={this.handleChange}></input>
				<input key = "2" type="submit" value="Pair"></input>
			</form>
		);
	}
}

class ClearButton extends React.Component {
	constructor(props){ 
		super(props);
		this.control = new CanvasControl(document.getElementById("c"));
	} 

	render() {
		return (
			<button onClick={() => {
				this.control.clearCanvas();		
			}}>
				Clear
			</button>

		);
	}
}

const domContainer = document.querySelector('#root');
ReactDOM.render([<ToggleButton />, <IDField />, <PairForm />, <ClearButton />], domContainer);
