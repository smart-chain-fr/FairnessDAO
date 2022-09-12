import React from "react";

import classes from "./classes.module.scss";

type IProps = {
	className?: string
};
type IState = {};

export default class CheckBox extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<label className={classes["fav-container"]}>
				<input type='checkbox' className={classes["fav-checkbox"]} />
				{this.props.children}
			</label>
		);
	}

}
