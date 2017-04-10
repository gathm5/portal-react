import React from 'react';
import {Header, Table, PageTitle, Loading} from '../components';
import FA from 'react-fontawesome';

import {Lang, Data} from '../shared';

export default React.createClass({
	getInitialState() {
		return {
			rows: Data.admins,
			next: false,
			input: ""
		};
	},
	render() {
		const head = [{
			name: "First Name",
			sortable: true
		}, {
			name: "Last Name",
			sortable: true
		}, {
			name: "Login ID",
			sortable: true
		}, {
			name: "Phone",
			sortable: true
		}, {
			name: "Status",
			sortable: true
		}], fields = {
			"First Name": "firstName",
			"Last Name": "lastName",
			"Login ID": "login",
			"Phone": "phone",
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
			<div className="admin bg-faded pb-4">
				<Header logo animate/>
				<PageTitle bg="bg-white drop-shadow" title={Lang.admin.title}/>
				<div className="manage-admin container bg-white mt-4 py-3 drop-shadow animated fadeInUp">
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