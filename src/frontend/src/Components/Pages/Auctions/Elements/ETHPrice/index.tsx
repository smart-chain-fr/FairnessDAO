import React from "react";

import classes from "./classes.module.scss";
import EthPrice from "Components/Elements/EthPrice";

type IProps = {
	price: string;
};
type IState = {};

export default class ETHPrice extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<EthPrice ethData={this.props.price+" ETH"} />
			</div>
		);
	}
}

