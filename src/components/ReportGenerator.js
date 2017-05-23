import React from 'react';
import {Modal, ModalBody} from 'reactstrap';
import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment';
import fileDownload from 'react-file-download';

import Loading from './Loading';
import {Lang, network} from '../shared';

const lang = Lang.reportGenerator;

export default React.createClass({
	getInitialState() {
		return {
			startDate: null,
			formattedStartDateValue: null,
			endDate: null,
			formattedEndDateValue: null,
			isModalOpen: false,
			generating: false,
			generated: false,
			downloading: false,
			disabled: true,
			downloadLink: null
		};
	},

	toggle() {
		this.setState({
			isModalOpen: !this.state.isModalOpen,
			generating: false,
			generated: false,
			downloading: false
		});
	},

	render() {

		const submitBtnClass = this.state.disabled ? "btn-secondary text-muted" : "btn-primary text-white";

		return (
			<div>
				<p className="lead font-weight-bold text-primary">
					{lang.title}
				</p>
				<p>
					{lang.select}
				</p>
				<div className="row">
					<div className="col mb-2">
						<p className="font-weight-bold">{lang.startDate} <span className="text-danger">*</span></p>
						<div className="left-side">
							<DatePicker value={this.state.startDate} maxDate={new Date().toISOString()}
										onChange={(v, f) => this.handleDateChange('start', v, f)}/>
						</div>
					</div>
					<div className="col">
						<p className="font-weight-bold">{lang.endDate} <span className="text-danger">*</span></p>
						<div className="right-side">
							<DatePicker value={this.state.endDate} minDate={this.state.startDate}
										maxDate={new Date().toISOString()}
										onChange={(v, f) => this.handleDateChange('end', v, f)}/>
						</div>
					</div>
				</div>
				<div className="mt-3 text-center">
					<button className={`btn ${submitBtnClass}`} disabled={this.state.disabled}
							onClick={this.generateReport}>
						{lang.btnLabel}
					</button>
				</div>
				{this._buildModal()}
			</div>
		)
	},

	handleDateChange: function (mode, value, formattedValue) {
		let props = {};
		if (mode === 'start') {
			if (this.state.endDate && moment(this.state.endDate).diff(moment(value)) < 0) {
				props = {
					startDate: value,
					formattedStartDateValue: formattedValue,
					endDate: null,
					formattedEndDateValue: null
				};
			}
			else {
				props = {
					startDate: value,
					formattedStartDateValue: formattedValue
				};
			}
		}
		else {
			props = {
				endDate: value,
				formattedEndDateValue: formattedValue
			};
		}
		props.disabled = !((props.startDate && this.state.endDate) || (this.state.startDate && props.endDate));
		this.setState(props);
	},

	_buildModal() {
		let content;
		if (this.state.downloading) {
			content = (
				<div className="py-2">
					<p className="lead font-weight-bold">
						{lang.downloaded.heading}
					</p>
					<p>
						{lang.downloaded.message}
					</p>
					<div className="text-right">
						<button className="btn btn-primary" onClick={this.done}>
							{lang.downloaded.btnLabel}
						</button>
					</div>
				</div>
			);
		}
		else if (this.state.generated) {
			content = (
				<div className="text-center py-4">
					<p className="font-weight-bold lead">{lang.generated}</p>
					<Loading />
				</div>
			);
		}
		else if (this.state.generating) {
			content = (
				<div className="text-center py-4">
					<p className="font-weight-bold lead">{lang.generating}</p>
					<Loading />
				</div>
			);
		}
		return (
			<Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
				<ModalBody>
					{content}
				</ModalBody>
			</Modal>
		)
	},

	getSimpleDate(date) {
		return moment(date).format("MMMDo");
	},

	generateReport() {
		console.log(new Date(this.state.startDate).toISOString(), new Date(this.state.endDate).toISOString());
		this.setState({
			generating: true,
			generated: false,
			isModalOpen: true
		});
		network
			.call("generateReport", {
				start: new Date(this.state.startDate).getTime(),
				end: new Date(this.state.endDate).getTime()
			})
			.then((data) => {
				const {startDate, endDate} = this.state;
				fileDownload(data, `KME-Report-${this.getSimpleDate(startDate)}-${this.getSimpleDate(endDate)}.csv`);
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.setState({
						generated: true,
						generating: false,
					});
					this.timer = setTimeout(() => {
						this.setState({
							downloading: true
						});
					}, 300);
				}, 500);
			});
	},

	done() {
		this.setState({
			isModalOpen: false,
			generating: false,
			generated: false,
			downloading: false
		});
	},

	componentWillUnmount() {
		clearTimeout(this.timer);
	}
});