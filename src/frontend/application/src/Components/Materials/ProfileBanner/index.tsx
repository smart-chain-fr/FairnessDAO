import AddressShort from "Components/Elements/AddressShort";
import React from "react";
import Module from "../Module";
import classes from "./classes.module.scss";
import CopyClipboard from "Components/Elements/CopyClipboard";
import SocialMediasBar from "Components/Elements/SocialMediasBar";

type IProps = {
	name: string;
	address: string;
	bannerSrc: string;
	profilePictureSrc: string;
	certifiedIconSrc: string;
	userRoleName: string;
};

type IState = {};

export default class Banner extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				<div className={classes["banner"]}>
					<Module from={Module.config.pages.Profile.props.BannerImage}>
						<div className={classes["banner-image"]}>
							<img alt="banner" src={this.props.bannerSrc} />
							<Module from={Module.config.pages.Profile.props.SocialNetworks}>
								<div className={classes["social-medias-desktop"]}>
									<SocialMediasBar color="light" />
								</div>
							</Module>
						</div>
					</Module>
					<Module from={Module.config.pages.Profile.props.Picture}>
						<div className={classes["profile-cadre"]} data-banner-image-enabled={Module.config.pages.Profile.props.BannerImage.enabled}>
							<img alt="profile" src={this.props.profilePictureSrc} />
						</div>
					</Module>
					<Module from={Module.config.pages.Profile.props.Name}>
						<div className={classes["name"]}>
							{this.props.name}
							<Module from={Module.config.pages.Profile.props.Certified}>
								<img src={this.props.certifiedIconSrc} alt="certified" className={classes["certified-icon"]} />
							</Module>
						</div>
					</Module>
					<Module from={Module.config.pages.Profile.props.Address}>
						<CopyClipboard value={this.props.address}>
							<AddressShort text={this.props.address} copyIcon={true} />
						</CopyClipboard>
					</Module>
					<Module from={Module.config.pages.Profile.props.Role}>
						<div className={classes["role-cadre"]}>{this.props.userRoleName}</div>
					</Module>
					<Module from={Module.config.pages.Profile.props.SocialNetworks}>
						<div className={classes["social-medias-responsiv"]}>
							<SocialMediasBar color="dark" />
						</div>
					</Module>
				</div>
			</div>
		);
	}
}

