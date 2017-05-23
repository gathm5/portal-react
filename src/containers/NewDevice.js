import React from 'react';
import {Button, Modal, ModalBody} from 'reactstrap';
import FA from 'react-fontawesome';

import {Header, Uploader, PageTitle, Loading} from '../components';
import {network, Lang} from '../shared';

export default React.createClass({
	getInitialState() {
		return {
			file: null,
			progress: null,
			isModalOpen: false,
			loading: false,
			data: null,
			error: null
		};
	},

	render() {
		return (
			<div className="new-device pb-4">
				<Header history={this.props.history} logo animate/>
				<PageTitle title={Lang.newDevice.title} back={(
					<a onClick={() => this.props.history.goBack()} className="text-primary btn-link cursor">
						<FA name="chevron-left" className="text-primary"/> {Lang.newDevice.back}
					</a>
				)} animate/>

				<div className="container bg-white py-5">
					<div className="row">
						<div className="col-md-6 offset-md-3">
							<Uploader back="/dashboard" file={this.state.file} setFile={this.setFile}
									  upload={this.upload}/>
						</div>
					</div>
				</div>
				{this._buildModal()}
			</div>
		);
	},

	upload() {
		if (this.state.file) {
			const formData = new FormData();
			formData.append("csv", this.state.file);
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data;'
				},
				onUploadProgress: (progressEvent) => {
					this.setState({
						progress: Math.round((progressEvent.loaded * 100) / progressEvent.total)
					});
				}
			};
			this.setState({
				loading: true,
				isModalOpen: true,
				data: null,
				error: null
			});
			network
				.call("bulkAdd", formData, config)
				.then(({data}) => {
					if (data.success) {
						this.setState({
							loading: false,
							data
						});
					}
					else {
						this.setState({
							loading: false,
							error: data
						})
					}
				})
				.catch(error => console.log("err", error));
		}
	},

	setFile(file) {
		this.setState({
			file
		});
	},

	_buildModal() {
		const lang = Lang.uploader.upload;
		const modalLang = lang.modal;
		let content = (
			<div className="text-center p-4">
				<p className="lead mb-2">
					{modalLang.progress.pre}
				</p>
				<Loading />
			</div>
		);
		if (!this.state.loading && this.state.isModalOpen) {
			content = !this.state.error && this.state.data ? (
				<div>
					<p className="font-weight-bold lead">
						{modalLang.success.title}
					</p>
					<span className="text-muted">{modalLang.success.subtitle}</span>
					<div>
						<span
							className="font-weight-bold">{modalLang.success.label}</span> {this.state.data.batchId}
					</div>
					<div>
						<span
							className="font-weight-bold">{modalLang.success.labelStatus}</span> {this.state.data.status}
					</div>
					<div className="text-right">
						<Button color="primary" onClick={this.closeModal}>{modalLang.success.btnLabel}</Button>
					</div>
				</div>
			) : (
				<div>
					<p className="font-weight-bold lead">
						{modalLang.failure.title}
					</p>
					{
						this.state.error.batchId ? (
							<div>
								<span className="font-weight-bold">
									{modalLang.failure.label}
								</span> {this.state.error.batchId}
							</div>
						) : null
					}
					<div>
						<span
							className="font-weight-bold">{modalLang.failure.labelStatus}</span> {this.state.error.status}
					</div>
					<div className="text-right">
						<Button color="primary" onClick={this.closeModal}>{modalLang.failure.btnLabel}</Button>
					</div>
				</div>
			);
		}
		return (
			<Modal isOpen={this.state.isModalOpen} backdropClassName="opacity-20"
				   modalClassName="mt-5 mt-sm-0">
				<ModalBody>
					{content}
				</ModalBody>
			</Modal>
		);
	},
	closeModal() {
		this.setState({
			isModalOpen: false
		});
	}
});