import React from 'react';
import {Table} from 'reactstrap';

export default React.createClass({
	getInitialState() {
		return {
			key: null,
			page: null,
			pages: []
		};
	},
	render() {
		return (
			<Table striped responsive bordered>
				<thead>
				{this.props.header}
				</thead>

			</Table>
		)
	}
})