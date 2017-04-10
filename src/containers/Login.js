import React from 'react';
import {Link, Redirect} from 'react-router-dom';

import Lang from '../shared/Lang';
import session from '../shared/session';

export default React.createClass({
	getInitialState() {
		return {
			redirectToHome: false,
			email: '',
			password: '',
			emailError: false,
			passwordError: false
		};
	},
	render() {
		if (this.state.redirectToHome) {
			return (
				<Redirect to="/dashboard"/>
			);
		}
		return (
			<div className="login fill container overflow-hidden animated fadeInUp">
				<div className="row fill align-items-sm-center">
					<div className="col-sm-10 col-md-8 col-lg-6 offset-sm-1 offset-md-2 offset-lg-3 mt-4 mt-sm-0">
						<div className="jumbotron drop-shadow p-4">
							<h2 className="lead font-weight-bold">
								{Lang.title}
							</h2>
							<form onSubmit={this.onSubmit}>
								<div className={`form-group${this.state.emailError ? ' has-danger' : ''}`}>
									<input type="email" required placeholder="Email address" className="form-control"
										   value={this.state.email}
										   onChange={(e) => this.setState({email: e.target.value})}
										   onInvalid={() => this.setState({emailError: true})}
										   onBlur={() => this.setState({emailError: false})}
									/>
								</div>
								<div className={`form-group${this.state.passwordError ? ' has-danger' : ''}`}>
									<input type="password" required placeholder="Password" className="form-control"
										   value={this.state.password}
										   onChange={(e) => this.setState({password: e.target.value})}
										   onInvalid={() => this.setState({passwordError: true})}
										   onBlur={() => this.setState({passwordError: false})}
									/>
								</div>
								<div className="row align-items-center">
									<div className="col-8">
										<Link to="/forgot">Forgot password?</Link>
									</div>
									<div className="col-4 text-right">
										<button type="submit" className="btn btn-primary">Sign in</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	},
	onSubmit(e) {
		e.preventDefault();
		const {email, password} = this.state;
		session.authenticate({
			email,
			password
		});
		this.setState({
			redirectToHome: true
		});
	}
});