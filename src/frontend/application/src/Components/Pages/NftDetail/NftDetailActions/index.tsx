import React from "react";
import classes from "./classes.module.scss";
import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
export default class NftDetailActions extends React.Component {
	public render(): JSX.Element {
		const keys = [
			"pages.nft_details.sell",
			"pages.nft_details.create_auction",
			"pages.nft_details.cancel_auction",
			"pages.nft_details.cancel_listing"
		];

		return (
			<I18n map={keys} content={([sell, create_auction, cancel_auction, cancel_listing]) => 
				<div className={classes["root"]}>
					<Button sizing="l" variant="primary">
						{sell}
					</Button>
					<Button sizing="l" variant="ghost">
						{create_auction}
					</Button>
					<Button sizing="l" variant="primary">
						{cancel_auction}
					</Button>
					<Button sizing="l" variant="primary">
						{cancel_listing}
					</Button>
				</div>
			} />
		);
	}
}
