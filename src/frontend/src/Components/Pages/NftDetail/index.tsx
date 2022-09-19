import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import classes from "./classes.module.scss";
import NftDetailImgMock from "Assets/images/nft_detail_mock.png";
import { ReactComponent as Refresh } from "Assets/images/icons/refresh.svg";
import { ReactComponent as Share } from "Assets/images/icons/share.svg";
import { ReactComponent as FavoriteIcon } from "Assets/images/icons/favorite_gray.svg";

import NftDetailPrices from "./NftDetailPrices";
import NftDetailActions from "./NftDetailActions";
import Timer from "Components/Materials/Timer";
import NftDetailDropdowns from "./NftDetailDropdowns";
import FromSameCollection from "Components/Materials/FromSameCollection";
import nftCard from "Assets/images/nft-card-mock.png";
import I18n from "Components/Materials/I18n";

export default class NftDetail extends BasePage {
	cards = [
		{
			collectionName: "Collection Name",
			name: "NFT Name",
			price: 51.75,
			nftSrc: nftCard,
		},
		{
			collectionName: "Collection Name",
			name: "NFT Name",
			price: 51.75,
			nftSrc: nftCard,
		},
		{
			collectionName: "Collection Name",
			name: "NFT Name",
			price: 51.75,
			nftSrc: nftCard,
		},
		{
			collectionName: "Collection Name",
			name: "NFT Name",
			price: 51.75,
			nftSrc: nftCard,
		},
	];

	deadline: Date = new Date("25 Jul 2022");

	private attributes = [
		{
			attribute: "attribute",
			state: "State",
			percentage: 20,
		},
		{
			attribute: "attribute",
			state: "State",
			percentage: 20,
		},
		{
			attribute: "attribute",
			state: "State",
			percentage: 20,
		},
		{
			attribute: "attribute",
			state: "State",
			percentage: 20,
		},
		{
			attribute: "attribute",
			state: "State",
			percentage: 20,
		},
		{
			attribute: "attribute",
			state: "State",
			percentage: 20,
		},
		{
			attribute: "attribute",
			state: "State",
			percentage: 20,
		},
		{
			attribute: "attribute",
			state: "State",
			percentage: 20,
		},
	];

	private offers = [
		{
			price: 0.3473,
			from: "John Doe",
			expiration: "4 days",
		},
		{
			price: 0.54,
			from: "John Doe",
			expiration: "4 days",
		},
		{
			price: 0.17,
			from: "John Doe",
			expiration: "4 days",
		},
		{
			price: 1.3473,
			from: "John Doe",
			expiration: "4 days",
		},
		{
			price: 3.23,
			from: "John Doe",
			expiration: "4 days",
		},
		{
			price: 0.3473,
			from: "John Doe",
			expiration: "4 days",
		},
		{
			price: 0.54,
			from: "John Doe",
			expiration: "4 days",
		},
		{
			price: 0.17,
			from: "John Doe",
			expiration: "4 days",
		},
		{
			price: 1.3473,
			from: "John Doe",
			expiration: "4 days",
		},
		{
			price: 3.23,
			from: "John Doe",
			expiration: "4 days",
		},
	];

	public render(): JSX.Element {
		return (
			<I18n
				map={["pages_title.nft_detail"]}
				content={([title]) => (
					<DefaultTemplate title={title!}>
						<div className={classes["root"]}>
							<div className={classes["nft-container"]}>
								<div className={classes["img-container"]}>
									<img src={NftDetailImgMock} alt="Nft" className={classes["nft-img"]} />
									<FavoriteIcon className={classes["favorite-logo"]} data-favorite={false} />
								</div>
								<div className={classes["details-container"]}>
									<p className={classes["collection-name"]}>Collection Name</p>
									<p className={classes["nft-name"]}>NFT Name</p>
									<p className={classes["nft-owner"]}>
										<I18n map="pages.nft_details.owned_by" />
										&nbsp;
										<span className={classes["owner-colored"]}>John Doe</span>
									</p>
									<p className={classes["nft-description"]}>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Feugiat lectus dignissim felis sit ante integer. Urna, risus aliquet neque congue sit euismod ornare purus. Montes, blandit vestibulum nisi, ut
										ultrices bibendum morbi sit sapien. Eu mattis nibh venenatis pharetra, tempus mollis morbi aliquam. Laoreet diam nulla orci sed. Ornare quis massa senectus aliquet id. Est augue massa netus
										consectetur et. Malesuada scelerisque eleifend cursus aliquet vulputate ullamcorper maecenas.
									</p>
									<div className={classes["timer-container"]}>
										<I18n
											map={["pages.nft_details.auction_ends"]}
											content={([auctionEnds]) => {
												return <Timer deadline={this.deadline} label={`${auctionEnds} ${this.deadline.toUTCString()}`} />;
											}}
										/>
									</div>
									<NftDetailPrices />
									<NftDetailActions />
									<NftDetailDropdowns offers={this.offers} attributes={this.attributes} />

									{/* Absolute part */}
									<div className={classes["actions-container"]}>
										<div className={classes["actions-button-left"]}>
											<Refresh />
										</div>
										<div className={classes["actions-separator"]} />
										<div className={classes["actions-button-right"]}>
											<Share />
										</div>
									</div>
								</div>
							</div>
							<div className={classes["same-collection-container"]}>
								<FromSameCollection cards={this.cards} />
							</div>
						</div>
					</DefaultTemplate>
				)}
			/>
		);
	}
}
