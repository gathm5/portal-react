import React from 'react';
import FA from 'react-fontawesome';
import {Button, Modal, ModalBody} from 'reactstrap';

import {Header, Table, SearchBox, Loading} from '../components';
import {Lang, network, tempStore, utilities} from '../shared';

const lang = Lang.transactions;
const modalLang = lang.modal;

const TableSchema = {
	head: [{
		name: "Transaction ID",
		sortable: "number",
		condition: ({canClick = true}) => {
			return canClick;
		}
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
		typecast: 'date'
	}, {
		name: "Status",
		sortable: false
	}],
	fields: {
		"Transaction ID": "transactionId",
		"Customer ID": "customerId",
		"Transaction Type": "type",
		"Submitted": "submitted",
		"Status": "status"
	}
};

export default React.createClass({
	getInitialState() {
		TableSchema.head[0].link = (contentRow) => {
			const item = this.state.rows.filter((row) => contentRow.transactionId === row.transactionId);
			if (item && item.length > 0) {
				tempStore.selected.transaction = item[0];
			}
			this.props.history.push(`/transactions/${contentRow.transactionId}/details`);
		};
		return {
			rows: null,
			isModalOpen: false,
			current: null,
			loading: true,
			modalLoading: false,
			error: null
		};
	},

	componentDidMount() {
		this.getData(this.props.match.params.id);
	},

	toggle() {
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	},

	getData(transactionId, callback) {
		network
			.call("transactions", transactionId)
			.then(({data}) => {
				const sortedData = utilities.sortArrayByDate(data, "submitted");
				this.setState({
					rows: sortedData,
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
				<div className="transactions-list container bg-white py-3 animated fadeInRight">
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
						deleteCondition={{key: "canDelete"}}
						doNotShowReturn
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
			<div className="transactions pb-4">
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
									<SearchBox value={this.props.match.params.id}
											   searchClicked={(input, h) => this.searchClicked(input, h)}/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container-fluid">
					{content}
				</div>
				{this._buildModel()}
			</div>
		);
	},

	_buildModel() {
		if (!this.state.current) {
			return null;
		}
		const {modalLoading} = this.state;

		const content = modalLoading ? (
			<div className="text-center p-4">
				<Loading />
			</div>
		) : (
			<div>
				<p className="font-weight-bold lead">
					{modalLang.confirmation.title}
				</p>
				<span className="text-muted">{modalLang.confirmation.subtitle}</span>
				<div>
							<span
								className="font-weight-bold">{modalLang.confirmation.key}</span>: {this.state.current.transactionId}
				</div>
				<div className="text-right mt-2">
					<Button color="info" size="sm" className="text-muted mr-2"
							onClick={this.toggle}>{modalLang.confirmation.buttons.cancel}</Button>
					<Button color="primary" size="sm"
							onClick={this.confirmAction}>{modalLang.confirmation.buttons.ok}</Button>
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

	confirmAction() {
		const {current} = this.state;
		const sendData = {
			type: "Delete",
			transactionId: current.transactionId,
			customerId: current.customerId
		};
		this.setState({
			modalLoading: true
		});
		network
			.call("deleteTransaction", sendData)
			.then(() => {
				this.setState({
					isModalOpen: false,
					modalLoading: false
				});
				this.getData(this.props.match.params.id);
			}, () => {
				this.setState({
					isModalOpen: false,
					modalLoading: false
				});
			});
	},

	deleteItem(transaction) {
		this.setState({
			isModalOpen: true,
			current: transaction
		});
	},

	searchClicked(input, type) {
		if (!input) {
			return null;
		}
		if (type === "Customer ID") {
			return this.props.history.push(`/customers/${input}`)
		}
		this.getData(input, () => this.props.history.replace(`/transactions/${input}`));
	}
});