import React from "react";
import { Link, NavLink } from "react-router-dom";
import classes from "./classes.module.scss";
import Logo from "../Logo";
import EmailComponent from "../EmailComponent";
import Module from "../Module";

import SocialMedia from "Components/Elements/SocialMedia";
import I18n from "../I18n";

export default class Footer extends React.Component {
	public render(): JSX.Element | null {
		return (
			<footer className={classes["root"]}>
				<div className={classes["content"]}>
					<div className={classes["left"]}>
						{this.logoModule()}
						{this.navModule()}
					</div>
					<div className={classes["right"]}>{this.newsLetterModule()}</div>
				</div>
				<div className={classes["down-part"]}>
					<Module from={Module.config.Footer.props.SocialNetworks}>
						<div className={classes["social-medias"]}>
							{Module.config.Footer.props.SocialNetworks.props.content.map((social) => {
								return (
									<SocialMedia socialName={social.name} socialPath={social.name} key={social.name} />
								);
							})}
						</div>
					</Module>

					{this.policyModule()}
				</div>
			</footer>
		);
	}

	private logoModule(): JSX.Element {
		return (
			<Module from={Module.config.Footer.props.Logo}>
				<Link className={classes["logo"]} to="/">
					<Logo />
				</Link>
			</Module>
		);
	}

	private navModule(): JSX.Element {
		return (
			<div className={classes["nav-container"]}>
				<Module from={Module.config.Footer.props.Links}>
					{Module.config.Footer.props.Links.props.content.map((link) => (
						<NavLink
							className={(navData) =>
								navData.isActive
									? [classes["route"], classes["active-route"]].join(" ")
									: classes["route"]
							}
							to={link.path}
							key={link.labelKey}
						>
							<I18n map={"pages_title.".concat(link.labelKey)}/>
						</NavLink>
					))}
				</Module>
			</div>
		);
	}

	private newsLetterModule(): JSX.Element {
		return (
			<Module from={Module.config.Footer.props.Newsletter}>
				<div className={classes["title-newsletter"]}><I18n map="general_text.get_latest_updates"/></div>
				<I18n map="general_text.email_address" />

				<I18n map={["general_text.email_address", "general_text.subscribe"]} content={([emailAddress, subscribe]) => {
					return <EmailComponent placeholder={emailAddress!} textButton={subscribe!} />
				}}/>
			</Module>
		);
	}

	private policyModule(): JSX.Element {
		return (
			<Module from={Module.config.Footer.props.Policy}>
				<div className={classes["policy"]}>
					{Module.config.Footer.props.Policy.props.content.map((policy) => (
						<a href={policy.href} target="_blank" rel="noreferrer" key={policy.labelKey}>
							<I18n map={"components.footer.".concat(policy.labelKey)} />
						</a>
					))}
				</div>
			</Module>
		);
	}
}
