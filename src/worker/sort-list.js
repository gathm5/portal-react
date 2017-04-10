// Merge Sort
const helpers = {
	sort(arr, prop, type, direction) {
		if (arr.length < 2)
			return arr;

		const middle = parseInt(arr.length / 2, 10);
		const left = arr.slice(0, middle);
		const right = arr.slice(middle, arr.length);

		return this.merge(this.sort(left, prop, type, direction), this.sort(right, prop, type, direction), prop, type, direction);
	},

	merge (left, right, prop, type, direction) {
		let result = [];

		while (left.length && right.length) {
			let leftItem = left[0][prop], rightItem = right[0][prop];
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
const normalSort = (arr, field, direction) => {
	return arr.sort((a, b) => {
		if (a[field] < b[field]) {
			return 1 * direction;
		}
		if (a[field] > b[field]) {
			return -1 * direction;
		}
		return 0;
	});
};

let timer;
export default () => {
	self.addEventListener('message', (ev) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const {
				arr,
				field,
				type,
				direction = 1
			} = ev.data;
			switch (type) {
				case 'number':
					self.postMessage(helpers.sort(arr, field, type, direction));
					break;
				case 'date':
					self.postMessage(helpers.sort(arr, field, type, direction));
					break;
				default:
					self.postMessage(normalSort(arr, field, direction));
			}
		}, 0);
	});
};