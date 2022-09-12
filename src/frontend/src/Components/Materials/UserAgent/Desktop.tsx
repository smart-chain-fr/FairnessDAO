import React from "react";
import classes from "./classes.module.scss";
type IProps = {};

type IState = {
};
export default class Desktop extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root-desktop"]} {...this.state}>
				{this.props.children}
			</div>
		);
	}
}
