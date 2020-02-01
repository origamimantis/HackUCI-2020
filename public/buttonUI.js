'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { StateManager } from './StateManager.js';

var ToggleButton = function (_React$Component) {
	_inherits(ToggleButton, _React$Component);

	function ToggleButton(props) {
		_classCallCheck(this, ToggleButton);

		return _possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).call(this, props));
	}

	_createClass(ToggleButton, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			if (StateManager.getDrawMode() == StateManager.GYRO) {
				return React.createElement(
					'button',
					{ onClick: function onClick() {
							StateManager.setDrawMode(StateManager.CURSOR);
							_this2.setState({ changed: true });
						} },
					'GYRO MODE'
				);
			} else if (StateManager.getDrawMode() == StateManager.CURSOR) {
				return React.createElement(
					'button',
					{ onClick: function onClick() {
							StateManager.setDrawMode(StateManager.GYRO);
							_this2.setState({ changed: true });
						} },
					'CURSOR MODE'
				);
			} else if (StateManager.getDrawMode() == StateManager.PAN) {
				return React.createElement(
					'button',
					{ onClick: function onClick() {
							StateManager.setDrawMode(StateManager.CURSOR);
							_this2.setState({ changed: true });
						} },
					'PAN MODE'
				);
			}
		}
	}]);

	return ToggleButton;
}(React.Component);

var domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(ToggleButton, null), domContainer);