import classes from "./classes.module.scss";
import React from "react";
import Button from "Components/Elements/Button";
import Currency from "Assets/images/icons/currency.png";
import { Link } from "react-router-dom";
import Desktop from "Components/Materials/UserAgent/Desktop";
import Mobile from "Components/Materials/UserAgent/Mobile";
import { ReactComponent as More } from "Assets/images/icons/more.svg";
import I18n from "Components/Materials/I18n";

type IState = {
	activeTab: number;
};

type IProps = {
	offers: { price: number; from: string; expiration?: string }[];
	type: "bid" | "offers";
};

export default class OffersBid extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			activeTab: -1,
		};

		this.showTab = this.showTab.bind(this);
	}
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<Desktop>
					<table>
						<thead>
							<tr>
								<th><I18n map={["pages.nft_details.price"]}/></th>
								<th><I18n map={["pages.nft_details.usd_price"]}/></th>
								{this.props.type === "bid" && <th><I18n map={["pages.nft_details.expiration"]}/></th>}
								<th><I18n map={["general_text.from"]}/></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{this.props.offers.map((offer, key) => {
								return (
									<tr key={key}>
										<td className={classes["price-container"]}>
											<img src={Currency} alt="Currency icon" />
											{offer.price}
										</td>
										<td className={classes["price-usd"]}>
											${this.formatPrice(offer.price * 2500)}
										</td>
										{this.props.type === "bid" && (
											<td className={classes["expiration"]}>{offer.expiration}</td>
										)}
										<td>
											<Link to="/" className={classes["offer-from"]}>
												{offer.from}
											</Link>
										</td>
										<td>
											<Button variant="primary" sizing="s">
												<I18n map={["general_text.accept"]}/>
											</Button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</Desktop>
				<Mobile>
					<div className={classes["offers-container-responsive"]}>
						<div className={classes["offers-first-line"]}><I18n map={["pages.nft_details.price"]}/></div>
						<div className={classes["separator"]} />
						{this.props.offers.map((offer, key) => {
							return (
								<div className={classes["offer-container-responsive"]} key={key}>
									<div className={classes["offer-responsive"]}>
										<div className={classes["price-responsive"]}>
											<img src={Currency} alt="Currency icon" />
											{offer.price}
										</div>
										<More onClick={() => this.showTab(key)} />
										<Button variant="primary" sizing="s">
											<I18n map={["general_text.accept"]}/>
										</Button>
									</div>
									<div
										className={classes["offer-details"]}
										data-visible={this.state.activeTab === key}
										data-is-bid={this.props.type === "bid"}
									>
										<div className={classes["offer-details-line"]}>
											<p className={classes["offer-details-left"]}><I18n map={["pages.nft_details.usd_price"]}/></p>
											<p className={classes["offer-details-right"]}>
												${this.formatPrice(offer.price * 2500)}
											</p>
										</div>
										{this.props.type === "bid" && (
											<div className={classes["offer-details-line"]}>
												<p className={classes["offer-details-left"]}><I18n map={["pages.nft_details.expiration"]}/></p>
												<p className={classes["offer-details-right"]}>{offer.expiration}</p>
											</div>
										)}
										<div className={classes["offer-details-line"]}>
											<p className={classes["offer-details-left"]}><I18n map={["general_text.from"]}/></p>
											<Link
												to="/"
												className={[
													classes["offer-details-right"],
													classes["offer-details-from"],
												].join(" ")}
											>
												{offer.from}
											</Link>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</Mobile>
			</div>
		);
	}

	private showTab(number: number) {
		if (this.state.activeTab === number) {
			this.setState({
				activeTab: -1,
			});
			return;
		}

		this.setState({
			activeTab: number,
		});
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
