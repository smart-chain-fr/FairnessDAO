import React from "react";
import classes from "./classes.module.scss";

type IProps = {
	onClick?: () => void;
	value: string;
};
type IState = {};

export default class CopyClipboard extends React.Component<IProps, IState> {
	public render(): JSX.Element {
		return (
			<span className={classes["root"]} onClick={(e) => this.onClick(e)}>
				{this.props.children}
			</span>
		);
	}

	private async onClick(e: React.MouseEvent<HTMLSpanElement>) {
		e.preventDefault();
		e.stopPropagation();
		await navigator.clipboard.writeText(this.props.value);
	}
}
