import React from 'react';
import {Header, Table, PageTitle, Loading} from '../components';
import Work from 'webworkify-webpack';
import FA from 'react-fontawesome';

import {Lang, storage} from '../shared';

export default React.createClass({
	getInitialState() {
		return {
			rows: null,
			next: false
		};
	},

	componentDidMount() {
		storage.session.get('devices').then((rows) => {
			this.setState({
				rows
			});
		}, () => {
			this.worker = Work(require.resolve('../worker/create-list'));
			this.worker.addEventListener('message', this.processList, false);

			this.worker.postMessage({
				mode: 'devices',
				count: 1000
			});
		});
	},

	processList({data}) {
		this.setState({
			rows: data
		});
		storage.session.set("devices", data);
	},

	render() {

		if (!this.state.rows) {
			return (
				<div className="text-center p-4">
					<Loading />
				</div>
			)
		}

		const head = [{
			name: "IMEI",
			sortable: "number",
			filter: false
		}, {
			name: "SN",
			sortable: "number",
			filter: false
		}, {
			name: "Error Code",
			sortable: false,
			filter: true
		}, {
			name: "Error Detail",
			sortable: false,
			filter: true
		}], fields = {
			"IMEI": "imei",
			"SN": "sn",
			"Error Code": "code",
			"Error Detail": "detail"
		};

		return (
			<div className="devices pb-4">
				<Header logo animate/>
				<PageTitle title={Lang.devices.title} animate/>
				<div className="container animated fadeIn">
					<div className="text-center text-sm-left py-3">
						<a onClick={() => this.props.history.goBack()} className="text-primary btn-link cursor">
							<FA name="chevron-left" className="text-primary"/> Return to search results
						</a>
					</div>
					<Table
						fieldMap={fields}
						rows={this.state.rows}
						head={head}
						deleteBtn={this.deleteItem}
						returnBtn={this.returnItem}
					/>
				</div>
			</div>
		);
	},

	deleteItem(deviceId) {

	},

	returnItem(deviceId) {

	},

	componentWillUpdate() {
		this.worker && this.worker.removeEventListener('message', this.processList, false);
	},
});