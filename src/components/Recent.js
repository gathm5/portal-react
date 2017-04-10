import React from 'react';
import Table from './Table';

export default React.createClass({
	getInitialState() {
		return {
			rows: null
		};
	},

	render() {
		return (
			<div className="recent-history container bg-white py-3 drop-shadow animated fadeInUp">
				<Table title={this.props.title} head={this.props.head} rows={this.props.rows}/>
			</div>
		);
	}
});