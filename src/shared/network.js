import axios from 'axios';

export default () => {
	const config = {};
	return {
		configure(props) {
			config.props = props;
			console.log(axios);
		}
	}
}