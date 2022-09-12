import Module from "Components/Materials/Module";
import React from "react";
import SocialMedia from "../SocialMedia";
import classes from "./classes.module.scss";

type IProps = {
	color: "light" | "dark";
};

type IState = {};
const socialNetworksPath = Module.config.pages.Profile.props.SocialNetworks.props;

export default class Mode extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]} data-color={this.props.color}>
				<Module from={socialNetworksPath.discord}>
					<div>
						<SocialMedia socialName="discord" socialPath={socialNetworksPath.discord.path} />
					</div>
				</Module>
				<Module from={socialNetworksPath.telegram}>
					<div>
						<SocialMedia socialName="telegram" socialPath={socialNetworksPath.telegram.path} />
					</div>
				</Module>
				<Module from={socialNetworksPath.medium}>
					<div>
						<SocialMedia socialName="medium" socialPath={socialNetworksPath.medium.path} />
					</div>
				</Module>

				<Module from={socialNetworksPath.twitter}>
					<div>
						<SocialMedia socialName="twitter" socialPath={socialNetworksPath.twitter.path} />
					</div>
				</Module>

				<Module from={socialNetworksPath.instagram}>
					<div>
						<SocialMedia socialName="instagram" socialPath={socialNetworksPath.instagram.path} />
					</div>
				</Module>

				<Module from={socialNetworksPath.facebook}>
					<div>
						<SocialMedia socialName="facebook" socialPath={socialNetworksPath.facebook.path} />
					</div>
				</Module>

				<Module from={socialNetworksPath.website}>
					<div className={classes["inverted-icon"]}>
						<SocialMedia socialName="website" socialPath={socialNetworksPath.website.path} />
					</div>
				</Module>

				<Module from={socialNetworksPath.mail}>
					<div className={classes["inverted-icon"]}>
						<SocialMedia socialName="mail" socialPath={socialNetworksPath.mail.path} />
					</div>
				</Module>
			</div>
		);
	}
}

