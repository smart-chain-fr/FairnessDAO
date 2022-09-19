import React from "react";
import nftCard from "Assets/images/nft-card-mock.png";

//import EthPrice from "Components/Elements/EthPrice";

import classes from "./classes.module.scss";

type IProps = {
	name: string;
};
type IState = {};

export default class NftIdentificator extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<img alt="NFT" src={nftCard}></img>
				<div className={classes["nft-name"]}>{this.props.name}</div>
			</div>
		);
	}
}

