import React from 'react';
import {Dropdown, DropdownMenu, DropdownItem} from 'reactstrap';
import FA from 'react-fontawesome';

import {Lang, session} from '../shared';
import {logo} from '../images';

const lang = Lang.header;

export default React.createClass({
	getInitialState() {
		const {user} = session.isAuthenticated();
		return {
			dropdownOpen: false,
			user
		};
	},
	render() {
		let title, animateClass = '';
		if (this.props.logo) {
			title = (
				<div className="col-md-8 col-12 text-center text-md-left">
					<div className="d-inline-block cursor" onClick={() => this.goTo("/dashboard")}>
						<img src={logo} className="header-logo mr-2 mr-lg-4" alt=""/>
						<span className="text-muted font-weight-bold d-inline-block">{Lang.title}</span>
					</div>
				</div>
			)
		}
		else if (this.props.title) {
			title = (
				<div className="col-md-8 col-12 text-center text-md-left">
					<div className="d-inline-block cursor" onClick={() => this.goTo("/dashboard")}>
						<img src={logo} className="header-logo mr-2 mr-lg-4" alt=""/>
						<span className="text-muted font-weight-bold d-inline-block">{this.props.title}</span>
					</div>
				</div>
			)
		}
		if (this.props.animate) {
			animateClass = " animated fadeInDown animated-delay";
		}
		const adminLink = this.state.user.privilege < 3 ? (
			<DropdownItem onClick={() => this.goTo("/admin/manage")}>
				{lang.links.admin}
			</DropdownItem>
		) : null;
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
										{this.state.user.name}
										<FA name="chevron-down" className="pl-2"/>
									</div>
								</div>

								<DropdownMenu className="header-popup">
									{adminLink}
									<DropdownItem onClick={this.logout}>
										{lang.links.logout}
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>

						</div>
					</div>
				</div>
			</div>
		);
	},
	goTo(link) {
		if (this.props.history.location.pathname !== link) {
			this.props.history.push(link);
		}
	},
	logout() {
		session.logout();
		this.props.history.replace("/");
	},
	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}
});