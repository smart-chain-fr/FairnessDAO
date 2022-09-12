import React from "react";
import classes from "./classes.module.scss";

import { ReactComponent as ArrowLeft } from "assets/images/icons/long-arrow-left.svg"
import { ReactComponent as ArrowRight } from "assets/images/icons/long-arrow-right.svg"
import { ReactComponent as FilterIcon } from "assets/images/icons/filter.svg"
import I18n from "Components/Materials/I18n";
import FiltersContent, { IFiltersProps } from "../FiltersContent";
import SearchBar from "../SearchBar";

type IProps = {
	content: IFiltersProps;
};

type IState = {
	open: boolean;
};

export default class SideFilters extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			open: true,
		};
	}

	public render(): JSX.Element {
		return (<>
			{this.state.open ?
				<div className={classes["root"]} data-open={this.state.open}>
					<div className={classes["search-bar"]}>
						<SearchBar />
					</div>
					<div className={classes["title"]} onClick={() => { this.toogle() }}>
						<span className={classes["left"]}>
							<FilterIcon />
							<I18n map="components.filters.filters" />
						</span>
						<ArrowLeft />
					</div>
					<FiltersContent content={this.props.content} />
				</div> :
				<div className={classes["closed-filter"]} onClick={() => { this.toogle() }}>
					<ArrowRight />
				</div>}
		</>

		);
	}

	private toogle() {
		this.setState({ open: !this.state.open })
	}
}
