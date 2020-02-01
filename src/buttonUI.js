'use strict';

import { StateManager } from './StateManager.js';

class ToggleButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			clicked: false
		}
	}

	render() {
		if (this.state.clicked) {
			return (
				<button onClick={() => {
					StateManager.setDrawMode(StateManager.CURSOR);
					this.setState({ clicked: false });
				}}>
					GYRO MODE
				</button>
			);
		} else {
			return (
				<button onClick={() => {
					StateManager.setDrawMode(StateManager.GYRO);
					this.setState({ clicked: true });
				}}>
					CURSOR MODE
				</button>
			);
		}
	}
}

const domContainer = document.querySelector('#root');
ReactDOM.render(<ToggleButton />, domContainer);
