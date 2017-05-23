import React from 'react';
import {Modal, ModalBody} from 'reactstrap';
import _ from 'lodash';

import {Header, HeaderSecondary, Table, Loading} from '../components';

import {Lang, network, tempStore, utilities} from '../shared';

const lang = Lang.batches;
const TableSchema = {
	batch: {
		head: [{
			name: "Batch ID",
			sortable: true,
			condition: {
				key: "Batch Status",
				value: "complete"
			}

		}, {
			name: "Batch Status",
			sortable: true
		}, {
			name: "Batch Type",
			sortable: true
		}, {
			name: "Submitted",
			sortable: "date",
			typecast: 'date'
		}],
		fields: {
			"Batch ID": "batchId",
			"Batch Status": "status",
			"Batch Type": "type",
			"Submitted": "submitted"
		}
	},
	batchDetail: {
		head: [{
			name: "Customer ID",
			sortable: false
		}, {
			name: "Devices"
		}, {
			name: "Errors"
		}],
		fields: {
			"Customer ID": "customerId",
			"Devices": "deviceCount",
			"Errors": "errorCount"
		}
	}
};


export default React.createClass({
	getInitialState() {
		TableSchema.batch.head[0].link = (row) => {
			const {batchId} = row;
			this.props.history.push(`/dashboard?batch=${batchId}`);
			this.setOverlayTable(batchId);
			this.setState({
				selectedRow: row
			});
		};
		TableSchema.batchDetail.head[0].link = (row) => {
			tempStore.selected.batch = this.state.selectedRow;
			this.props.history.push(`/batch/${this.state.selected}/customer/${row.customerId}`);
		};
		return {
			next: false,
			params: '',
			rows: null,
			isModalOpen: false,
			selected: null,
			detailsRow: null,
			error: null,
			loading: true,
			modalLoading: true,
			modalError: null,
			selectedRow: null
		};
	},

	componentDidMount() {
		network.call("batches").then(({data}) => {
			const sortedData = utilities.sortArrayByDate(data, "submitted");
			this.setState({
				loading: false,
				rows: sortedData
			});
		}, (error) => {
			this.setState({
				loading: false,
				error
			})
		});

		const params = this.props.location.search, batchId = params ? params.replace("?batch=", "") : null;
		if (batchId) {
			this.setOverlayTable(batchId);
		}
	},

	getCurrentBatch(batchId) {
		return _.filter(this.state.rows, {batchId});
	},

	toggle() {
		this.setState({
			isModalOpen: !this.state.isModalOpen
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
				<div className="recent-history container bg-white py-3 drop-shadow animated fadeInRight">
					<Table
						head={TableSchema.batch.head}
						fieldMap={TableSchema.batch.fields}
						rows={this.state.rows}
						title={lang.table.title}
					/>
				</div>
			);
		}
		else if (!this.state.loading && this.state.error) {
			content = (
				<p className="text-danger text-center lead font-weight-bold">
					{this.state.error}
				</p>
			)
		}


		return (
			<div className="dashboard bg-faded pb-4 fill">
				<Header history={this.props.history} logo animate/>
				<HeaderSecondary showFeatureBtns searchClicked={(input, h) => this.searchClicked(input, h)} animate/>
				<div className="container-fluid bg-faded">
					{content}
				</div>
				{this._buildModal()}
			</div>
		);
	},

	setOverlayTable(id) {
		this.setState({
			modalLoading: true
		});
		network.call("batchDetails", id).then(({data}) => {
			this.setState({
				detailsRow: data,
				selected: id,
				modalLoading: false,
				modalError: null
			})
		}, (error) => {
			this.setState({
				detailsRow: null,
				modalLoading: false,
				selected: id,
				modalError: error
			})
		});
	},

	_buildModal() {

		const params = this.props.location.search, batchId = params ? params.replace("?batch=", "") : null,
			batch = batchId ? this.getCurrentBatch(batchId) : null;

		if (!batchId || !batch.length) {
			return null;
		}

		const {type, status, submitted} = batch[0];

		const innerTable = !this.state.modalLoading && !this.state.modalError ? (
			<Table
				fieldMap={TableSchema.batchDetail.fields}
				head={TableSchema.batchDetail.head}
				rows={this.state.detailsRow}
				className="auto-height"
			/>
		) : this.state.modalError ? (
			<p className="text-danger text-center lead mt-3">
				{this.state.modalError}
			</p>
		) : (
			<div className="text-center my-3">
				<Loading />
			</div>
		);

		return (
			<Modal isOpen={!!batchId} toggle={() => this.props.history.replace("/dashboard")} className="free-modal">
				<ModalBody>
					<div className="abs-right-top">
						<button onClick={() => this.props.history.replace("/dashboard")} type="button"
								className="close pt-3 pr-3" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="row mt-4">
						<div className="col-12 col-sm-6">
							<span className="font-weight-bold">{lang.info.field1}</span>: {batchId}
						</div>
						<div className="col-12 col-sm-6">
							<span className="font-weight-bold">{lang.info.field2}</span>: {type}
						</div>
						<div className="col-12 col-sm-6">
							<span className="font-weight-bold">{lang.info.field3}</span>: {status}
						</div>
						<div className="col-12 col-sm-12 col-md-6">
							<span
								className="font-weight-bold">{lang.info.field4}</span>: {utilities.niceDate(submitted)}
						</div>
					</div>
					{innerTable}
				</ModalBody>
			</Modal>
		);
	},

	searchClicked(input, type) {
		if (!input) {
			return;
		}
		type === "Transaction ID" ? this.props.history.push(`/transactions/${input}`)
			: this.props.history.push(`/customers/${input}`)
	}
});