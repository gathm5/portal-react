import React from 'react';
import FA from 'react-fontawesome';

import {Header, PageTitle, ReportGenerator} from '../components';
import Lang from '../shared/Lang';

export default React.createClass({
	render() {
		return (
			<div className="new-device pb-4">
				<Header history={this.props.history} logo animate/>
				<PageTitle title={Lang.reporting.title} back={(
					<a onClick={() => this.props.history.goBack()} className="text-primary btn-link cursor">
						<FA name="chevron-left" className="text-primary"/> {Lang.reporting.back}
					</a>
				)} animate/>
				<div className="container bg-white py-5">
					<div className="row">
						<div className="col-md-6 offset-md-3">
							<ReportGenerator />
						</div>
					</div>
				</div>
			</div>
		);
	}
});