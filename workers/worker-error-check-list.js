var timer;

function containsObject(obj, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
			return true;
		}
	}
	return false;
}

self.addEventListener('message', function (ev) {
	clearTimeout(timer);
	var that = self;
	timer = setTimeout(function () {

		var arr = ev.data.arr,
			fields = ev.data.fields,
			errorGroups = [],
			errorCount = 0;

		for (var i = 0; i < arr.length; i += 1) {
			var errObj = {};
			var testObj = null;
			if (arr[i][fields[0]]) {
				var testObj = {};
				testObj[fields[0]] = arr[i][fields[0]];
				testObj[fields[1]] = arr[i][fields[1]];
				errorCount += 1;
			}
			if (testObj && !containsObject(testObj, errorGroups)) {
				errorGroups.push(testObj);
			}
		}

		that.postMessage({
			errorCount: errorCount,
			errorGroups: errorGroups
		});

	}, 0);
});