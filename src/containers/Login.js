import React from 'react';
import {Link} from 'react-router-dom';

import Lang from '../shared/Lang';
import session from '../shared/session';
import {Loading} from '../components';

export default React.createClass({
	getInitialState() {
		return {
			redirectToHome: false,
			email: '',
			password: '',
			emailError: false,
			passwordError: false,
			error: null,
			loading: false,
			block: false,
			blocked: false
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
									<h2 className="lead font-weight-bold">
										{Lang.title}
									</h2>
									<form onSubmit={this.onSubmit}>
										<div className={`form-group${this.state.emailError ? ' has-danger' : ''}`}>
											<input type="email" required placeholder="Email address"
												   className="form-control"
												   value={this.state.email}
												   onChange={(e) => this.setState({email: e.target.value})}
												   onInvalid={() => this.setState({emailError: true})}
												   onBlur={() => this.setState({emailError: false})}
											/>
										</div>
										<div className={`form-group${this.state.passwordError ? ' has-danger' : ''}`}>
											<input type="password" required placeholder="Password"
												   className="form-control"
												   value={this.state.password}
												   onChange={(e) => this.setState({password: e.target.value})}
												   onInvalid={() => this.setState({passwordError: true})}
												   onBlur={() => this.setState({passwordError: false})}
											/>
										</div>
										<div className="row align-items-center">
											<div className="col-8">
												<Link to="/forgot">{Lang.login.forgot}</Link>
											</div>
											<div className="col-4 text-right">
												<button type="submit" disabled={this.state.block}
														className="btn btn-primary">
													{Lang.login.signIn}
												</button>
											</div>
										</div>
										{
											this.state.error ? (
												<div className="text-danger text-center small">
													{this.state.error}
												</div>
											) : null
										}
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
	onSubmit(e) {
		e.preventDefault();
		const {email, password} = this.state;
		this.setState({
			block: true,
			loading: true
		});

		session
			.authenticate({
				email,
				password
			})
			.then(
				() => this.props.history.replace("/dashboard"),
				(error) => {
					console.log(error);
					if (typeof error === "object") {
						error = "Some error occurred while connecting to the server"
					}
					this.setState({
						error,
						block: false,
						loading: false
					})
				}
			)
			.catch((error) => {
				this.setState({
					error,
					block: false,
					loading: false
				});
			});
	},
	componentWillUnmount() {
		clearTimeout(this.timer);
	}
});