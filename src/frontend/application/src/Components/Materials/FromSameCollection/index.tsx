import Button from "Components/Elements/Button";
import React from "react";
import NftCard from "../NftCard";
import classes from "./classes.module.scss";

type IProps = {
	cards: { collectionName: string; name: string; price: number; nftSrc: string }[];
};
export default class FromSameCollection extends React.Component<IProps> {
	public render(): JSX.Element | null {
		return (
			<div className={classes["root"]}>
				<p className={classes["title"]}>From the same collection</p>
				<div className={classes["cards-container"]}>
					{this.props.cards.map((card, key) => {
						return (
							<NftCard
								collectionName={card.collectionName}
								name={card.name}
								price={card.price}
								nftSrc={card.nftSrc}
								key={key}
							/>
						);
					})}
				</div>
				<div className={classes["view-more-container"]}>
					<Button sizing="l" variant="primary">
						View more
					</Button>
				</div>
			</div>
		);
	}
}
