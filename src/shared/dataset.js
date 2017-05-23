import network from './network';
import settings from './settings';

const cache = {};

const dataset = {
	get(mode, scope) {
		console.log(network, settings, cache, mode, scope);
	}
};

export default dataset;