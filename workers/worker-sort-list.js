// Merge Sort
var helpers = {
	sort: function (arr, prop, type, direction) {
		if (arr.length < 2)
			return arr;

		var middle = parseInt(arr.length / 2, 10);
		var left = arr.slice(0, middle);
		var right = arr.slice(middle, arr.length);

		return this.merge(this.sort(left, prop, type, direction), this.sort(right, prop, type, direction), prop, type, direction);
	},

	merge: function (left, right, prop, type, direction) {
		var result = [];

		while (left.length && right.length) {
			var leftItem = left[0][prop], rightItem = right[0][prop];
			switch (type) {
				case 'number':
					leftItem = Number(left[0][prop]);
					rightItem = Number(right[0][prop]);
					break;
				case 'date':
					leftItem = new Date(left[0][prop]).getTime();
					rightItem = new Date(right[0][prop]).getTime();
					break;
				default:
			}
			if ((direction < 0 && leftItem <= rightItem) || (direction > 0 && leftItem > rightItem)) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}

		while (left.length)
			result.push(left.shift());

		while (right.length)
			result.push(right.shift());

		return result;
	}
};
var normalSort = function (arr, field, direction) {
	return arr.sort(function (a, b) {
		if (a[field] < b[field]) {
			return 1 * direction;
		}
		if (a[field] > b[field]) {
			return -1 * direction;
		}
		return 0;
	});
};

var timer;
self.addEventListener('message', function (ev) {
	clearTimeout(timer);
	var that = self;
	timer = setTimeout(function () {
		var arr = ev.data.arr,
			field = ev.data.field,
			type = ev.data.type,
			direction = ev.data.direction;
		switch (type) {
			case 'number':
				that.postMessage(helpers.sort(arr, field, type, direction));
				break;
			case 'date':
				that.postMessage(helpers.sort(arr, field, type, direction));
				break;
			default:
				that.postMessage(normalSort(arr, field, direction));
		}
	}, 0);
});