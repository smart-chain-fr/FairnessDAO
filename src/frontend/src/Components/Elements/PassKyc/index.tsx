import React from "react";
import classes from "./classes.module.scss";
import Module from "Components/Materials/Module";
import I18n from "Components/Materials/I18n";
import { ReactComponent as ArrowRight } from "assets/images/icons/arrow-right-details.svg";
type IProps = {};

type IState = {};

export default class PassKyc extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		const config = Module.config;
		return (
			<a href={config.Kyc.props.url} target="_blank" className={classes["root"]} rel="noreferrer">
				<div className={classes["container"]}>
					<div className={classes["text"]}>
						<I18n map="components.header_menu.pass_kyc" />
					</div>
					<ArrowRight />
				</div>
			</a>
		);
	}
}
