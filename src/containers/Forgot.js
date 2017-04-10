import React from 'react';

export default React.createClass({
	render() {
		return (
			<div className="login fill container overflow-hidden">
				<div className="row fill align-items-sm-center">
					<div className="col-sm-10 col-md-8 col-lg-6 offset-sm-1 offset-md-2 offset-lg-3 mt-4 mt-sm-0">
						<div className="jumbotron drop-shadow p-4">
							<h2 className="lead font-weight-bold">
								Knox Mobile Enrollment for AT&T
							</h2>
							<form onSubmit={this.onSubmit}>
								<div className="form-group">
									<input type="email" placeholder="Email address" className="form-control"/>
								</div>
								<div className="row align-items-center">
									<div className="col-4 offset-8 text-right">
										<button className="btn btn-primary" type="submit">Reset</button>
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
	}
});