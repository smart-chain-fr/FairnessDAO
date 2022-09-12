import React from "react";
import Tags, { TagsType } from "Stores/Tags";
import Module from "../Module";

import classes from "./classes.module.scss";
import Tag from "Components/Materials/Tag";
import DropdownFilters from "./DropdownFilters";
import SideFilters from "./SideFilters";
import SearchBar from "./SearchBar";
import I18n from "../I18n";


type IProps = {
	filterModule: any,
	children?: React.ReactNode
};
type IState = {
	tags: TagsType;
	reset_filters: boolean;
};

export default class Filters extends React.Component<IProps, IState> {
	private removeOnTagsChange = () => { };

	constructor(props: IProps) {
		super(props);
		this.state = {
			tags: Tags.getInstance().tags,
			reset_filters: false
		};
	}

	public render(): JSX.Element {
		return (
			<>
				<div className={classes["root-side-filters"]}>
					<Module from={this.props.filterModule}>
						<div className={classes["side-filters"]}>
							<SideFilters content={this.props.filterModule["props"]} />
						</div>
					</Module>
				</div>
				<div className={classes["content"]}>
					<div className={classes["tags"]}>
						{Tags.getInstance().tags.map(
							(tag, i) =>
								<Tag key={i} variant="closeable_tag" value={tag ?? ""} />
						)}
						<div onClick={() => this.resetAllTags()} className={classes["reset-filters"]}><I18n map="components.filters.reset_filters"/></div>
					</div>
					<Module from={this.props.filterModule}>
						<div className={classes["dropdown-filters"]}>
							<div className={classes["search-bar-responsive"]}>
								<SearchBar />
							</div>
							<DropdownFilters content={this.props.filterModule["props"]} />
						</div>
					</Module>
					{this.props.children}
				</div>
			</>
		)
	}

	public componentDidMount() {
		this.removeOnTagsChange = Tags.getInstance().onChange((tags) => this.onTagChange(tags));
	}

	public componentWillUnmount() {
		this.removeOnTagsChange();
	}

	private onTagChange(tags: TagsType) {
		this.setState({
			tags
		});
	}

	private resetAllTags() {
		Tags.getInstance().resetAll()
	}
}
