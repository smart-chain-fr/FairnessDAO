import React from "react";

import { ReactComponent as Cross } from "assets/images/icons/cross-search.svg";
import Glass from "assets/images/icons/glass.svg";
import SearchResultsStatus from "Stores/SearchResultsStatus";
import WindowStore from "Stores/WindowStore";

import classes from "./classes.module.scss";
import SearchResults from "../../SearchResults";
import TopSearchBarStatus, { EOpeningState } from "Stores/TopSearchBar";
import I18n from "Components/Materials/I18n";
import { ReactComponent as ArrowLeft } from "assets/images/icons/arrow-left-close.svg";
type IProps = {};

type IState = {
	stringSearch: string;
	showSearchBar: boolean;
	status: EOpeningState;
};

export default class SearchBar extends React.Component<IProps, IState> {
	private ref: React.RefObject<HTMLDivElement>;
	private nameInput: HTMLInputElement | null = null;
	private removeOnClick = () => {};
	private removeOnSwitch = () => {};

	constructor(props: IProps) {
		super(props);
		this.state = {
			stringSearch: "",
			showSearchBar: false,
			status: TopSearchBarStatus.getInstance().status,
		};

		this.handleSearch = this.handleSearch.bind(this);
		this.clearSearch = this.clearSearch.bind(this);
		this.ref = React.createRef();
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				{this.state.status === EOpeningState.OPENED && <ArrowLeft className={classes["arrow-left"]} onClick={() => this.toggleSearchBar(false)} />}
				<div className={classes["searchbar-container"]} ref={this.ref} data-show-results={this.state.showSearchBar}>
					<div className={classes["glass-container"]}>
						<img src={Glass} alt="" className={classes["glass-image"]} onClick={() => this.toggleSearchBar(true)} />
					</div>
					<div className={classes["input-container"]}>
						<I18n
							map={["general_text.search"]}
							content={([search]) => {
								return (
									<input
										type="text"
										className={classes["input-searchbar"]}
										value={this.state.stringSearch}
										onChange={this.handleSearch}
										onFocus={() => {
											if (this.state.stringSearch.length > 0) {
												SearchResultsStatus.getInstance().open();
											}
										}}
										ref={(input) => {
											this.nameInput = input;
										}}
										placeholder={search}
									/>
								);
							}}
						/>
						<Cross className={classes["cross"]} onClick={this.clearSearch} />
					</div>
					<SearchResults />
				</div>
			</div>
		);
	}

	public componentDidMount() {
		this.removeOnClick = WindowStore.getInstance().onClick((e: MouseEvent) => this.handleClickOutside(e));
		this.removeOnSwitch = TopSearchBarStatus.getInstance().onSwitch(() => this.updateStatus());
	}

	public componentWillUnmount() {
		this.removeOnClick();
		this.removeOnSwitch();
	}

	private updateStatus() {
		this.setState({
			status: TopSearchBarStatus.getInstance().status,
		});
	}

	private handleSearch(e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
			stringSearch: e.target.value,
		});

		if (e.target.value.length > 0) {
			SearchResultsStatus.getInstance().open();
			return;
		}

		SearchResultsStatus.getInstance().close();
	}

	private clearSearch() {
		this.setState({
			stringSearch: "",
		});
		this.nameInput?.focus();
		SearchResultsStatus.getInstance().close();
	}

	private handleClickOutside(event: MouseEvent) {
		if (!this.ref.current?.contains(event.target as Node) && window.innerWidth > 1023) this.toggleSearchBar(false);
	}

	private toggleSearchBar(showSearchBar: boolean) {
		if (showSearchBar) {
			this.nameInput?.focus();
			this.setState({
				showSearchBar: showSearchBar,
			});
			TopSearchBarStatus.getInstance().open();
		} else {
			TopSearchBarStatus.getInstance().close();
			SearchResultsStatus.getInstance().close();
			this.setState({
				showSearchBar: showSearchBar,
				stringSearch: "",
			});
		}
	}
}
