import React from "react";
import classes from "./classes.module.scss";
import Button from "Components/Elements/Button";

import { ReactComponent as ArrowLeftUp } from "assets/images/icons/arrow-leftUp.svg";
import { ReactComponent as RightArrow } from "assets/images/icons/arrow-right.svg";
import { ReactComponent as ArrowBull } from "assets/images/icons/arrow-bull.svg";

type IProps = {
	text: "Re-bid" | "Finalize" | "Top bid"| "";
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
			case "Re-bid":
				return (
					<Button sizing={this.state.size} variant="ghost">
						{this.props.text}
						<ArrowLeftUp className={classes["left-up-arrow"]} />
					</Button>
				);
			case "Finalize":
				return (
					<Button sizing={this.state.size} >
						{this.props.text}
						<RightArrow className={classes["right-arrow"]} />
					</Button>
				);
			case "Top bid":
				return (
					<Button sizing={this.state.size} variant="ghost" disabled>
						{this.props.text}
						<ArrowBull className={classes["bull-arrow"]} />
					</Button>
				);
			default:
				break;
		}
		return <Button sizing={this.state.size}>Error</Button>;
	}
}

