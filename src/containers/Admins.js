import React from 'react';
import {
	Button,
	ModalHeader,
	Modal,
	ModalBody,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
import FA from 'react-fontawesome';

import {Header, Table, PageTitle, Loading} from '../components';
import {Lang, network, session} from '../shared';

export default React.createClass({
	getInitialState() {
		const {user} = session.isAuthenticated();
		return {
			currentUser: user,
			rows: null,
			filteredRows: null,
			next: false,
			searchTerm: "",
			isModalOpen: false,
			isDeleteModalOpen: false,
			loading: true,
			modalLoading: false,
			modalDeleteLoading: false,
			dropdownOpen: false,
			userActive: true,
			userMode: "Admin",
			userName: "",
			userEmail: ""
		};
	},

	componentDidMount() {
		this.getData();
	},

	getData() {
		network.call("getUsers").then(({data}) => {
			this.setState({
				loading: false,
				rows: data.map((row) => {
					row.status = row.isActive ? "Active" : "Inactive";
					row.canDelete = this.state.currentUser.email !== row.email;
					row.role = row.privilege < 3 ? "Admin" : "User";
					return row;
				})
			});
		});
	},

	render() {
		const head = [{
			name: "Name",
			sortable: true
		}, {
			name: "Email",
			sortable: true
		}, {
			name: "Role",
			sortable: true
		}, {
			name: "Status",
			sortable: true
		}], fields = {
			"Name": "name",
			"Email": "email",
			"Role": "role",
			"Status": "status"
		};

		if (this.state.loading && !this.state.rows && !this.state.filteredRows) {
			return (
				<div className="text-center p-4">
					<Loading />
				</div>
			)
		}

		const showClearBtn = this.state.searchTerm ? (
			<div className="text-danger d-inline-block pt-2 pl-2"
				 onClick={() => this.setState({searchTerm: "", filteredRows: null})}>
				<FA name="times-circle"/> <span className="btn-link text-danger">clear</span>
			</div>
		) : null;

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
									<input type="text"
										   className="form-control z-0"
										   placeholder="search user"
										   value={this.state.searchTerm}
										   onChange={this.search}/>
									{showClearBtn}
								</div>
							</div>
						</div>
						<div className="col-md text-center text-md-right">
							<button className="btn btn-primary" onClick={() => this.setState({isModalOpen: true})}>
								{Lang.admin.search.button}
							</button>
						</div>
					</div>
					<Table
						fieldMap={fields}
						head={head}
						rows={this.state.filteredRows || this.state.rows}
						deleteBtn={this.deleteItem}
						deleteCondition={{key: "canDelete"}}
						doNotShowReturn
					/>
				</div>
				{this._buildModal()}
				{this._buildDeleteModel()}
			</div>
		);
	},
	deleteItem(record) {
		this.setState({
			current: record,
			isDeleteModalOpen: true
		});
	},
	search(e) {
		const newRows = this.state.rows && e.target.value ? this.state.rows.filter((row) => {
			const value = e.target.value.toLowerCase();
			return row.name.toLowerCase().indexOf(value) > -1 || row.email.toLowerCase().indexOf(value) > -1;
		}) : null;
		this.setState({
			filteredRows: newRows,
			searchTerm: e.target.value
		});
	},
	_buildModal() {
		let content = (
			<div className="text-center p-4">
				<Loading />
			</div>
		);
		const disabled = !this.state.userName || !this.state.userEmail;
		if (!this.state.loading && !this.state.modalLoading && this.state.isModalOpen) {
			content = (
				<form onSubmit={this.saveUser}>
					<div className="form-group row">
						<label className="col-3 col-form-label">Name</label>
						<div className="col-9">
							<input className="form-control" name="userName" value={this.state.userName}
								   onChange={this.handleInputChange}/>
						</div>
					</div>
					<div className="form-group row">
						<label className="col-3 col-form-label">Email</label>
						<div className="col-9">
							<input type="email" className="form-control" required name="userEmail"
								   value={this.state.userEmail}
								   onChange={this.handleInputChange}/>
						</div>
					</div>
					<div className="form-group row">
						<label className="col-3 col-form-label">Role</label>
						<div className="col-9">
							<ButtonDropdown isOpen={this.state.dropdownOpen} toggle={() => {
								this.setState({dropdownOpen: !this.state.dropdownOpen})
							}}>
								<DropdownToggle caret>
									{this.state.userMode}
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem
										onClick={() => this.setState({userMode: "Admin"})}>Admin</DropdownItem>
									<DropdownItem divider/>
									<DropdownItem onClick={() => this.setState({userMode: "User"})}>User</DropdownItem>
								</DropdownMenu>
							</ButtonDropdown>
						</div>
					</div>
					<div className="form-group row align-items-center">
						<label className="col-3 col-form-label">Active</label>
						<div className="col-9">
							<input
								className="form-check mt-2 d-inline-block"
								name="userActive"
								checked={this.state.userActive}
								type="checkbox"
								onChange={this.handleInputChange}
							/>
							<small className="ml-2 d-inline-block text-muted">(user cannot login if inactive)</small>
						</div>
					</div>
					<div className="text-center pb-3">
						<Button color="info" className="mr-2 text-muted" onClick={this.closeModal}>
							Cancel
						</Button>
						<Button type="submit" color="primary" disabled={disabled}
								className={`${disabled ? "btn-info text-muted" : ""}`}>
							Save
						</Button>
					</div>
				</form>
			);
		}
		return (
			<Modal isOpen={this.state.isModalOpen} backdropClassName="opacity-20"
				   modalClassName="mt-5 mt-sm-0" toggle={this.closeModal}>
				<ModalHeader>
					Invite User
				</ModalHeader>
				<ModalBody>
					{content}
				</ModalBody>
			</Modal>
		)
	},
	_buildDeleteModel() {
		if (!this.state.current) {
			return null;
		}
		const modalLang = Lang.admin.modal;
		const {modalDeleteLoading} = this.state;

		const content = modalDeleteLoading ? (
			<div className="text-center p-4">
				<Loading />
			</div>
		) : (
			<div>
				<p className="font-weight-bold lead">
					{modalLang.confirmation.delete.title}
				</p>
				<span className="text-muted">{modalLang.confirmation.delete.subtitle}</span>
				<div className="text-right mt-2">
					<Button color="info" size="sm" className="text-muted mr-2"
							onClick={() => this.setState({isDeleteModalOpen: false})}>{modalLang.confirmation.delete.buttons.cancel}</Button>
					<Button color="primary" size="sm"
							onClick={this.deleteUser}>{modalLang.confirmation.delete.buttons.ok}</Button>
				</div>
			</div>
		);
		return (
			<Modal isOpen={this.state.isDeleteModalOpen} toggle={() => this.setState({isDeleteModalOpen: false})}
				   backdropClassName="opacity-20"
				   modalClassName="mt-5 mt-sm-0">
				<ModalBody>
					{content}
				</ModalBody>
			</Modal>
		)
	},
	closeModal() {
		this.setState({
			isModalOpen: false,
			isDeleteModalOpen: false
		});
	},
	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	},
	saveUser(e) {
		e.preventDefault();
		this.setState({
			modalLoading: true
		});
		network.call("addUser", {
			name: this.state.userName,
			email: this.state.userEmail,
			privilege: this.state.userMode === "Admin" ? 1 : 3,
			admin: true,
			isActive: this.state.userActive
		}).then(({data}) => {
			if (data.success) {
				this.closeModal();
				this.setState({
					modalLoading: false,
					userName: "",
					userEmail: ""
				});
				setTimeout(this.getData);
			}
		});
	},
	deleteUser() {
		this.setState({
			modalDeleteLoading: true
		});
		network.call("deleteUser", {
			email: this.state.current.email
		}).then(({data}) => {
			if (data.success) {
				this.closeModal();
				this.setState({
					modalDeleteLoading: false
				});
				setTimeout(this.getData);
			}
		});
	}
});