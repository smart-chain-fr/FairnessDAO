import React from "react";

import Glass from "assets/images/icons/glass.svg";

import classes from "./classes.module.scss";
import I18n from "Components/Materials/I18n";

type IProps = {};

type IState = {
	stringSearch: string;
};

export default class SearchBar extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			stringSearch: "",
		};
		this.handleSearch = this.handleSearch.bind(this);
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<div className={classes["glass-container"]}>
					<img
						src={Glass}
						alt=""
						className={classes["glass-image"]}
					/>
				</div>
				<div className={classes["input-container"]}>
					<I18n
						map={["general_text.search"]}
						content={([search]) => {
							return <input
								type="text"
								className={classes["input-searchbar"]}
								value={this.state.stringSearch}
								onChange={this.handleSearch}
								placeholder={search}
							/>
						}} />

				</div>
			</div>
		);
	}

	private handleSearch(e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
			stringSearch: e.target.value,
		});
	}
}
