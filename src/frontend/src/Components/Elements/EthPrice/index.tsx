import React from "react";
import ethIcon from "Assets/images/icons/eth-token-symbol.svg";

import classes from "./classes.module.scss";
import EthBigNumber from "Services/Wallet/EthBigNumber";

type IProps = {
	ethData: number | JSX.Element | String | EthBigNumber;
};

export default class EthPrice extends React.Component<IProps> {
	public render(): JSX.Element {
		return (
			<div className={classes["price-eth"]}>
				<img alt="ethereum" src={ethIcon} className={classes["eth"]}/>
				{this.props.ethData}
			</div>
		);
	}
}
