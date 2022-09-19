import React from "react";

import dark from "Assets/images/logos/dark.svg";
import light from "Assets/images/logos/light.svg";
import ThemeMode, { EThemeModeType } from "Stores/ThemeMode";

type IProps = {};

type IState = {
	theme: EThemeModeType;
};

export default class Logo extends React.Component<IProps, IState> {
	private removeOnSwitch = () => {};

	constructor(props: IProps) {
		super(props);
		this.state = {
			theme: ThemeMode.getInstance().type,
		};
	}

	public render(): JSX.Element {
		return <img alt="logo" src={this.getSrc()} height="100%" />;
	}

	public componentDidMount() {
		this.removeOnSwitch = ThemeMode.getInstance().onSwitch((theme) => this.setState({ theme }));
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
	}

	private getSrc() {
		if (this.state.theme === EThemeModeType.LIGHT) return light;
		return dark;
	}
}
