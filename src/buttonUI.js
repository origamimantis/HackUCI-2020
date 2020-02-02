'use strict';

import { StateManager } from './StateManager.js';

class ToggleButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (StateManager.getDrawMode() == StateManager.GYRO) {
			return (
				<button onClick={() => {
					StateManager.setDrawMode(StateManager.CURSOR);
					this.setState({ changed: true });
					document.querySelector("body").style.cursor = "default";
				}}>
					GYRO MODE
				</button>
			);
		} else if (StateManager.getDrawMode() == StateManager.CURSOR){
			return (
				<button onClick={() => {
					StateManager.setDrawMode(StateManager.GYRO);
					this.setState({ changed: true });
					document.querySelector("body").style.cursor = "default";
				}}>
					CURSOR MODE
				</button>
			);
		} else if (StateManager.getDrawMode() == StateManager.PAN) {
			return (
				<button onClick={() => {
					StateManager.setDrawMode(StateManager.CURSOR);
					this.setState({ changed: true });
				}}>
					PAN MODE
				</button>
			);	
		}
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

class clearButton extends React.Component {
	constructor(props){ 
		super(props);
	} 

	render() {
		return (
			<button onClick={() => {

			}}>
				Clear
			</button>

		);
	}
}

const domContainer = document.querySelector('#root');
ReactDOM.render([<ToggleButton />, <IDField />, <PairForm />], domContainer);
