import React from 'react';

export default (props) => {
	const bg = props.bg || "bg-faded";
	const animateClass = props.animate ? " animated fadeInDown" : "";
	return (
		<div className={
			`jumbotron
			jumbotron-fluid
			text-center ${bg} p-3 mb-0 lead font-weight-bold${animateClass}`
		}>
			{props.title}
		</div>
	)
};