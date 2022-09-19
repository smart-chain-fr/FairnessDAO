import React from "react";
import classes from "./classes.module.scss";
import { ReactComponent as Glass } from "Assets/images/icons/glass.svg";
import SearchResultsStatus from "Stores/SearchResultsStatus";
import TopSearchBarStatus, { EOpeningState } from "Stores/TopSearchBar";
import I18n from "../I18n";

type IProps = {};
type IState = {
	status: EOpeningState;
	stringsearch: string;
};

export default class TopSearchBar extends React.Component<IProps, IState> {
	private removeOnSwitch = () => {};
	private searchInput: HTMLInputElement | null = null;

	constructor(props: IProps) {
		super(props);

		this.state = {
			status: TopSearchBarStatus.getInstance().status,
			stringsearch: "",
		};

		this.handleSearch = this.handleSearch.bind(this);
	}

	public render() {
		return (
			<div className={classes["root"]} {...this.state}>
				<div className={classes["nav"]}>
					<div className={classes["input-container"]}>
						<Glass className={classes["glass"]} />
						<I18n map={["general_text.input_text_here"]} content={([translatedText]) => {
							return <input
								type="text"
								className={classes["input-element"]}
								placeholder={translatedText}
								value={this.state.stringsearch}
								onChange={this.handleSearch}
								onFocus={() => {
									if (this.state.stringsearch.length > 0) {
										SearchResultsStatus.getInstance().open();
									}
								}}
								ref={(input) => {
									this.searchInput = input;
								}}
							/>
							}}/>
					</div>
				</div>
				<div className={classes["shadow"]} onClick={() => SearchResultsStatus.getInstance().close()} />
			</div>
		);
	}

	public componentDidMount() {
		this.setState({
			stringsearch: "",
		});
		this.removeOnSwitch = TopSearchBarStatus.getInstance().onSwitch((type) => {
			this.updateStatus();
		});
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
	}

	private updateStatus() {
		if (TopSearchBarStatus.getInstance().status === EOpeningState.OPENED) {
			this.searchInput?.focus();
		} else {
			SearchResultsStatus.getInstance().close();
		}

		this.setState({
			status: TopSearchBarStatus.getInstance().status,
			stringsearch: "",
		});
	}

	private handleSearch(e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
			stringsearch: e.target.value,
		});

		if (e.target.value.length <= 0) {
			SearchResultsStatus.getInstance().close();
			return;
		}

		SearchResultsStatus.getInstance().open();
	}
}
