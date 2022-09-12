import React from "react";
import { EThemeModeType } from "Stores/ThemeMode";
import classes from "./classes.module.scss";

type IProps = {
	active: EThemeModeType;
};

type IState = {};

export default class Mode extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div {...this.props} className={classes["root"]}>
				<div className={classes["point"]} />
			</div>
		);
	}
}
