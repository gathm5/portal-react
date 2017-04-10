import _ from 'lodash';
const randomDate = (start, end) => {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomBool = () => {
	if (Math.random() >= 0.5) {
		return 1;
	}
	return 0;
};

const randomLargeNum = () => {
	const multiplier = 1000 * 1000 * 10;
	const multiplier2 = 1000 * 1000 * 100;
	const merge = Math.floor(multiplier + Math.random() * 9 * multiplier).toString() + Math.floor(multiplier2 + Math.random() * 9 * multiplier2).toString();
	return Number(merge);
};

const randomFromRange = (start, end) => {
	return Math.floor(Math.random() * end) + start;
};

const helpers = {
	transactions(n) {
		const status = ["Complete", "In Progress"];
		const types = ["Added", "Deleted"];
		let idStart = 7500657463;
		let rows = [];

		_.times(n, () => {
			const currentStatus = status[randomBool()];
			const currentType = types[randomBool()];
			const date = randomDate(new Date(2017, 2, 1), new Date());
			rows.push({
				id: idStart += 1,
				type: currentType,
				date,
				status: currentStatus
			});
		}, false);
		return rows;
	},
	devices(n) {
		const rows = [];
		const status = ["", "", "RESELLER_DEVICE_ALREADY EXISTS", "", "", "", "RESELLER_DEVICE_INVALID", "", ""];
		const codes = [null, null, null, 4092100, null, 4092106, null, null];
		_.times(n, () => {
			rows.push({
				imei: randomLargeNum(),
				sn: "",
				code: codes[randomFromRange(0, codes.length - 1)],
				detail: status[randomFromRange(0, status.length - 1)]
			});
		}, false);
		return rows;
	}
}, helper = (mode, n) => {
	return helpers[mode](n);
};

export default () => {
	self.addEventListener('message', function (ev) {
		const {mode, count} = ev.data;
		const rows = helper(mode, count);
		self.postMessage(rows);
	});
};