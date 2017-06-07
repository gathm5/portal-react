import React from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalBody} from 'reactstrap';
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
			downloadLink: null,
			selected: this.props.defaultOption || lang.dropdown.defaultOption,
			dropdownOpen: false,
			error: null
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
				<p className="mb-2">
					{lang.dropdown.title}
				</p>
				<Dropdown isOpen={this.state.dropdownOpen}
						  toggle={() => this.setState({dropdownOpen: !this.state.dropdownOpen})} tether>
					<DropdownToggle caret>
						{this.state.selected}
					</DropdownToggle>
					<DropdownMenu>
						{this._buildDrops()}
					</DropdownMenu>
				</Dropdown>
				<p className="mt-4 mb-2">
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

	_buildDrops() {
		return lang.dropdown.options.map((_, key) => {
			return (
				<DropdownItem onClick={() => this.setState({selected: _})} key={key}>
					{_}
				</DropdownItem>
			);
		});
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
		if (this.state.error) {
			content = (
				<p className="lead font-weight-bold">
					{this.state.error}
				</p>
			)
		}
		else if (this.state.downloading) {
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
		this.setState({
			generating: true,
			generated: false,
			isModalOpen: true
		});

		const mode = {
			"Devices": "devicesReport",
			"Device Errors": "deviceErrorsReport",
			"Pre-processing Errors": "bouncedReport"
		};

		network
			.call(mode[this.state.selected], {
				start: new Date(this.state.startDate).getTime(),
				end: new Date(this.state.endDate).getTime()
			})
			.then((data) => {
				if (typeof data !== "string" && !data.success) {
					this.setState({
						error: data.message,
						generated: false,
						generating: false
					});
				}
				const {startDate, endDate} = this.state;
				fileDownload(data, `KME-${this.state.selected.replace(/\s/g, "-")}-Report-${this.getSimpleDate(startDate)}-${this.getSimpleDate(endDate)}.csv`);
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