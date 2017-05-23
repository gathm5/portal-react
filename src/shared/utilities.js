import moment from "moment";
import _ from 'lodash';

import settings from "./settings";

const utilities = {
	niceDate(date, replaceFormat) {
		date = date || new Date();
		const format = replaceFormat || settings.dateFormat;
		return moment(date).format(format);
	},
	sortArrayByDate(arr, field, direction = 1) {
		return _.sortBy(arr, (o) => {
			return (-1 * direction) * (new Date(o[field]));
		});
	}
};

export default utilities;