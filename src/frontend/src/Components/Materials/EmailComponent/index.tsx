import Button from "Components/Elements/Button";
import React from "react";
import classes from "./classes.module.scss";

type IProps = {
	placeholder: string;
	textButton: string;
};

export default class EmailComponent extends React.Component<IProps> {
	public render(): JSX.Element | null {
		return (
			<div className={classes["root"]}>
				<input className={classes["input"]} placeholder={this.props.placeholder} />
				<Button variant="primary" sizing="s">
					{this.props.textButton}
				</Button>
			</div>
		);
	}
}
