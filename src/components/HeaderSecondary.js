import React from 'react';
import {Link} from 'react-router-dom';
import Lang from '../shared/Lang';
const lang = Lang.headerSecondary;

import SearchBox from './SearchBox';

export default React.createClass({
	getInitialState() {
		return {
			dropdownOpen: false,
			selected: lang.dropdown.defaultOption,
			input: ''
		};
	},
	render() {
		const animateClass = this.props.animate ? " animated fadeInDown" : "";
		const FeatureBtns = this.props.showFeatureBtns ? (
			<div className="col-12 col-lg-7 text-center text-lg-right">
				<Link to="/reporting"
					  className="btn btn-info mt-2 text-muted mt-lg-0 mr-2">{lang.buttons.reporting}</Link>
				<Link to="/delete"
					  className="btn btn-info mt-2 text-muted mt-lg-0 mr-2">{lang.buttons.delete}</Link>
				<Link to="/new" className="btn btn-primary mt-2 mt-lg-0">{lang.buttons.new}</Link>
			</div>
		) : null;
		return (
			<div className={`header jumbotron jumbotron-fluid bg-white p-3 drop-shadow mt-0${animateClass}`}>
				<div className="container">
					<div className="row">
						<div className="col-12 col-lg-5 text-center text-lg-left">
							<div className="form-inline text-md-center d-inline-block">
								<div className="mb-2 mr-sm-2 mb-sm-0">
									<SearchBox searchClicked={this.props.searchClicked}/>
								</div>
							</div>
						</div>
						{FeatureBtns}
					</div>
				</div>
			</div>
		);
	},

	submit(e) {
		if (e.key === "Enter") {
			this.props.searchClicked(this.state.input);
		}
	},

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}
});