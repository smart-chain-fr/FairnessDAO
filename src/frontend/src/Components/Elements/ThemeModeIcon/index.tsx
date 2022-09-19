import lightPrimary from "Assets/images/icons/light-mode-icon-primary.svg";
import darkPrimary from "Assets/images/icons/dark-mode-icon-primary.svg"
import lightSecondary from "Assets/images/icons/light-mode-icon-secondary.svg";
import darkSecondary from "Assets/images/icons/dark-mode-icon-secondary.svg"
import React from "react";
import ThemeMode, { EThemeModeType } from "Stores/ThemeMode";

type IProps = {
	onClick?: () => void;
	variant: "primary" | "secondary"
};

type IState = {
	theme: EThemeModeType;
};

export default class ThemeModeIcon extends React.Component<IProps, IState> {
	private removeOnSwitch = () => { };

	constructor(props: IProps) {
		super(props);
		this.state = {
			theme: ThemeMode.getInstance().type,
		};
	}

	public render(): JSX.Element {
		return <img {...this.props} style={{ cursor: "pointer" }} alt="theme-mode-icon" src={this.getSrc()} />;
	}

	public componentDidMount() {
		this.removeOnSwitch = ThemeMode.getInstance().onSwitch((theme) => this.setState({ theme }));
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
	}

	private getSrc() {
		if (this.props.variant === "primary") {
			if (this.state.theme === EThemeModeType.LIGHT) return lightPrimary;
			return darkPrimary;
		}

		if (this.state.theme === EThemeModeType.LIGHT) return lightSecondary;
		return darkSecondary;
	}
}
