import React from "react";

import classes from "./classes.module.scss";
import copyIcon from "assets/images/icons/copy.svg"

type IProps = {
	text: string;
	copyIcon?: boolean;
};
type IState = {};

export default class AddressShort extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<span title={this.props.text} className={classes["root"]}>
				{this.formatAddress(this.props.text)}
				{this.props.copyIcon && <img alt='copy' src={copyIcon} className={classes["copy-icon"]}/>}
			</span>
		);
	}

	private formatAddress(address: String) {
		let length = address.length;
		return address.substring(0, 5) + "..." + address.substring(length - 4, length);
	}
}
