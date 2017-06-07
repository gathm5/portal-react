import React from 'react';
import FA from 'react-fontawesome';

import {session, Lang, network, settings} from '../shared';
import {Loading} from '../components';

const lang = Lang.activate;

export default React.createClass({
	getInitialState() {
		const user = session.isAuthenticated().user;
		return {
			user,
			oldPassword: "",
			newPassword: "",
			retypePassword: "",
			passwordError: false,
			error: null,
			loading: false,
			validationKeys: [],
			invalidKeys: [0, 1, 2, 3]
		};
	},
	render() {
		return (
			<div className="login fill container overflow-hidden">
				<div className="row fill align-items-sm-center">
					<div className="col-sm-10 col-md-8 col-lg-6 offset-sm-1 offset-md-2 offset-lg-3 mt-4 mt-sm-0">
						<div
							className="jumbotron drop-shadow-dark p-4 animated fadeInRight">
							{!this.state.loading ? (
								<div className={`animated ${this.state.block ? "fadeOut" : ""}`}>
									<h2 className="lead font-weight-bold pb-2">
										{lang.title}
									</h2>
									<form onSubmit={this.onSubmit}>
										<div className={`form-group${this.state.passwordError ? ' has-danger' : ''}`}>
											<input type="password" placeholder={lang.old}
												   className="form-control"
												   value={this.state.oldPassword}
												   name="oldPassword"
												   onChange={this.handleKey}
											/>
										</div>
										<div className={`form-group${this.state.passwordError ? ' has-danger' : ''}`}>
											<input type="password" placeholder={lang.new}
												   className="form-control"
												   value={this.state.newPassword}
												   name="newPassword"
												   onChange={this.handleKey}
											/>
										</div>
										<div className={`form-group${this.state.passwordError ? ' has-danger' : ''}`}>
											<input type="password" placeholder={lang.confirm}
												   className="form-control"
												   value={this.state.retypePassword}
												   name="retypePassword"
												   onChange={this.handleKey}
											/>
										</div>
										<div className="text-right">
											<button type="submit" disabled={this.state.block}
													className="btn btn-primary">
												{lang.button}
											</button>
										</div>
										{
											this.state.error ? (
												<div className="text-danger text-center small">
													{this.state.error}
												</div>
											) : null
										}
										<div className="instructions">
											<p className="lead text-primary">
												Password Instructions:
											</p>
											{
												[
													"Password fields cannot be empty",
													"Retype password should match the New password",
													"New Password should be of 8 characters minimum",
													"New Password should contain at least 1 Uppercase, 1 lowercase, 1 number and 1 Special character"
												].map((_, key) => (
														<p className="p-0 m-0" key={key}>
															{
																this.state.invalidKeys.indexOf(key) > -1 ? (
																	<FA name="chevron-right" className="text-primary mr-2"/>
																) : (
																	<FA name="chevron-right" className="text-primary mr-2"/>
																)
															}
															<small>{_}</small>
														</p>
													)
												)
											}
										</div>
									</form>
								</div>
							) : (
								<div className="text-center">
									<p className="lead mb-2">
										{Lang.login.processing}
									</p>
									<Loading />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		)
	},
	isPasswordStrong(password, strength = "medium") {
		const control = {
			strong: "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,14}$", // Upper case, Lower case, speacial char, atleast 8 chars
			medium: "^(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,14}$", // Upper Case, Lower Case, Number, Atleast 8 chars
			light: "^[A-Za-z]w{6,}$" // Atleast 6 chars
		};
		return new RegExp(control[strength]).test(password);
	},
	validateFields() {
		const invalidKeys = [];
		switch (true) {
			case !this.state.oldPassword || !this.state.newPassword || !this.state.retypePassword:
				invalidKeys.push(0);
				break;
			case this.state.newPassword !== this.state.retypePassword:
				invalidKeys.push(1);
				break;
			case !this.isPasswordStrong(this.state.newPassword, settings.password.strength):
				invalidKeys.push(3);
				break;
			default:
		}
		this.setState({
			invalidKeys
		});
	},
	handleKey(e) {
		const {name, value} = e.target;
		this.setState({
			[name]: value
		});
		setTimeout(this.validateFields);
	},
	onSubmit(e) {
		e.preventDefault();

		if (this.state.invalidKeys.length !== 0) {
			return;
		}

		this.setState({
			loading: true
		});

		network
			.call("activateProfile", {
				email: this.state.user.email,
				oldPassword: this.state.oldPassword,
				newPassword: this.state.newPassword
			})
			.then(({data}) => {
				if (data.success) {
					session.updateUser(data.user);
					this.props.history.replace("/dashboard");
				}
				else {
					this.setState({
						error: data.message,
						loading: false
					});
				}
			});

	},
	componentWillUnmount() {
		clearTimeout(this.timer);
	}
});