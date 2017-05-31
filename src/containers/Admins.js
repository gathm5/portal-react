import React from 'react';
import {Header, Table, PageTitle, Loading} from '../components';
import FA from 'react-fontawesome';

import {Lang, network} from '../shared';

export default React.createClass({
	getInitialState() {
		return {
			rows: null,
			next: false,
			input: ""
		};
	},

	componentDidMount() {
		network.call("getUsers").then(({data}) => {
			console.log(data);
			this.setState({
				rows: data.map((row) => {
					row.status = row.isActive ? "Active" : "Inactive";
					return row;
				})
			});
		})
	},


	render() {
		const head = [{
			name: "Name",
			sortable: true
		}, {
			name: "Email",
			sortable: true
		}, {
			name: "Status",
			sortable: true
		}], fields = {
			"Name": "name",
			"Email": "email",
			"Status": "status"
		};

		if (!this.state.rows) {
			return (
				<div className="text-center p-4">
					<Loading />
				</div>
			)
		}

		return (
			<div className="admin bg-faded pb-4 transition-item transition-page">
				<Header history={this.props.history} logo animate/>
				<PageTitle title={Lang.admin.title} back={(
					<a onClick={() => this.props.history.goBack()} className="text-primary btn-link cursor">
						<FA name="chevron-left" className="text-primary"/> {Lang.admin.back}
					</a>
				)} animate/>

				<div className="manage-admin container bg-white mt-4 py-3 drop-shadow animated fadeIn">
					<div className="row pb-4">
						<div className="col-md text-center text-md-left">
							<div className="form-inline text-md-center d-inline-block">
								<div className="input-group mb-2 mr-sm-2 mb-sm-0">
									<input type="text" className="form-control rounded-right rounded-right-only z-0"
										   value={this.state.input}
										   onChange={(e) => this.setState({input: e.target.value})}/>

									<button type="button" className="btn btn-primary ml-2"
											onClick={() => this.searchClicked(this.state.input)}>
										<FA name="search"/>
									</button>
								</div>
							</div>
						</div>
						<div className="col-md text-center text-md-right">
							<button className="btn btn-primary">
								{Lang.admin.search.button}
							</button>
						</div>
					</div>
					<Table
						fieldMap={fields}
						head={head}
						rows={this.state.rows}
					/>
				</div>
			</div>
		);
	},
	searchClicked() {

	}
});