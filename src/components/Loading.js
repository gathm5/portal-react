import React from 'react';
import {
	FadingCircle
} from 'better-react-spinkit';

export default (props) => {
	const {size = 100, color = "#007AC2"} = props;
	return (
		<FadingCircle size={size} color={color} className="d-inline-block" />
	)
};