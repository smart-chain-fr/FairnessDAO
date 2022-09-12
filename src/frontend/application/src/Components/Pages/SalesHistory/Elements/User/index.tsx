import React from "react";
import classes from "./classes.module.scss";

type IProps = {
	userName:string
};
type IState = {};

export default class User extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<div className={classes["root"]}>
				{this.props.userName}
			</div>
		);
	}

}
