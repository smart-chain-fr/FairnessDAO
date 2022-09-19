import React from "react";
import classes from "./classes.module.scss";
import Button from "Components/Elements/Button";

import { ReactComponent as RightArrow } from "Assets/images/icons/arrow-right.svg";
import { ReactComponent as Cross } from "Assets/images/icons/cross.svg";

type IProps = {
	text: "Accept" | "Cancel";
	size?: "m" | "s" | "l" | "xl" | undefined;
};
type IState = {
	size: "m" | "s" | "l" | "xl" | undefined;
};

export default class ButtonElement extends React.Component<IProps, IState> {
	public constructor(props: IProps) {
		super(props);
		this.props.size
			? (this.state = {
					size: this.props.size,
			  })
			: (this.state = {
					size: "m",
			  });
	}

	public render(): JSX.Element {
		switch (this.props.text) {
			case "Accept":
				return (
					<Button sizing={this.state.size}>
						{this.props.text}
						<RightArrow className={classes["right-arrow"]} />
					</Button >
				);
			case "Cancel":
				return (
					<Button sizing={this.state.size} variant="ghost">
						<Cross className={classes["cross"]}/>
						{this.props.text}
					</Button>
				);
			default:
				break;
		}
		return <Button sizing={this.state.size}>Error</Button>;

	}
}

