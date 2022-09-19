import Banner from "Components/Materials/ProfileBanner";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";

import bannerImage from "Assets/images/pages/profile/banner.png"
import profilePicture from "Assets/images/pages/profile/picture.svg"
import certifiedIcon from "Assets/images/pages/profile/certified.svg"
import nftCard from "Assets/images/nft-card-mock.png"

import classes from "./classes.module.scss";
import NftCard from "Components/Materials/NftCard";
import Filters from "Components/Materials/Filters";
import Module from "Components/Materials/Module";
import I18n from "Components/Materials/I18n";

type IProps = {};

type IState = {
	bannerName: string,
	address: string,
	bannerSrc: string,
	profilePictureSrc: string,
	certifiedIconSrc: string,
	nftName: string,
	nftPrice: number,
	collectionName: string,
	nftSrc: string
	userRoleName: string,
}

export default class Profile extends BasePage<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			bannerName: "John Doe",
			address: "0x745ty7882E8788gh742Eba6b7f7889Olkj99df",
			bannerSrc: bannerImage,
			profilePictureSrc: profilePicture,
			certifiedIconSrc: certifiedIcon,
			nftName: "NFT Name",
			nftPrice: 51.75,
			collectionName: "Collection Name",
			nftSrc: nftCard,
			userRoleName: "Role",
		}
	}

	public render(): JSX.Element {
		return (
			<I18n map={["pages_title.profile"]} content={([title]) =>
				<DefaultTemplate title={title!}>
					<div className={classes["banner"]}>
						<Banner
							name={this.state.bannerName}
							address={this.state.address}
							bannerSrc={this.state.bannerSrc}
							profilePictureSrc={this.state.profilePictureSrc}
							certifiedIconSrc={this.state.certifiedIconSrc}
							userRoleName={this.state.userRoleName}
						/>
					</div>
					<div className={classes["page-root"]}>
						<Filters filterModule={Module.config.pages.Profile.props.Filters}>
							<div className={classes["collection-label"]}><I18n map="general_text.nfts" /></div>
							<div className={classes["nft-container"]}>
								<NftCard
									name={this.state.nftName}
									collectionName={this.state.collectionName}
									price={this.state.nftPrice}
									nftSrc={this.state.nftSrc}
								/>
								<NftCard
									name={this.state.nftName}
									collectionName={this.state.collectionName}
									price={this.state.nftPrice}
									nftSrc={this.state.nftSrc}
								/>
								<NftCard
									name={this.state.nftName}
									collectionName={this.state.collectionName}
									price={this.state.nftPrice}
									nftSrc={this.state.nftSrc}
								/>
								<NftCard
									name={this.state.nftName}
									collectionName={this.state.collectionName}
									price={this.state.nftPrice}
									nftSrc={this.state.nftSrc}
								/>
								<NftCard
									name={this.state.nftName}
									collectionName={this.state.collectionName}
									price={this.state.nftPrice}
									nftSrc={this.state.nftSrc}
								/>
								<NftCard
									name={this.state.nftName}
									collectionName={this.state.collectionName}
									price={this.state.nftPrice}
									nftSrc={this.state.nftSrc}
								/>
								<NftCard
									name={this.state.nftName}
									collectionName={this.state.collectionName}
									price={this.state.nftPrice}
									nftSrc={this.state.nftSrc}
								/>
								<NftCard
									name={this.state.nftName}
									collectionName={this.state.collectionName}
									price={this.state.nftPrice}
									nftSrc={this.state.nftSrc}
								/>
							</div>
						</Filters>
					</div>
				</DefaultTemplate>
			} />
		);
	}
}

