import React from 'react';
import FA from 'react-fontawesome';

import {Header, Table, SearchBox, Loading} from '../components';
import {Lang, network} from '../shared';
const lang = Lang.customers;
const TableSchema = {
	head: [{
		name: "Customer ID",
		sortable: "number",
		link: "customers/:id/details"
	}],
	fields: {
		"Customer ID": "customerId"
	}
};
export default React.createClass({
	getInitialState() {
		return {
			rows: null,
			current: null,
			loading: true,
			error: null
		};
	},

	componentDidMount() {
		this.getData(this.props.match.params.id);
	},

	getData(customerId, callback) {
		network.call("customers", customerId).then(({data}) => {
			this.setState({
				rows: data,
				loading: false,
				error: null
			});
			if (callback) {
				callback();
			}
		}, (error) => {
			this.setState({
				loading: false,
				error
			})
		});
	},

	render() {
		let content = (
			<div className="text-center p-4">
				<Loading />
			</div>
		);

		if (!this.state.loading && this.state.rows) {
			content = (
				<div className="customers-list container bg-white py-3 animated fadeInRight">
					<p className="lead text-muted font-weight-bold">
						{lang.table.title}
					</p>
					<p className="text-muted">
						{this.state.rows.length} {lang.resultCount}
					</p>
					<Table
						fieldMap={TableSchema.fields}
						head={TableSchema.head}
						rows={this.state.rows}
					/>
				</div>
			);
		}

		if (!this.state.loading && this.state.error) {
			content = (
				<p className="text-center text-danger lead font-weight-bold jumbotron jumbotron-fluid p-4 mt-3">
					{this.state.error}
				</p>
			)
		}

		return (
			<div className="customers pb-4">
				<Header history={this.props.history} logo animate/>
				<div className="container">
					<div className="row mt-3">
						<div className="col-12 col-md-4 text-center text-md-left">
							<a onClick={() => this.props.history.goBack()} className="text-primary btn-link cursor">
								<FA name="chevron-left" className="text-primary"/> {lang.back}
							</a>
						</div>
						<div className="col-12 col-md-8 text-center text-lg-left mt-2 mt-md-0">
							<div className="form-inline text-md-center d-inline-block">
								<div className="mb-2 mr-sm-2 mb-sm-0">
									<SearchBox value={this.props.match.params.id} defaultOption="Customer ID"
											   searchClicked={this.searchClicked}/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container-fluid">
					{content}
				</div>
			</div>
		);
	},

	searchClicked(input, type) {
		if (!input) {
			return null;
		}
		if (type === "Transaction ID") {
			return this.props.history.push(`/transactions/${input}`)
		}
		this.getData(input, () => this.props.history.replace(`/customers/${input}`));
	}
});