import React from 'react';
import {Dropdown, DropdownMenu, DropdownItem} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import FA from 'react-fontawesome';

import {Lang, session} from '../shared';
import {logo} from '../images';

export default React.createClass({
	getInitialState() {
		return {
			dropdownOpen: false,
			user: "g.stalin@samsung.com",
			logout: false,
			next: null
		};
	},
	render() {
		if (this.state.logout) {
			return (
				<Redirect to="/"/>
			);
		}
		if (this.state.next) {
			return (
				<Redirect to={this.state.next}/>
			);
		}
		let title, animateClass = '';
		if (this.props.logo) {
			title = (
				<div className="col-md-8 col-12 text-center text-md-left">
					<img src={logo} className="header-logo mr-2 mr-lg-4" alt=""/>
					<span className="text-muted font-weight-bold d-inline-block">{Lang.title}</span>
				</div>
			)
		}
		else if (this.props.title) {
			title = (
				<div className="col-md-8 col-12 text-center text-md-left">
					<img src={logo} className="header-logo mr-2 mr-lg-4" alt=""/>
					<span className="text-muted font-weight-bold d-inline-block">{this.props.title}</span>
				</div>
			)
		}
		if (this.props.animate) {
			animateClass = " animated fadeInDown animated-delay";
		}
		return (
			<div
				className={`header jumbotron jumbotron-fluid bg-white p-3 mb-1 drop-shadow${animateClass}`}>
				<div className="container">
					<div className="row">
						{title}
						<div className="col-sm text-center text-md-right">
							<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} tether
									  onClick={(e) => e.preventDefault()}>
								<div
									className="d-inline-block"
									onClick={this.toggle}
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded={this.state.dropdownOpen}
								>
									<div>
										{this.state.user}
										<FA name="chevron-down" className="pl-2"/>
									</div>
								</div>

								<DropdownMenu className="header-popup">
									<DropdownItem onClick={() => this.setState({next: '/admin/manage'})}>
										Manage Admins
									</DropdownItem>
									<DropdownItem onClick={() => {
										session.logout();
										this.setState({logout: true})
									}}>
										Logout
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>

						</div>
					</div>
				</div>
			</div>
		);
	},
	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}
});