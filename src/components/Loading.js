import React from 'react';
import {
	FadingCircle
} from 'better-react-spinkit';

import {settings} from '../shared';

export default (props) => {
	const {size = settings.loader.size, color = "#007AC2"} = props;
	return (
		<FadingCircle size={size} color={color} className="d-inline-block" />
	)
};