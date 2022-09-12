import React from "react";
import classes from "./classes.module.scss";

import { ReactComponent as Cross } from "assets/images/icons/tag_cross.svg"
import Tags from "Stores/Tags";

type IProps = {
	onClick?: () => void;
	variant?: "closeable_tag" | "status";
	value: string;
};

type IState = {
	disabled: boolean
};

export default class Tag extends React.Component<IProps, IState> {
	static defaultProps: IProps = {
		variant: "closeable_tag",
		value: ""
	};

	constructor(props: IProps) {
		super(props);
		this.state = {
			disabled: false
		}
	}

	public render(): JSX.Element {
		return (
			<>
				{this.props.variant === 'closeable_tag' ?
					<button  {...this.props}
						onClick={() => { this.removeTag(this.props.value) }}
						className={classes["root"]}>
						<span {...this.props} className={classes["tag-cross"]}>{this.props.value}<Cross /></span>
					</button> :
					<button {...this.props}
						onClick={() => { this.addTag(this.props.value) }}
						className={classes["root"]}>
						{this.props.value}
					</button>
				}
			</>
		);
	}

	private removeTag(label: string) {
		Tags.getInstance().removeTag(label)
	}

	private addTag(label: string) {
		Tags.getInstance().addTag(label)
	}
}
