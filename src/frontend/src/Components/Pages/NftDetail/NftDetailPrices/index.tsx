import Currency from "Assets/images/icons/currency.png";
import I18n from "Components/Materials/I18n";
import React from "react";
import classes from "./classes.module.scss";

export default class NftDetailPrices extends React.Component {
	public render(): JSX.Element {
		return (
			<I18n map={["pages.nft_details.price", "pages.nft_details.top_bid", "pages.nft_details.reserve_price"]} content={([price, topBid, reservePrice]) => {
				return <div className={classes["root"]}>
					{this.getPriceElement(51.75, price!)}
					{this.getPriceElement(51.75, topBid!)}
					{this.getPriceElement(3.14, reservePrice!)}
				</div>
			}}/>
			
		);
	}

	private getPriceElement(price: number, label: string) {
		return (
			<div className={classes["price-element"]}>
				<p className={classes["price-label"]}>{label}</p>
				<div className={classes["price-container"]}>
					<img src={Currency} alt="Currency logo" className={classes["currency-logo"]} />
					<p className={classes["price"]}>{price}</p>
					<p className={classes["price-in-fiat"]}>(${this.formatPrice(price * 2576.05)})</p>
				</div>
			</div>
		);
	}

	private formatPrice(number: number) {
		let roundedNumber = number.toFixed(2);
		let parts = roundedNumber.split(".");
		if (parts[0]) {
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		return parts.join(".");
	}
}
