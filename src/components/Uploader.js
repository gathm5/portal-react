import React from 'react';
import Lang from '../shared/Lang';
import {Link} from 'react-router-dom';
import {Button, Modal, ModalBody} from 'reactstrap';
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
			loading: false
		};
	},
	render() {
		const lang = this.state.lang;
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
				<div>
					<label className="btn btn-primary btn-file">
						{lang.btnTitle}
						<input
							type="file"
							hidden
							onChange={(e) => this.setState({file: e.target.value})}
							accept=".csv"
						/>
					</label>
					<span className="ml-3 text-muted">
						{this.state.file}
					</span>
				</div>
				<p className="text-primary">
					{lang.formInfo}
				</p>
				<div className="text-right">
					<Link to={this.props.back} className="btn btn-outline-danger mr-3">
						{lang.cancel}
					</Link>
					<button type="button" className="btn btn-secondary text-muted" onClick={this.toggle}>
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
			<Modal isOpen={this.state.modal} toggle={this.toggle} backdropClassName="opacity-20" modalClassName="mt-5">
				<ModalBody>
					{content}
				</ModalBody>
			</Modal>
		);
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
	componentWillUpdate() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

});