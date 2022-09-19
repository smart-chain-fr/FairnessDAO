import React from "react";

import { ReactComponent as Instagram } from "Assets/images/logos/instagram.svg";
import { ReactComponent as Facebook } from "Assets/images/logos/facebook.svg";
import { ReactComponent as LinkedIn } from "Assets/images/logos/linkedin.svg";
import { ReactComponent as Twitter } from "Assets/images/logos/twitter.svg";
import { ReactComponent as Discord } from "Assets/images/logos/discord.svg";
import { ReactComponent as Website } from "Assets/images/logos/website.svg";
import { ReactComponent as Mail } from "Assets/images/logos/mail.svg";
import { ReactComponent as Medium } from "Assets/images/logos/medium.svg";
import { ReactComponent as Telegram } from "Assets/images/logos/telegram.svg";

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

