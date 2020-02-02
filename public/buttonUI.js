'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { StateManager } from './StateManager.js';
import { CanvasControl } from './main.js';

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
							document.querySelector("body").style.cursor = "default";
						} },
					'GYRO MODE'
				);
			} else if (StateManager.getDrawMode() == StateManager.CURSOR) {
				return React.createElement(
					'button',
					{ onClick: function onClick() {
							StateManager.setDrawMode(StateManager.GYRO);
							_this2.setState({ changed: true });
							document.querySelector("body").style.cursor = "default";
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

var IDField = function (_React$Component2) {
	_inherits(IDField, _React$Component2);

	function IDField(props) {
		_classCallCheck(this, IDField);

		var _this3 = _possibleConstructorReturn(this, (IDField.__proto__ || Object.getPrototypeOf(IDField)).call(this, props));

		_this3.state = {
			id: ""
		};

		document.addEventListener("onServConn", function (e) {
			_this3.setState({ id: e.detail.id });
		});
		return _this3;
	}

	_createClass(IDField, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'h1',
				null,
				'Your id is: ',
				this.state.id,
				' '
			);
		}
	}]);

	return IDField;
}(React.Component);

var PairForm = function (_React$Component3) {
	_inherits(PairForm, _React$Component3);

	function PairForm(props) {
		_classCallCheck(this, PairForm);

		var _this4 = _possibleConstructorReturn(this, (PairForm.__proto__ || Object.getPrototypeOf(PairForm)).call(this, props));

		_this4.state = { value: '' };
		_this4.handleChange = _this4.handleChange.bind(_this4);
		_this4.handleSubmit = _this4.handleSubmit.bind(_this4);

		_this4.pairEvent = new CustomEvent('pairRequest', { detail: { id: "000000" } });

		return _this4;
	}

	_createClass(PairForm, [{
		key: 'handleChange',
		value: function handleChange(event) {
			this.setState({ value: event.target.value });
		}
	}, {
		key: 'handleSubmit',
		value: function handleSubmit(event) {
			event.preventDefault();
			this.pairEvent.detail.id = this.state.value;
			document.dispatchEvent(this.pairEvent);
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'form',
				{ id: 'pairform', onSubmit: this.handleSubmit },
				React.createElement('input', { key: '1', name: 'id', type: 'text', value: this.state.value, onChange: this.handleChange }),
				React.createElement('input', { key: '2', type: 'submit', value: 'Pair' })
			);
		}
	}]);

	return PairForm;
}(React.Component);

var ClearButton = function (_React$Component4) {
	_inherits(ClearButton, _React$Component4);

	function ClearButton(props) {
		_classCallCheck(this, ClearButton);

		var _this5 = _possibleConstructorReturn(this, (ClearButton.__proto__ || Object.getPrototypeOf(ClearButton)).call(this, props));

		_this5.control = new CanvasControl(document.getElementById("c"));
		return _this5;
	}

	_createClass(ClearButton, [{
		key: 'render',
		value: function render() {
			var _this6 = this;

			return React.createElement(
				'button',
				{ onClick: function onClick() {
						_this6.control.clearCanvas();
					} },
				'Clear'
			);
		}
	}]);

	return ClearButton;
}(React.Component);

var domContainer = document.querySelector('#root');
ReactDOM.render([React.createElement(ToggleButton, null), React.createElement(IDField, null), React.createElement(PairForm, null), React.createElement(ClearButton, null)], domContainer);