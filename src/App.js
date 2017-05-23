import React, {Component} from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';

import './App.css';
import {
	Login,
	Forgot,
	Batches,
	BatchDetails,
	NewDevice,
	BulkDelete,
	Transactions,
	Customers,
	TransactionDetails,
	CustomerDetails,
	Reporting,
	Admin
} from './containers';
import {session, network, settings} from './shared';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			authenticated: session.isAuthenticated(),
			outOfFocus: false
		};
		this.renderView = this.renderView.bind(this);
	}

	componentWillMount() {
		const {endpoint, alternateEndpoint, useAlternateEndpoint, timeout} = settings.backend;
		network.config(useAlternateEndpoint ? alternateEndpoint : endpoint, timeout);
		if (this.state.authenticated) {
			network.setHeaders(settings.backend.header.name, this.state.authenticated.token);
		}
	}

	componentDidMount() {
		this.authListener = () => {
			const isAuth = !!session.isAuthenticated();
			if (this.state.authenticated !== isAuth) {
				this.setState({
					authenticated: isAuth
				});
			}
		};
		this.watchAuth();
	}


	render() {
		return this.renderView(this.state.authenticated);
	}

	componentWillUnmount() {
		this.removeWatchAuth();
	}


	renderView(isAuth) {
		let home = isAuth ? "dashboard" : "login";
		const supportsHistory = 'pushState' in window.history;
		return (
			<Router forceRefresh={!supportsHistory}>
				<div className="App fill">
					<Switch>
						<Route path="/login" component={Login}/>
						<Redirect exact from="/" to={home}/>
						<Route path="/forgot" component={Forgot}/>
						<PrivateRoute path="/dashboard" component={Batches}/>
						<PrivateRoute path="/batch/:id/customer/:subId" component={BatchDetails}/>
						<PrivateRoute path="/new" component={NewDevice}/>
						<PrivateRoute path="/delete" component={BulkDelete}/>
						<PrivateRoute path="/reporting" component={Reporting}/>
						<PrivateRoute exact path="/transactions/:id" component={Transactions}/>
						<PrivateRoute exact path="/customers/:id" component={Customers}/>
						<PrivateRoute path="/transactions/:id/details" component={TransactionDetails}/>
						<PrivateRoute path="/customers/:id/details" component={CustomerDetails}/>
						<PrivateRoute path="/admin/manage" component={Admin}/>
					</Switch>
				</div>
			</Router>
		);
	}

	watchAuth = () => {
		window.addEventListener("focus", this.authListener, false);
	};

	removeWatchAuth = () => {
		window.removeEventListener("focus", this.authListener, false);
	};
}

const PrivateRoute = ({component, ...rest}) => {
	return (
		<Route {...rest} render={props => (
			session.isAuthenticated() ? (
				React.createElement(component, props)
			) : (
				<Redirect to={{
					pathname: '/login',
					state: {from: props.location}
				}}/>
			)
		)}/>
	);
};


export default App;
