var randomDate = function (start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

var randomBool = function () {
	if (Math.random() >= 0.5) {
		return 1;
	}
	return 0;
};

var randomLargeNum = function () {
	var multiplier = 1000 * 1000 * 10;
	var multiplier2 = 1000 * 1000 * 100;
	var merge = Math.floor(multiplier + Math.random() * 9 * multiplier).toString() + Math.floor(multiplier2 + Math.random() * 9 * multiplier2).toString();
	return Number(merge);
};

var randomFromRange = function (start, end) {
	return Math.floor(Math.random() * end) + start;
};

var _ = {
	times: function (n, fn) {
		for (var i = 0; i < n; i += 1) {
			fn(i);
		}
	}
};

var helpers = {
	transactions: function (n) {
		var status = ["Complete", "In Progress"];
		var types = ["Added", "Deleted"];
		var idStart = 7500657463;
		var rows = [];

		_.times(n, function () {
			var currentStatus = status[randomBool()];
			var currentType = types[randomBool()];
			var date = randomDate(new Date(2017, 2, 1), new Date());
			rows.push({
				id: idStart += 1,
				type: currentType,
				date: date,
				status: currentStatus
			});
		});
		return rows;
	},
	devices: function (n) {
		var rows = [];
		var status = ["", "", "RESELLER_DEVICE_ALREADY EXISTS", "", "", "", "RESELLER_DEVICE_INVALID", "", ""];
		var codes = [null, null, null, 4092100, null, 4092106, null, null];
		_.times(n, function () {
			rows.push({
				imei: randomLargeNum(),
				sn: "",
				code: codes[randomFromRange(0, codes.length - 1)],
				detail: status[randomFromRange(0, status.length - 1)]
			});
		});
		return rows;
	},
	batches: function (n) {
		var rows = [];
		var types = ["Added", "Deleted"];
		var codes = "ABCD".split("");
		var startNum = 100;
		_.times(n, function () {
			var date = randomDate(new Date(2017, 2, 1), new Date());
			var currentType = types[randomBool()];
			rows.push({
				id: codes[randomFromRange(0, codes.length - 1)] + (startNum += 1),
				type: currentType,
				date: date
			});
		});
		return rows;
	}
};

var helper = function (mode, n) {
	return helpers[mode](n);
};
self.addEventListener('message', function (e) {
	// Send the message back.
	var rows = helper(e.data.mode, e.data.count);
	self.postMessage(rows);
}, false);