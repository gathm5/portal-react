import React from 'react';
import Fa from 'react-fontawesome';
import {Link} from 'react-router-dom';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import Lang from '../shared/Lang';
const lang = Lang.headerSecondary;

export default React.createClass({
	getInitialState() {
		return {
			dropdownOpen: false,
			selected: lang.dropdown.defaultOption,
			input: ''
		};
	},
	render() {
		let animateClass = '', Btn = (
			<button type="button" className="btn btn-primary ml-2"
					onClick={() => this.props.searchClicked(this.state.input)}>
				<Fa name="search"/>
			</button>
		);
		if (this.props.animate) {
			animateClass = " animated fadeInDown";
		}
		return (
			<div className={`header jumbotron jumbotron-fluid bg-white p-3 drop-shadow mt-0${animateClass}`}>
				<div className="container">
					<div className="row">
						<div className="col-md text-center text-md-left">
							<div className="form-inline text-md-center d-inline-block">
								<div className="input-group mb-2 mr-sm-2 mb-sm-0">
									<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} tether
											  onClick={(e) => e.preventDefault()}>
										<DropdownToggle
											className="rounded-left rounded-left-only border-right-0 bg-info" caret>
											{this.state.selected}
										</DropdownToggle>
										<DropdownMenu>
											<DropdownItem onClick={() => this.setState({selected: "Transaction ID"})}>
												Transaction ID
											</DropdownItem>
											<DropdownItem onClick={() => this.setState({selected: "Customer ID"})}>
												Customer ID
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>

									<input type="text" className="form-control rounded-right rounded-right-only z-0"
										   value={this.state.input}
										   onChange={(e) => this.setState({input: e.target.value})}/>

									{Btn}
								</div>
							</div>
						</div>
						<div className="col-md text-center text-md-right mt-sm-2 mt-md-0">
							<Link to="/delete" className="btn btn-primary btn-dark mr-2">Bulk delete</Link>
							<Link to="/new" className="btn btn-primary">Submit new devices</Link>
						</div>
					</div>
				</div>
			</div>
		);
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