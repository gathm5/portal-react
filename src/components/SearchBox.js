import React from 'react';
import Fa from 'react-fontawesome';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import Lang from '../shared/Lang';
const lang = Lang.search;


export default React.createClass({
	getInitialState() {
		return {
			input: this.props.value || "",
			selected: this.props.defaultOption || lang.dropdown.defaultOption,
			dropdownOpen: false
		};
	},

	render() {
		return (
			<div className="input-group search-box">
				<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} tether>
					<DropdownToggle
						className="rounded-left rounded-left-only border-right-0 bg-info" caret>
						{this.state.selected}
					</DropdownToggle>
					<DropdownMenu>
						{this._buildDrops()}
					</DropdownMenu>
				</Dropdown>

				<input type="text" className="form-control rounded-right rounded-right-only z-0"
					   value={this.state.input}
					   onChange={(e) => this.setState({input: e.target.value})}
					   onKeyPress={this.submit}/>

				<button type="button" className="btn btn-primary ml-2"
						onClick={() => this.props.searchClicked(this.state.input, this.state.selected)}>
					<Fa name="search"/>
				</button>
			</div>
		)
	},

	submit(e) {
		if (e.key === "Enter") {
			this.props.searchClicked(this.state.input, this.state.selected);
		}
	},

	_buildDrops() {
		return lang.dropdown.options.map((_, key) => {
			return (
				<DropdownItem onClick={() => this.setState({selected: _})} key={key}>
					{_}
				</DropdownItem>
			);
		});
	},

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}
});