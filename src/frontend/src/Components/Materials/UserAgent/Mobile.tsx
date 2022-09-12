import React from "react";
import classes from "./classes.module.scss";
type IProps = {};

type IState = {};
export default class Mobile extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root-mobile"]} {...this.state}>
				{this.props.children}
			</div>
		);
	}
}
