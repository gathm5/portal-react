import React from 'react';
import {Link} from 'react-router-dom';

import {
	ButtonDropdown,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Pagination,
	PaginationItem,
	PaginationLink
} from 'reactstrap';
import FA from 'react-fontawesome';
import _ from 'lodash';

import {Lang, settings, utilities} from '../shared';
import Loading from './Loading';

const lang = Lang.table;

export default React.createClass({
	getInitialState() {
		const config = settings.pagination;
		return {
			filteredRows: null,
			rows: null,
			sorted: null,
			pageGroups: null,
			pageSize: this.props.defaultPageSize || config.defaultPageSize,
			pageNumber: 0,
			hovered: -1,
			dropdownOpen: false,
			viewSizes: config.pageSizes,
			minPageDisplay: config.minPageDisplay,
			searchEnabled: this.props.search,
			loading: true,
			toolTipOpen: false,
			filterDrop: {},
			filterValues: {}
		};
	},

	search() {

	},
	componentWillMount() {
		this.search = _.debounce(this.search, 250);
	},

	componentDidMount() {

		document.addEventListener("List Sorted", this.processList, false);
		this.setState({
			rows: this.props.rows,
			loading: this.props.rows === null
		});
	},


	processList(e) {
		this.setState({
			rows: e.detail
		});
	},

	componentWillReceiveProps(nextProps) {
		if (this.state.rows !== nextProps.rows || this.props.head !== nextProps.head) {
			this.setState({
				rows: nextProps.rows,
				loading: nextProps.rows === null
			});
		}
	},

	sort({type, field, direction}) {
		const createEvent = new window.CustomEvent("Sort List", {
			detail: {
				loading: false,
				arr: this.props.rows,
				type,
				field,
				direction
			}
		});
		document.dispatchEvent(createEvent);
	},

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	},

	closeFilter(which) {
		const filterProp = this.state.filterDrop;
		filterProp[which] = false;
		this.setState({
			filterDrop: filterProp
		});
	},

	toggleFilter(which) {
		const filterProp = this.state.filterDrop;
		filterProp[which] = !this.state.filterDrop[which];
		this.setState({
			filterDrop: filterProp
		});
	},

	clearFilter() {
		this.filters = {};
		this.setState({
			filteredRows: null,
			filterValues: {}
		});
		return true;
	},

	buildPagination(arr) {
		if (arr.length < 2) {
			return null;
		}
		const currentPageNum = this.state.pageNumber, maxDisplayCount = 4;
		let displayCounter = 0;

		const rows = [];

		for (let i = 0; i < arr.length; i += 1) {
			if (i < currentPageNum - 1) {
				if (i === 0) {
					rows.push((
						<PaginationItem key={i}>
							<PaginationLink onClick={() => this.setState({pageNumber: i})}>
								<FA name="angle-double-left" className="text-muted"/>
							</PaginationLink>
						</PaginationItem>
					));
				}
				continue;
			}
			displayCounter += 1;
			if (displayCounter > maxDisplayCount) {
				break;
			}
			if (displayCounter === maxDisplayCount) {
				rows.push((
					<PaginationItem key={i}>
						<PaginationLink onClick={() => this.setState({pageNumber: arr.length - 1})}>
							<FA name="angle-double-right" className="text-muted"/>
						</PaginationLink>
					</PaginationItem>
				));
				continue;
			}
			rows.push((
				<PaginationItem key={i} active={currentPageNum === i}>
					<PaginationLink onClick={() => this.setState({pageNumber: i})}>
						{i + 1}
					</PaginationLink>
				</PaginationItem>
			))
		}

		return (
			<Pagination className="mb-0">
				{rows}
			</Pagination>
		);
	},

	changePageManually(e, arrays) {
		const newPage = Number(e.target.value);
		if (!isNaN(newPage) && newPage > 0 && newPage < arrays.length) {
			console.log(newPage, isNaN(newPage));
			this.setState({
				pageNumber: newPage - 1
			});
		}
		e.preventDefault();
		return false;
	},

	render() {
		let content, pagination, viewSize, pageBox, className = this.props.className || "";
		const contentRows = this.state.filteredRows || this.state.rows;
		if (this.state.loading) {
			content = (
				<tr>
					<td className="py-4 text-center" colSpan={this.props.head.length}>
						<Loading />
					</td>
				</tr>
			);
		}
		else if (contentRows && contentRows.length > 0) {
			let rows = contentRows.slice(0), arrays = [];
			while (rows.length > 0) {
				arrays.push(rows.splice(0, this.state.pageSize));
			}
			if (arrays[this.state.pageNumber]) {
				content = this.renderBody(arrays[this.state.pageNumber]);
			}
			if (contentRows.length >= 10) {
				pagination = (
					<div className="d-inline-block">
						{this.buildPagination(arrays)}
					</div>
				);
				viewSize = (
					<ButtonDropdown className="btn-sm pr-0" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
						<DropdownToggle caret>
							{lang.pagination.dropdown.label} {this.state.pageSize}
						</DropdownToggle>
						<DropdownMenu right>
							<DropdownItem header>{lang.pagination.dropdown.title}</DropdownItem>
							{this.buildViewSizes(this.state.viewSizes)}
						</DropdownMenu>
					</ButtonDropdown>
				)
			}
		}
		else if (contentRows.length === 0) {
			content = (
				<tr>
					<td className="py-4 text-center text-danger lead font-weight-bold"
						colSpan={this.props.head.length}>
						{lang.noRows}
					</td>
				</tr>
			)
		}
		return (
			<div className={`table-responsive relative table-container ${className}`}>
				<div className="row no-gutters align-items-center">
					{this.props.title ? (
						<div className="col-12 col-sm text-center text-sm-left">
							<p className="lead font-weight-bold text-muted mb-1">{this.props.title}</p>
						</div>
					) : null}
					<div className="col-12 col-sm text-center text-sm-right">
						{pagination}
						{pageBox}
						{viewSize}
					</div>
				</div>
				<table className="table table-striped table-bordered mt-1 table-fixed">
					<thead>
					<tr>
						{this.renderHead(this.props.head)}
					</tr>
					</thead>
					<tbody>
					{content}
					</tbody>
				</table>
			</div>
		);
	},

	componentWillUnmount() {
		document.removeEventListener("List Sorted", this.processList, false);
	},

	filterSelect(key, value, isSelected) {
		this.filters = this.filters || {};
		this.filters[key] = this.filters[key] || {};
		this.filters[key][value] = isSelected;
		if (!isSelected) {
			delete this.filters[key][value];
		}
		const filterArr = Object.keys(this.filters[key]);
		const newRows = this.state.rows.filter((row) => {
			if (filterArr.length < 1) {
				return true;
			}
			else {
				for (let i = 0; i < filterArr.length; i += 1) {
					filterArr[i] = parseInt(filterArr[i], 10) || filterArr[i];
					if (filterArr[i] === row[key]) {
						return true;
					}
				}
			}
			return false;
		});
		this.setState({
			filteredRows: newRows
		});
		return true;
	},


	renderHead(head) {
		const {sorted} = this.state;
		const {fieldMap} = this.props;
		return head.map((_, key) => {
			let iconClass = " fa-sort";
			if (sorted && sorted.column === fieldMap[_.name]) {
				sorted.direction > 0 ? iconClass = " fa-sort-desc" : iconClass = " fa-sort-asc";
			}
			let sortIcon = _.sortable ?
				<i style={{marginTop: '2px'}} className={`fa${iconClass} pull-right`}/> : null;

			const cellBg = this.state.filterDrop[fieldMap[_.name]] ? "cell-light-bg" : "bg-primary";

			return (
				<th key={key} className={`text-white align-baseline text-center text-sm-left ${cellBg}`}>
					{_.sortable ? (
						<div className="cursor" onClick={() => this.handlePageClick(_.name, _.sortable)}>
							{_.name}
							{sortIcon}
						</div>
					) : _.filter ? (
						<Dropdown isOpen={this.state.filterDrop[fieldMap[_.name]]}
								  toggle={() => this.toggleFilter(fieldMap[_.name])}>
							<span
								className="cursor d-block"
								onClick={() => this.toggleFilter(fieldMap[_.name])}
								data-toggle="dropdown"
								aria-haspopup="true"

							>
								{_.name}
								<i style={{marginTop: '2px'}} className="fa fa-chevron-down pull-right"/>
							</span>
							<DropdownMenu className="table-filter-dropdown">
								{
									_.filter.map((field, key) => {
										return (
											<div key={key} className="px-2">
												<label>
													<input type="checkbox" checked={!!this.state.filterValues[field]}
														   onClick={(e) => {
															   const value = this.state.filterValues;
															   value[field] = e.target.checked;
															   this.setState(value);
															   this.filterSelect(fieldMap[_.name], field, e.target.checked);
															   this.toggleFilter(fieldMap[_.name]);
														   }}/><span className="ml-2">{field}</span>
												</label>
											</div>
										);
									})
								}
								<DropdownItem divider/>
								<div className="text-center text-primary cursor"
									 onClick={() => this.clearFilter() && this.toggleFilter(fieldMap[_.name])}>Clear
									filter
								</div>
							</DropdownMenu>
						</Dropdown>
					) : (
						<div>
							{_.name}
							{sortIcon}
						</div>
					)}
				</th>
			);
		});
	},

	renderBody(rows) {
		if (!rows || rows.length === 0) {
			return (
				<tr>
					<td colspan={4}>
						{lang.noRows}
					</td>
				</tr>
			);
		}
		const {head, fieldMap, deleteBtn, returnBtn} = this.props, isHoverEnabled = deleteBtn || returnBtn;
		return rows.map((_, key) => {
			return (
				<tr key={key} className={isHoverEnabled ? "holder" : ""}>
					{this.checkAndBuildFields(head, fieldMap, _, key)}
				</tr>
			);
		});
	},

	handlePageClick(field, type, direction = -1) {
		const {sorted} = this.state, fields = this.props.fieldMap;
		if (sorted && sorted.direction) {
			direction *= sorted.direction;
		}
		this.setState({
			sorted: {
				column: fields[field],
				direction
			}
		});
		return this.sort({
			field: fields[field],
			type,
			direction
		});
	},

	buildViewSizes(sizes) {
		return sizes.map((size, key) => {
			return (
				<DropdownItem
					key={key}
					onClick={() => {
						if (this.state.pageSize !== size) {
							this.setState({
								pageSize: size,
								pageNumber: 0
							});
						}
					}}
				>
					{size}
				</DropdownItem>
			)
		});
	},

	checkAndBuildFields(head, fields, row) {
		const isHoverEnabled = (this.props.deleteBtn || this.props.returnBtn);

		let deleteBtn = (
			<div className="btn-tooltip relative d-inline-block pull-right">
				<button type="button" disabled
						className={`btn btn-dark btn-sm show-on-hovered`}
				>
					{lang.buttons.delete}
				</button>
				<span className="btn-tooltip-text arrow_box">This record cannot be deleted</span>
			</div>
		), returnBtn = this.props.doNotShowReturn ? null : (
			<div className="btn-tooltip relative d-inline-block pull-right">
				<button type="button" disabled
						className={`btn btn-dark btn-sm ml-2 show-on-hovered btn-tooltip`}
				>
					{lang.buttons.return}
				</button>
				<span className="btn-tooltip-text">This record cannot be returned</span>
			</div>
		);

		if ((this.props.deleteBtn && !this.props.deleteCondition)
			|| (this.props.deleteCondition && this.props.deleteCondition.key && !!row[this.props.deleteCondition.key])) {
			deleteBtn = (
				<div className="btn-tooltip relative d-inline-block pull-right">
					<button type="button" onClick={() => this.props.deleteBtn(row)}
							className={`btn btn-dark btn-sm show-on-hovered`}
					>
						{lang.buttons.delete}
					</button>
				</div>
			);
		}

		if ((this.props.returnBtn && !this.props.returnCondition)
			|| (this.props.returnCondition && this.props.returnCondition.key && !!row[this.props.returnCondition.key])) {
			returnBtn = (
				<div className="btn-tooltip relative d-inline-block pull-right">
					<button type="button" onClick={() => this.props.returnBtn(row)}
							className={`btn btn-dark btn-sm ml-2 show-on-hovered`}
					>
						{lang.buttons.return}
					</button>
				</div>
			);
		}

		return head.map((_, i) => {
			let btns, innerContent;
			if (i === (head.length - 1) && isHoverEnabled) {
				btns = (
					<div className="col-12 text-left text-lg-right col-lg">
						<div className="d-inline-block">
							{returnBtn}
							{deleteBtn}
						</div>
					</div>
				);
			}
			let link = row[fields[_.name]];
			if (_.link && typeof _.link === 'string') {
				if (_.condition) {
					const conditionOutput = typeof _.condition.value === "object"
						? _.condition.value.indexOf(row[fields[_.condition.key]].toLowerCase()) > -1
						: row[fields[_.condition.key]].toLowerCase() === _.condition.value;

					console.log(row[fields[_.condition.key]].toLowerCase());

					if (conditionOutput) {
						const linkAddress = _.link.indexOf(":id") > -1 ?
							`/${_.link.replace(":id", row[fields[_.name]])}` : `/${_.link}${row[fields[_.name]]}`;

						link = (
							<Link to={linkAddress}>
								{`${row[fields[_.name]]}`}
							</Link>
						);
					}
				}
				else if (!_.condition) {
					const linkAddress = _.link.indexOf(":id") > -1 ?
						`/${_.link.replace(":id", row[fields[_.name]])}` : `/${_.link}${row[fields[_.name]]}`;

					link = (
						<Link to={linkAddress} className="text-primary btn-link cursor">
							{`${row[fields[_.name]]}`}
						</Link>
					);
				}
			}
			else if (_.link && typeof _.link === 'function') {
				if (_.condition && typeof _.condition === "object") {

					const conditionOutput = typeof _.condition.value === "object" ?
						_.condition.value.indexOf(row[fields[_.condition.key]].toLowerCase()) > -1
						: row[fields[_.condition.key]].toLowerCase() === _.condition.value;

					if (conditionOutput) {
						link = (
							<a onClick={() => _.link(row)}
							   className="text-primary btn-link cursor a">{row[fields[_.name]]}</a>
						);
					}
				}
				else if (_.condition && typeof _.condition === "function") {
					const conditionOutput = _.condition(row);
					if (conditionOutput) {
						link = (
							<a onClick={() => _.link(row)}
							   className="text-primary btn-link cursor a">{row[fields[_.name]]}</a>
						);
					}
				}
				else if (!_.condition) {
					link = (
						<a onClick={() => _.link(row)}
						   className="text-primary btn-link cursor a">{row[fields[_.name]]}</a>
					);
				}
			}
			innerContent = (
				<div className="row align-items-center no-gutters">
					<div className="col-12 col-lg">
						{link}
					</div>
					{btns}
				</div>
			);
			if (_.typecast === 'date') {
				innerContent = utilities.niceDate(row[fields[_.name]]);
			}
			return (
				<td key={i}>
					{innerContent}
				</td>
			)
		});
	}
});