import React from 'react';
import {Header} from '../components';

export default React.createClass({
	getInitialState() {
		return {
			header: {
				logo: true,
				title: null
			}
		};
	},

	render() {
		return (
			<div className="App fill">
				<Header logo={this.state.logo} title={this.state.title}/>
				{this.props.children}
			</div>
		);
	}
})