import { ReactComponent as DetailsIcon } from "Assets/images/icons/details.svg";
import { ReactComponent as BidIcon } from "Assets/images/icons/bids.svg";
import { ReactComponent as AttributesIcon } from "Assets/images/icons/attributes.svg";
import { ReactComponent as OffersIcon } from "Assets/images/icons/offers-dropdown.svg";
import classes from "./classes.module.scss";
import Dropdown from "Components/Materials/Dropdown";
import React from "react";
import Details from "./Details";
import Attributes from "./Attributes";
import OffersBid from "./OffersBid";
import I18n from "Components/Materials/I18n";

type IProps = {
	attributes: { attribute: string; state: string; percentage: number }[];
	offers: { price: number; from: string; expiration: string }[];
};
export default class NftDetailDropdowns extends React.Component<IProps> {
	public render(): JSX.Element {
		return (
			<I18n map={["pages.nft_details.offers", "pages.nft_details.bids", "pages.nft_details.attributes", "pages.nft_details.details"]} content={([offers, bids, attributes, details]) => {
				return <div className={classes["root"]}>
					<Dropdown icon={<OffersIcon />} label={offers}>
						<OffersBid offers={this.props.offers} type="offers" />
					</Dropdown>
					<Dropdown icon={<BidIcon />} label={bids}>
						<OffersBid offers={this.props.offers} type="bid" />
					</Dropdown>
					<Dropdown icon={<AttributesIcon />} label={attributes}>
						<Attributes attributes={this.props.attributes} />
					</Dropdown>
					<Dropdown icon={<DetailsIcon />} label={details}>
						<Details
							contractAddress="0x80be295d0D5e10ee383a8C21541C54e2236d6125"
							tokenId="0x80be295d0D5e10ee383a8C21541C54e2236d6125"
							tokenStandard="ERC-721"
							blockchain="Ethereum"
						/>
					</Dropdown>
				</div>
			}}/>
		);
	}
}
