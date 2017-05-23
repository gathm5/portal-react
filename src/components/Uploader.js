import React from 'react';
import Lang from '../shared/Lang';
import {Link} from 'react-router-dom';
import {Button, Modal, ModalBody} from 'reactstrap';
import DropZone from 'react-dropzone';
import Loading from './Loading';


let lang;
export default React.createClass({
	getInitialState() {
		lang = Lang.uploader.upload;
		if (this.props.delete) {
			lang = Lang.uploader.delete
		}
		return {
			lang,
			file: null,
			modal: false,
			loading: false,
			uploadErrorBeforeSubmit: false
		};
	},
	render() {
		const lang = this.state.lang;
		const enabled = this.props.file && this.props.file.name;
		const submitBtnClass = enabled ? "btn-primary text-white" : "btn-info text-muted";
		return (
			<div className="text-left">
				<p className="lead text-primary font-weight-bold">
					{lang.title}
				</p>
				<p>
					{lang.subtitle}
				</p>
				<p className="lead font-weight-bold">
					{lang.formTitle}
				</p>
				<div className="border-5 border-light">
					<button className="btn btn-primary rounded-left-only" onClick={() => this.uploadRef.open()}>
						{lang.btnTitle}
					</button>

					<span className="text-muted d-inline-block ml-3">
						{this.props.file ? this.props.file.name : null}
					</span>
					<DropZone className="hidden" ref={(node) => this.uploadRef = node} onDrop={this.onDrop}
							  accept=".csv" multiple={false}/>
				</div>
				<div className="text-right mt-4">
					<Link to={this.props.back} className="btn btn-secondary text-muted mr-3">
						{lang.cancel}
					</Link>
					<button type="button" disabled={!enabled} className={`btn ${submitBtnClass}`}
							onClick={this.props.upload}>
						{lang.submit}
					</button>
				</div>
				{this._buildModal()}
			</div>
		);
	},
	_buildModal() {
		let content = (
			<div className="text-center p-4">
				<Loading />
			</div>
		);
		if (!this.state.loading) {
			const modalLang = lang.modal;
			content = (
				<div>
					<p className="font-weight-bold lead">
						{modalLang.success.title}
					</p>
					<span className="text-muted">{modalLang.success.subtitle}</span>
					<div>
						<span className="font-weight-bold">{modalLang.success.label}</span> 7500657464
					</div>
					<div>
						<span className="font-weight-bold">{modalLang.success.labelStatus}</span> In Progress
					</div>
					<div className="text-right">
						<Button color="primary" onClick={this.toggle}>OK</Button>
					</div>
				</div>
			)
		}
		return (
			<Modal isOpen={this.state.modal} toggle={this.toggle} backdropClassName="opacity-20"
				   modalClassName="mt-5 mt-sm-0">
				<ModalBody>
					{content}
				</ModalBody>
			</Modal>
		);
	},

	onDrop (accepted, rejected) {
		if (accepted.length > 0) {
			this.props.setFile(accepted[0]);
		}
		if (rejected.length > 0) {
			this.setState({
				uploadErrorBeforeSubmit: true
			});
		}
	},

	toggle() {
		this.setState({
			modal: !this.state.modal,
			loading: true
		});
		this.timer = setTimeout(() => {
			this.setState({
				loading: false
			});
		}, 2000);
	},
	componentWillUnmount() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

});