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
	},
	clear(mode) {
		mode.clear();
	}
};

const fns = (type) => {
	return {
		get(key) {
			return helpers.get(type, key);
		},
		set(key, value) {
			return helpers.set(type, key, value);
		},
		remove(key) {
			return helpers.remove(type, key);
		},
		clear() {
			return helpers.clear(type);
		}
	};
};

const storage = {
	session: fns(sessionStorage),
	local: fns(localStorage)
};

export default storage;