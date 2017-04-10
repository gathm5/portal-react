import React from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import Work from 'webworkify-webpack';
import {
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Pagination,
	PaginationItem,
	PaginationLink
} from 'reactstrap';
import FA from 'react-fontawesome';

import {Lang, Configuration} from '../shared';

export default React.createClass({
	getInitialState() {
		const config = Configuration.pagination;
		return {
			rows: null,
			sorted: null,
			pageGroups: null,
			pageSize: config.defaultPageSize,
			pageNumber: 0,
			hovered: -1,
			dropdownOpen: false,
			viewSizes: config.pageSizes,
			minPageDisplay: config.minPageDisplay
		};
	},

	componentDidMount() {
		this.worker = Work(require.resolve('../worker/sort-list'));

		this.worker.addEventListener('message', (event) => {
			this.setState({
				rows: event.data
			});
		}, false);

		if (this.props.defaultSort) {
			this.sort({
				type: "number",
				field: "id",
				direction: -1
			});
		}
		else {
			this.setState({
				rows: this.props.rows
			});
		}
	},

	sort({type, field, direction}) {
		this.worker.postMessage({
			arr: this.props.rows,
			type,
			field,
			direction
		});
	},

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
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

	render() {
		let content, pagination, viewSize;
		if (this.state.rows) {
			let rows = this.state.rows.slice(0), arrays = [];
			while (rows.length > 0) {
				arrays.push(rows.splice(0, this.state.pageSize));
			}
			if (arrays[this.state.pageNumber]) {
				content = this.renderBody(arrays[this.state.pageNumber]);
			}
			if (this.state.rows.length >= 10) {
				pagination = (
					<div className="d-inline-block">
						{this.buildPagination(arrays)}
					</div>
				);
				viewSize = (
					<ButtonDropdown className="btn-sm pr-0" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
						<DropdownToggle caret>
							{Lang.table.pagination.dropdown.label} {this.state.pageSize}
						</DropdownToggle>
						<DropdownMenu right>
							<DropdownItem header>{Lang.table.pagination.dropdown.title}</DropdownItem>
							{this.buildViewSizes(this.state.viewSizes)}
						</DropdownMenu>
					</ButtonDropdown>
				)
			}
		}
		return (
			<div className="table-responsive relative table-container">
				<div className="row no-gutters align-items-center">
					{this.props.title ? (
						<div className="col-12 col-sm text-center text-sm-left">
							<p className="lead font-weight-bold text-muted mb-1">{this.props.title}</p>
						</div>
					) : null}
					<div className="col-12 col-sm text-center text-sm-right">
						{pagination}
						{viewSize}
					</div>
				</div>
				<table className="table table-striped table-bordered mt-1">
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

	renderHead(head) {
		const {sorted} = this.state;
		const {fieldMap} = this.props;
		return head.map((_, key) => {
			let iconClass = " fa-sort";
			//console.log(sorted);
			console.log("sorted executed!", fieldMap[_.name]);
			if (sorted && sorted.column === fieldMap[_.name]) {
				sorted.direction > 0 ? iconClass = " fa-sort-desc" : iconClass = " fa-sort-asc";
			}
			let sortIcon = _.sortable ?
				<i style={{marginTop: '2px'}} className={`fa${iconClass} pull-right`} aria-hidden="true"/> : null;
			return (
				<th key={key} className="bg-primary text-white align-baseline text-center text-sm-left">
					{_.sortable ? (
						<div className="cursor" onClick={() => this.handlePageClick(_.name, _.sortable)}>
							{_.name}
							{sortIcon}
						</div>
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
						{Lang.table.noRows}
					</td>
				</tr>
			);
		}
		const {head, fieldMap, deleteBtn, returnBtn} = this.props, isHoverEnabled = deleteBtn || returnBtn;

		return rows.map((_, key) => {

			this.checkAndBuildFields(head, fieldMap, _, key);

			return (
				<tr key={key} onMouseEnter={() => isHoverEnabled && this.setState({hovered: key})}>
					{this.checkAndBuildFields(head, fieldMap, _, key)}
				</tr>
			);
		});
	},

	handlePageClick(field, type) {
		const {sorted} = this.state, fields = this.props.fieldMap;
		let direction = -1;
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
					onClick={() => this.setState({pageSize: size})}
				>
					{size}
				</DropdownItem>
			)
		});
	},

	checkAndBuildFields(head, fields, row, key) {
		const isHoverEnabled = (this.props.deleteBtn || this.props.returnBtn);
		let visibility;

		this.state.hovered === key ? visibility = "" : visibility = " invisible";

		const deleteBtn = (this.props.deleteBtn ? (
			<div onClick={this.props.deleteBtn}
				 className={`btn btn-danger btn-sm pull-right${visibility}`}
			>
				delete
			</div>
		) : null);
		const returnBtn = (this.props.returnBtn ? (
			<div onClick={this.props.returnBtn}
				 className={`btn btn-danger btn-sm ml-2 pull-right${visibility}`}
			>
				return
			</div>
		) : null);

		return head.map((_, i) => {
			let btns, innerContent = row[fields[_.name]];
			if (i === 0 && isHoverEnabled) {
				btns = (
					<div className="col-12 text-left text-lg-right col-lg">
						<div className="d-inline-block">
							{returnBtn}
							{deleteBtn}
						</div>
					</div>
				);
			}
			if (i === 0) {
				let link = row[fields[_.name]];
				if (_.link && _.condition && row[_.condition.key] === _.condition.value) {
					link = (
						<Link to={`/${_.link}${row[fields[_.name]]}`}>
							{`${row[fields[_.name]]}`}
						</Link>
					);
				}
				innerContent = (
					<div className="row no-gutters">
						<div className="col-12 col-lg">
							{link}
						</div>
						{btns}
					</div>
				)
			}
			if (_.typecast === 'date') {
				innerContent = moment(row[fields[_.name]]).format(" YYYY-MM-DD h:mm a");
			}
			return (
				<td key={i}>
					{innerContent}
				</td>
			)
		});
	}
});