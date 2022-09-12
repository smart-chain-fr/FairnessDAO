import React from "react";
import { ReactComponent as FilterIcon } from "assets/images/icons/filter.svg"
import FiltersContent, { IFiltersProps } from "../FiltersContent";
import Dropdown from "Components/Materials/Dropdown";
import classes from "./classes.module.scss";
import I18n from "Components/Materials/I18n";


type IProps = {
	content: IFiltersProps;
};

type IState = {};

export default class DropdownFilters extends React.Component<IProps, IState> {

	public render(): JSX.Element {
		return (
			<I18n map={"components.filters.filters"} content={([filters]) => {
				return <Dropdown icon={<FilterIcon />} label={filters} variant={"tertiary"}>
					<div className={classes["filters-container"]}>
						<FiltersContent content={this.props.content} />
					</div>
				</Dropdown>
			}} />
		);
	}
}
