var createWorker = new Worker('/static/js/workers/create-list.min.js'),
	sortWorker = new Worker("/static/js/workers/sort-list.min.js"),
	errorWorker = new Worker("/static/js/workers/error-check-list.min.js");

// Create List
createWorker.addEventListener('message', function (e) {
	document.dispatchEvent(new CustomEvent("List Created", {
		detail: e.data
	}));
}, false);
document.addEventListener('Create List', function (e) {
	createWorker.postMessage(e.detail);
}, false);


// Sort List
sortWorker.addEventListener('message', function (e) {
	document.dispatchEvent(new CustomEvent("List Sorted", {
		detail: e.data
	}));
}, false);
document.addEventListener('Sort List', function (e) {
	sortWorker.postMessage(e.detail);
}, false);

// Error Check List
errorWorker.addEventListener('message', function (e) {
	document.dispatchEvent(new CustomEvent("Error Checked List", {
		detail: e.data
	}));
}, false);
document.addEventListener('List Error Check', function (e) {
	errorWorker.postMessage(e.detail);
}, false);