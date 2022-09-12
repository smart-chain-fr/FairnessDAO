import EthPrice from "Components/Elements/EthPrice";
import React from "react";
import classes from "./classes.module.scss";

import { ReactComponent as FavIcon } from "assets/images/icons/favorite_gray.svg";
import CheckBox from "Components/Elements/CheckBox";

type IProps = {
	name: string;
	price: number;
	collectionName: string;
	nftSrc: string;
};

type IState = {};

export default class NftCard extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<img alt="banner" src={this.props.nftSrc} />
				<div className={classes["fav-container"]}>
					<CheckBox ><FavIcon /></CheckBox>
				</div>
				<div className={classes["content"]}>
					<div className={[classes["row"], classes["first"]].join(" ")}>
						<div>{this.props.collectionName}</div>
						<div>Price</div>
					</div>
					<div className={[classes["row"], classes["second"]].join(" ")}>
						<div>{this.props.name}</div>
						<EthPrice ethData={this.props.price} />
					</div>
				</div>
			</div>
		);
	}
}
