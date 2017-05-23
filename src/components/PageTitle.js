import React from 'react';

export default (props) => {
	const bg = props.bg || "bg-faded";
	const animateClass = props.animate ? " animated fadeInDown" : "";
	return (
		<div className={
			`jumbotron
			jumbotron-fluid
			${bg} p-3 mb-0${animateClass}`
		}>
			<div className="container">
				<div className="row">
					<div className="col-6 col-md-4">
						{props.back ? props.back : null}
					</div>
					<div className="col-6 col-md-4 text-right text-md-center lead font-weight-bold">{props.title}</div>
				</div>
			</div>
		</div>
	)
};