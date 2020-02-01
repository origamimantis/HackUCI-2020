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
				}}>
					GYRO MODE
				</button>
			);
		} else if (StateManager.getDrawMode() == StateManager.CURSOR){
			return (
				<button onClick={() => {
					StateManager.setDrawMode(StateManager.GYRO);
					this.setState({ changed: true });
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

const domContainer = document.querySelector('#root');
ReactDOM.render(<ToggleButton />, domContainer);
