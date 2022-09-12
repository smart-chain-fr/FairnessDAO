import AddressShort from "Components/Elements/AddressShort";
import CopyClipboard from "Components/Elements/CopyClipboard";
import React from "react";

import copyIcon from "assets/images/icons/copy.svg";
import classes from "./classes.module.scss";

type IProps = {
	text:string
	isAdress?:boolean,
};
type IState = {};

export default class CopyContent extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
						<CopyClipboard value={this.props.text}>
							{this.props.isAdress ? <AddressShort text={this.props.text} /> : this.props.text}
							<img src={copyIcon} alt="copy contact adress" className={classes["copy-icon"]} />
						</CopyClipboard>
					</div>
		);
	}

}
