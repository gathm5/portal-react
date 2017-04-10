import React, {Component} from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';
import './App.css';
import {Login, Forgot, Dashboard, NewDevice, BulkDelete, Transactions, Devices, Admin} from './containers';
import session from './shared/session';
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			authenticated: !!session.isAuthenticated(),
			outOfFocus: false
		};
		this.renderView = this.renderView.bind(this);
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
		let home;
		isAuth ? home = 'dashboard' : home = 'login';

		return (
			<Router>
				<div className="App fill">
					<Switch>
						<Route path="/login" component={Login}/>
						<Redirect exact from="/" to={home}/>
						<Route path="/forgot" component={Forgot}/>
						<PrivateRoute path="/dashboard" component={Dashboard}/>
						<PrivateRoute path="/new" component={NewDevice}/>
						<PrivateRoute path="/delete" component={BulkDelete}/>
						<PrivateRoute path={`/transactions/:id?`} component={Transactions}/>
						<PrivateRoute path={`/devices/:id?`} component={Devices}/>
						<PrivateRoute path="/admin/manage" component={Admin}/>
					</Switch>
				</div>
			</Router>
		)
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
