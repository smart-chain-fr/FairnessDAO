import React from "react";

import ProfileMenuStatus, { EOpeningState } from "Stores/ProfileMenuStatus";
import classes from "./classes.module.scss";
type IState = {
	status: EOpeningState;
};
type IProps = {};

export default class TopMenu extends React.Component<IProps, IState> {
	private removeOnSwitch = () => {};

	public constructor(props: IProps) {
		super(props);
		this.state = {
			status: ProfileMenuStatus.getInstance().status,
		};
	}

	public render() {
		if (this.state.status === EOpeningState.OPENED) {
			return <div className={classes["root"]}></div>;
		}
		return <div></div>;
	}

	public componentDidMount() {
		this.removeOnSwitch = ProfileMenuStatus.getInstance().onSwitch((type) => {
			this.updateStatus();
		});
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
	}

	private updateStatus() {
		this.setState({
			status: ProfileMenuStatus.getInstance().status,
		});
	}
}
