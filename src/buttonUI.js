'use strict';

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
				<button onClick={() => this.setState({ clicked: false })}>
					Butt
				</button>
			);
		} else {
			return (
				<button onClick={() => this.setState({ clicked: true })}>
					Poop
				</button>
			);
		}
	}
}

const domContainer = document.querySelector('#root');
ReactDOM.render(<ToggleButton />, domContainer);
