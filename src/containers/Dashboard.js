import React from 'react';
import {Header, HeaderSecondary, Table, Loading} from '../components';
import {Redirect} from 'react-router-dom';
import Work from 'webworkify-webpack';

import {Lang, storage} from '../shared';

export default React.createClass({
	getInitialState() {
		return {
			next: false,
			params: '',
			rows: null
		};
	},

	componentDidMount() {

		storage.session.get('recent').then((rows) => {
			this.setState({
				rows
			});
		}, () => {
			this.worker = Work(require.resolve('../worker/create-list'));
			this.worker.addEventListener('message', this.processList, false);
			this.worker.postMessage({
				mode: 'transactions',
				count: 20
			});
		});
	},

	processList({data}) {
		this.setState({
			rows: data
		});
		storage.session.set("recent", data);
	},

	render() {
		if (this.state.next) {
			return (
				<Redirect push to={`/transactions${this.state.params}`}/>
			)
		}
		let content = (
			<div className="text-center p-4">
				<Loading />
			</div>
		);
		const head = [{
			name: "Transaction ID",
			sortable: "number",
			link: "devices/",
			condition: {
				key: "status",
				value: "Complete"
			}
		}, {
			name: "Transaction Type",
			sortable: true
		}, {
			name: "Submitted",
			sortable: "date",
			typecast: 'date'
		}, {
			name: "Status",
			sortable: false
		}], fields = {
			"Transaction ID": "id",
			"Transaction Type": "type",
			"Submitted": "date",
			"Status": "status"
		};

		if (this.state.rows) {
			content = (
				<div className="recent-history container bg-white py-3 drop-shadow animated fadeIn">
					<Table
						fieldMap={fields}
						head={head}
						rows={this.state.rows}
						title={Lang.dashboard.table.title}
						deleteBtn={this.deleteItem}
					/>
				</div>
			);
		}
		return (
			<div className="dashboard bg-faded pb-4">
				<Header logo animate/>
				<HeaderSecondary searchClicked={(input, h) => this.searchClicked(input, h)} animate/>
				<div className="container-fluid bg-faded">
					{content}
				</div>
			</div>
		);
	},
	componentWillUpdate() {
		this.worker && this.worker.removeEventListener('message', this.processList, false);
	},

	deleteItem(transactionId) {

	},

	searchClicked(input) {
		let params = '';
		if (input) {
			params = `/${input}`;
		}

		this.setState({
			params,
			next: true
		})
	}
});