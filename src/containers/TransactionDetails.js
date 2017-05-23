import React from 'react';
import {Header, Table, PageTitle, Loading} from '../components';
import FA from 'react-fontawesome';
import {Button, Modal, ModalBody} from 'reactstrap';

import {Lang, network, tempStore, utilities} from '../shared';
const lang = Lang["transaction details"];
const modalLang = lang.modal;

const TableSchema = {
	head: [
		{
			name: "IMEI",
			sortable: "number"
		}, {
			name: "Error Code"
		}, {
			name: "Error Detail"
		}
	],
	fields: {
		"IMEI": "imei",
		"Error Code": "errorCode",
		"Error Detail": "errorDetail"
	}
};

export default React.createClass({
	getInitialState() {
		return {
			rows: null,
			next: false,
			current: null,
			mode: null,
			batchId: null,
			customerId: null,
			submitted: null,
			transactionId: this.props.match.params.id,
			loading: true,
			modalLoading: false,
			error: null,
			errorCount: 0
		};
	},

	componentDidMount() {
		this.getDataFromStore();
		document.addEventListener("Error Checked List", this.setupFilters, false);
	},

	getDataFromStore() {
		this.getData(this.state.transactionId, () => {
			const transaction = tempStore.selected.transaction;
			if (transaction) {
				const {batchId, customerId, submitted, transactionId} = transaction;
				this.setState({
					batchId,
					customerId,
					submitted,
					transactionId
				});
			}
			this.errorList();
		});
	},

	getData(transactionId, callback) {
		network.call("devices", transactionId).then(({data}) => {
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

	setupFilters({detail}) {
		const {errorCount, errorGroups} = detail;
		this.setState({
			errorCount
		});
		if (errorGroups.length > 0) {
			const errorCodes = [], errorDetails = [];
			errorGroups.map(({errorCode, errorDetail}) => {
				errorCodes.push(errorCode);
				errorDetails.push(errorDetail);
				return true;
			});
			TableSchema.head[1].filter = errorCodes;
			TableSchema.head[2].filter = errorDetails;
			this.setState({
				errorCodes,
				errorDetails
			});
		}
	},

	errorList() {

		const createEvent = new window.CustomEvent("List Error Check", {
			detail: {
				arr: this.state.rows,
				fields: [
					TableSchema.fields["Error Code"],
					TableSchema.fields["Error Detail"]
				]
			}
		});
		document.dispatchEvent(createEvent);
	},

	render() {
		let content = (
			<div className="text-center p-4">
				<Loading />
			</div>
		);
		if (!this.state.loading && this.state.rows) {
			content = (
				<div className="animated fadeInRight">
					<Table
						fieldMap={TableSchema.fields}
						rows={this.state.rows}
						head={TableSchema.head}
						deleteBtn={this.deleteItem}
						deleteCondition={{key: "ownedBy"}}
						returnBtn={this.returnItem}
						returnCondition={{key: "ownedBy"}}
					/>
				</div>
			)
		}

		if (!this.state.loading && this.state.error) {
			content = (
				<p className="text-center text-danger lead font-weight-bold jumbotron jumbotron-fluid p-4 mt-3">
					{this.state.error}
				</p>
			)
		}

		return (
			<div className="devices pb-4">
				<Header history={this.props.history} logo animate/>
				<PageTitle
					title={lang.title}
					back={(
						<a onClick={() => this.props.history.goBack()} className="text-primary btn-link cursor">
							<FA name="chevron-left" className="text-primary"/> {lang.back}
						</a>
					)} animate
				/>
				<div className="container">
					<div className="row mt-3">
						<div className="col-6 col-sm-4">
							<span className="font-weight-bold">{lang.info.field1}</span>: {this.state.transactionId}
						</div>
						<div className="col-6 col-sm-4">
							<span className="font-weight-bold">{lang.info.field2}</span>: {this.state.customerId}
						</div>
						<div className="col-6 col-sm-4">
							<span
								className="font-weight-bold">{lang.info.field3}</span>: {this.state.rows ? this.state.rows.length : 0}
						</div>
						<div className="col-6 col-sm-4">
							<span className="font-weight-bold">{lang.info.field4}</span>: {this.state.batchId}
						</div>
						<div className="col-6 col-sm-4">
							<span
								className="font-weight-bold">{lang.info.field5}</span>: {utilities.niceDate(this.state.submitted)}
						</div>
						<div className="col-6 col-sm-4">
							<span className="font-weight-bold">{lang.info.field6}</span>: {this.state.errorCount}
						</div>
					</div>
					{content}
				</div>
				{this._buildModel()}
			</div>
		);
	},

	toggle() {
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	},

	_buildModel() {
		if (!this.state.current) {
			return null;
		}
		const {mode, modalLoading} = this.state;

		const content = modalLoading ? (
			<div className="text-center p-4">
				<Loading />
			</div>
		) : (
			<div>
				<p className="font-weight-bold lead">
					{modalLang.confirmation[mode].title}
				</p>
				<span className="text-muted">{modalLang.confirmation[mode].subtitle}</span>
				<div>
							<span
								className="font-weight-bold">{modalLang.confirmation[mode].key}</span>: {this.state.current.imei}
				</div>
				<div className="text-right mt-2">
					<Button color="info" size="sm" className="text-muted mr-2"
							onClick={this.toggle}>{modalLang.confirmation[mode].buttons.cancel}</Button>
					<Button color="primary" size="sm"
							onClick={() => this.confirmAction(this.state.mode)}>{modalLang.confirmation[mode].buttons.ok}</Button>
				</div>
			</div>
		);
		return (
			<Modal isOpen={this.state.isModalOpen} toggle={this.toggle} backdropClassName="opacity-20"
				   modalClassName="mt-5 mt-sm-0">
				<ModalBody>
					{content}
				</ModalBody>
			</Modal>
		)
	},

	confirmAction(type) {
		const {batchId, transactionId, customerId, current} = this.state;
		const sendData = {
			batchId,
			transactionId,
			customerId,
			type,
			deviceId: current.imei
		};
		this.setState({
			modalLoading: true
		});
		network
			.call(`${type}Device`, sendData)
			.then(() => {
				this.setState({
					isModalOpen: false,
					modalLoading: false,
					loading: true
				});
				this.timer = setTimeout(this.getDataFromStore);
			}, () => {
				this.setState({
					isModalOpen: false,
					modalLoading: false
				});
			});
	},

	componentWillUnmount() {
		document.removeEventListener("Error Checked List", this.setupFilters, false);
	},

	deleteItem(device) {
		this.setState({
			mode: "delete",
			current: device,
			isModalOpen: true
		});
	},

	returnItem(device) {
		this.setState({
			mode: "returned",
			current: device,
			isModalOpen: true
		});
	}

});