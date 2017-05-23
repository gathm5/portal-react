import axios from 'axios';
import settings from './settings';
import storage from './storage';
import Lang from './Lang';

const isLocal = settings.backend.localhost,
	suffix = settings.backend.forceFiles ? settings.backend.endpointSuffix : "";
const storagePrefix = settings.storage.prefix, storageKey = `${storagePrefix}cache`;

let instance;
let cacheReadyToRead = false;
storage.session.get(storageKey).then(() => {
	cacheReadyToRead = true;
}, () => {
	cacheReadyToRead = true;
});

const cacheHelpers = {
	get(key) {
		return storage.session.get(`${storageKey}${key}`);
	},
	set(key, payload) {
		storage.session.set(`${storageKey}${key}`, payload);
	}
};

const clearCache = () => {
	storage.session.get(`${storagePrefix}authentication`).then(data => {
		if (data) {
			storage.session.clear();
			storage.session.set(`${storagePrefix}authentication`, data);
		}
	}, () => {
	});
};

const network = {
	config(baseURL, timeout) {
		baseURL = isLocal ? "" : baseURL;
		instance = axios.create({
			baseURL,
			timeout
		});
		instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	},
	setHeaders(access, token) {
		instance && (instance.defaults.headers.common[access] = token);
		clearInterval(this.cacheTimer);
		this.cacheTimer = setInterval(clearCache, 1000 * 60 * 5);
	},
	call(category, params, config) {
		const TEMP_BLOCK = 200;
		const setup = settings.backend.postAuth[category];
		const prefix = settings.backend.underDevelopment && setup.isDev ? settings.backend.devApi : settings.backend.api;
		const mapParams = (endpoint, params) => {
			setup.param.map((param) => {
				return endpoint = endpoint.replace(param, params[param.replace(":", "")]);
			});
			return endpoint;
		};
		let endpoint = setup.endpoint, timeout;
		if (setup.param && params && !suffix) {
			endpoint = (typeof params === "string") ?
				endpoint.replace(setup.param, params) : mapParams(endpoint, params)
		}
		else if (setup.param && params && suffix) {
			endpoint = endpoint.replace(`/${setup.param}`, "");
		}

		const callEndpoint = `${prefix}${endpoint}${suffix}`;
		if (setup.cache && cacheReadyToRead) {
			return new Promise((resolve, reject) => {
				cacheHelpers.get(callEndpoint).then((data) => {
					resolve(data);
				}, () => {
					clearTimeout(timeout);
					timeout = setTimeout(() => {
						this[setup.method](callEndpoint, params, config, setup.cache)
							.then(data => resolve(data), error => reject(error));
					}, TEMP_BLOCK);
				});
			});
		}

		return this[setup.method](callEndpoint, params, config, setup.cache);
	},
	get(endpoint, params, config, setCache) {
		return instance.get(endpoint, params, config).then(({data}) => {
			if (setCache) {
				cacheHelpers.set(endpoint, data);
			}
			return new Promise(resolve => resolve(data));
		}).catch(() => {
			return new Promise((resolve, reject) => reject(Lang.errors.network));
		});
	},
	post(endpoint, params, config) {
		return new Promise((resolve, reject) => {
			instance.post(`${endpoint}`, params, config)
				.then(data => {
					clearCache();
					resolve(data);
				}, error => {
					reject(error);
				})
				.catch(error => reject(error));
		});
	},
	update(endpoint, params, config) {
		return instance.put(`${endpoint}`, params, config);
	},
	delete() {

	}
};
export default network;