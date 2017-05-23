import React from 'react';
import {Header, Table, PageTitle, Loading} from '../components';
import FA from 'react-fontawesome';
import {Button, Modal, ModalBody} from 'reactstrap';

import {Lang, network} from '../shared';
const lang = Lang["customer details"];
const modalLang = lang.modal;

const TableSchema = {
	head: [{
		name: "IMEI",
		sortable: "number",
		filter: false
	}, {
		name: "Transaction Type",
		sortable: true
	}],
	fields: {
		"IMEI": "imei",
		"Transaction Type": "type"
	}
};

export default React.createClass({
	getInitialState() {
		return {
			rows: null,
			next: false,
			current: null,
			mode: null,
			customerId: this.props.match.params.id,
			loading: true,
			modalLoading: false,
			error: null
		};
	},

	componentDidMount() {
		this.getData(this.state.customerId);
	},

	getData(customerId, callback) {
		network.call("customerDetails", customerId).then(({data}) => {
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
				<div className="animated fadeInRight">
					<Table
						head={TableSchema.head}
						fieldMap={TableSchema.fields}
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
				<PageTitle title={lang.title} back={(
					<a onClick={() => this.props.history.goBack()} className="text-primary btn-link cursor">
						<FA name="chevron-left" className="text-primary"/> {lang.back}
					</a>
				)} animate/>
				<div className="container">
					<div className="row mt-3">
						<div className="col-6">
							<span className="font-weight-bold">Customer ID</span>: {this.state.customerId}
						</div>
						<div className="col-6">
							<span
								className="font-weight-bold">Devices</span>: {this.state.rows ? this.state.rows.length : 0}
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
				this.timer = setTimeout(() => this.getData(this.state.customerId));
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
	}

});
