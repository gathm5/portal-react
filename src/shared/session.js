import moment from 'moment';
const Settings = require("../Settings.json");
const expireIn = Settings.session.expiration;
const authKey = 'authentication';

const storage = {
	set(key, value, expiration) {
		let storageValue = {
			value
		};
		if (expiration) {
			storageValue.expires = expiration;
		}
		storageValue = JSON.stringify(storageValue);
		window.sessionStorage.setItem(key, storageValue);
		return true;
	},
	get(key) {
		let storageValue = window.sessionStorage.getItem(key);
		const jsonify = (str) => {
			let value;
			try {
				value = JSON.parse(str);
			}
			catch (e) {
				value = str;
			}
			return value;
		};
		if (!storageValue) {
			return null;
		}
		storageValue = jsonify(storageValue);
		if (!storageValue.expires) {
			return storageValue.value;
		}
		let now = new Date(),
			then = storageValue.expires,
			diff = moment(then).diff(moment(now));
		if (diff < 0) {
			this.remove(authKey);
			return null;
		}
		return storageValue.value;
	},
	remove(key) {
		window.sessionStorage.removeItem(key);
	}
};
const session = {
	isAuthenticated() {
		return !!storage.get(authKey);
	},
	authenticate({email, password}) {
		let date = new Date();
		date.setTime(date.getTime() + expireIn);
		storage.set(authKey, {
			email,
			password
		}, date);
		this.authenticated = true;
	},
	logout() {
		storage.remove(authKey);
		this.authenticated = false;
	}
};

export default session;