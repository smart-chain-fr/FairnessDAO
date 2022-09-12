import React from "react";
import classes from "./classes.module.scss";

type IProps = {
	onClick?: () => void;
	variant?: "primary" | "ghost" | "tertiary";
	sizing?: "s" | "m" | "l" | "xl" | "cube";
	disabled?: boolean;
};

type IState = {};

export default class Button extends React.Component<IProps, IState> {
	static defaultProps: IProps = {
		variant: "primary",
		disabled: false,
		sizing: "m",
	};

	public render(): JSX.Element {
		return (
			<button {...this.props} className={classes["root"]}>
				{this.props.children}
			</button>
		);
	}
}
