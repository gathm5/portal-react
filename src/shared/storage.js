const {sessionStorage, localStorage} = window;
const helpers = {
	get(mode, key) {
		return new Promise((resolve, reject) => {
			let value = mode.getItem(key);
			if (!value) {
				return reject('value not found');
			}
			try {
				value = JSON.parse(value);
			}
			catch (e) {

			}
			return resolve(value);
		});
	},
	set(mode, key, value) {
		return new Promise((resolve) => {
			try {
				value = JSON.stringify(value);
			}
			catch (e) {

			}
			mode.setItem(key, value);
			resolve(value);
		});
	},
	remove(mode, key) {
		return new Promise((resolve, reject) => {
			try {
				mode.clear(key);
				resolve(true);
			}
			catch (e) {
				reject(false);
			}
		});
	}
};

const storage = {
	session: {
		get(key) {
			return helpers.get(sessionStorage, key);
		},
		set(key, value) {
			return helpers.set(sessionStorage, key, value);
		},
		remove(key) {
			return helpers.remove(sessionStorage, key);
		}
	},
	local: {
		get(key) {
			return helpers.get(localStorage, key);
		},
		set(key, value) {
			return helpers.set(localStorage, key, value);
		},
		remove(key) {
			return helpers.remove(localStorage, key);
		}
	}
};

export default storage;