import React from "react";
import AuctionMenu from "./AuctionMenu";

import classes from "./classes.module.scss";

export enum EMENUS {
	RECEIVED,
	MADE,
}

type IProps = {
	onChange: (menu: EMENUS) => void;
};

type IState = {
	menu: EMENUS;
};

export default class Menu extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			menu: EMENUS.RECEIVED,
		};
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<AuctionMenu
					onClick={() => this.switch(EMENUS.RECEIVED)}
					isActive={this.state.menu === EMENUS.RECEIVED}
					text="Offers received"
				/>
				<AuctionMenu
					onClick={() => this.switch(EMENUS.MADE)}
					isActive={this.state.menu === EMENUS.MADE}
					text="Offers made"
				/>
			</div>
		);
	}

	private switch(menu: EMENUS) {
		this.setState({ menu });
		this.props.onChange(menu);
	}
}

