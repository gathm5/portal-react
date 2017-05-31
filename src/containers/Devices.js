import React from 'react';
import FA from 'react-fontawesome';
import {Button, Modal, ModalBody} from 'reactstrap';

import {Header, Table, SearchBox, Loading} from '../components';
import {Lang, network} from '../shared';
const lang = Lang.devices;
const modalLang = lang.modal;
const TableSchema = {
	head: [{
		name: "IMEI",
		sortable: "number"
	}, {
		name: "Customer ID",
		sortable: "number",
		link: "customers/:id/details"
	}, {
		name: "Transaction Type",
		sortable: true
	}, {
		name: "Submitted",
		sortable: "date",
		typecast: "date"
	}],
	fields: {
		"IMEI": "deviceId",
		"Customer ID": "customerId",
		"Transaction Type": "type",
		"Submitted": "submitted"
	}
};
export default React.createClass({
	getInitialState() {
		return {
			rows: null,
			current: null,
			loading: true,
			error: null,
			deviceId: this.props.match.params.id
		};
	},

	componentDidMount() {
		this.getData(this.props.match.params.id);
	},

	getData(deviceId, callback) {
		network.call("imei", deviceId).then(({data}) => {
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
						deleteBtn={this.deleteItem}
						deleteCondition={{key: "ownedBy"}}
						returnBtn={this.returnItem}
						returnCondition={{key: "ownedBy"}}
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
			<div className="devices pb-4">
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
									<SearchBox value={this.props.match.params.id} defaultOption="IMEI"
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
		const {customerId, current} = this.state;
		const sendData = {
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
				this.timer = setTimeout(() => this.getData(this.state.deviceId));
			}, () => {
				this.setState({
					isModalOpen: false,
					modalLoading: false
				});
			});
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
	},

	searchClicked(input, type) {
		if (!input) {
			return null;
		}
		if (type === "Transaction ID") {
			return this.props.history.push(`/transactions/${input}`)
		}
		else if (type === "Customer ID") {
			return this.props.history.push(`/customers/${input}`)
		}
		this.getData(input, () => this.props.history.replace(`/devices/${input}`));
	}
});