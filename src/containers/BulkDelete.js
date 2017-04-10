import React from 'react';
import {Header, Uploader, PageTitle} from '../components';

import Lang from '../shared/Lang';

export default React.createClass({
	render() {
		return (
			<div className="new-device pb-4">
				<Header logo animate/>
				<PageTitle title={Lang.bulkDelete.title} animate/>
				<div className="container bg-white py-5">
					<div className="row">
						<div className="col-md-6 offset-md-3">
							<Uploader back="/dashboard" delete/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});