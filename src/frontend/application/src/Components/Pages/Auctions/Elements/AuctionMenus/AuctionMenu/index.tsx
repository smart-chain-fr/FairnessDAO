import React from "react";

import classes from "./classes.module.scss";

type IProps = {
	text: string;
	isActive: boolean;
	onClick: () => void;
};
type IState = {};

export default class AuctionMenu extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div onClick={() => this.props.onClick()} className={classes["root"]} data-is-active={this.props.isActive}>
				{this.props.text}
			</div>
		);
	}
}

