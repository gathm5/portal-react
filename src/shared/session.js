import moment from 'moment';
import Network from './network';
const settings = require("./settings");
const expireIn = settings.session.expiration;
const authKey = `${settings.storage.prefix}authentication`;

const authStorage = {
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
	},
	clear() {
		window.sessionStorage.clear();
	}
};

const login = (data, resolve, that) => {
	const expires = (data.expires) ? new Date(data.expires) : new Date().getTime() + expireIn;
	authStorage.set(authKey, {
		user: data.user,
		token: data.token,
		expires: data.expires
	}, expires);
	that.authenticated = true;
	Network.setHeaders(settings.backend.header.name, data.token);
	resolve();
};

/*const expireTime = (() => {
 let date = new Date();
 date.setHours(date.getHours() + 3);
 return date;
 })();
 const fallbackData = {
 user: {
 name: "Gautham Stalin",
 email: "gstalin@samsung.com"
 },
 token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OGVmZjVmMWM1MzllYzQwMTk1MjU4NjkiLCJuYW1lIjoiR2F1dGhhbSBTdGFsaW4iLCJlbWFpbCI6Imcuc3RhbGluQHNlYS5zYW1zdW5nLmNvbSIsImRldmljZXMiOltdLCJhZG1pbiI6dHJ1ZX0.RE9LkJgMpmTR2dgvUNhpbSDs0dOfWlic7kWYCrUun7c",
 expires: expireTime
 };*/

const session = {
	isAuthenticated() {
		const authData = authStorage.get(authKey);
		if (authData) {
			Network.setHeaders(settings.backend.header.name, authData.token)
		}
		return authData;
	},
	authenticate({email, password}) {
		return new Promise((resolve, reject) => {
			const authPath = `${settings.backend.endpoint}${settings.backend.preAuth.authenticate.endpoint}`;
			const method = settings.backend.preAuth.authenticate.method;
			Network[method](
				authPath, {
					email,
					password
				}
			).then(({data}) => {
				if (data.success) {
					return login(data, resolve, this);
				}
				else {
					reject(data.message);
				}
			}).catch((error) => {
				reject(error);
			});
		});
	},
	logout() {
		authStorage.remove(authKey);
		authStorage.clear();
		this.authenticated = false;
	}
};

export default session;