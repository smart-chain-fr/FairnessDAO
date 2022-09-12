import React from "react";

import { ReactComponent as Instagram } from "assets/images/logos/instagram.svg";
import { ReactComponent as Facebook } from "assets/images/logos/facebook.svg";
import { ReactComponent as LinkedIn } from "assets/images/logos/linkedin.svg";
import { ReactComponent as Twitter } from "assets/images/logos/twitter.svg";
import { ReactComponent as Discord } from "assets/images/logos/discord.svg";
import { ReactComponent as Website } from "assets/images/logos/website.svg";
import { ReactComponent as Mail } from "assets/images/logos/mail.svg";
import { ReactComponent as Medium } from "assets/images/logos/medium.svg";
import { ReactComponent as Telegram } from "assets/images/logos/telegram.svg";

type IProps = {
	socialPath: string;
	socialName: string;
};

type IState = {};

export default class Mode extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return this.socialLogoModule();
	}

	private socialLogoModule(): JSX.Element {
		return (
			<a href={this.props.socialPath} target="_blank" rel="noreferrer" key={this.props.socialName}>
				{this.getSocialIcon(this.props.socialName)}
			</a>
		);
	}

	private getSocialIcon(socialNetwork: string): JSX.Element | null {
		switch (socialNetwork) {
			case "facebook":
				return <Facebook />;
			case "instagram":
				return <Instagram />;
			case "twitter":
				return <Twitter />;
			case "linkedin":
				return <LinkedIn />;
			case "discord":
				return <Discord />;
			case "website":
				return <Website />;
			case "mail":
				return <Mail />;
			case "medium":
				return <Medium />;
			case "telegram":
				return <Telegram />;
			default:
				return null;
		}
	}
}

