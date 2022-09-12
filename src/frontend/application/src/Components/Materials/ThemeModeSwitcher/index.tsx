import React from "react";

import ThemeMode, { EThemeModeType } from "Stores/ThemeMode";

import classes from "./classes.module.scss";
import Mode from "Components/Elements/Mode";
import I18n from "../I18n";
import ThemeModeIcon from "Components/Elements/ThemeModeIcon";

type IState = {
	status: EThemeModeType;
};
type IProps = {
	variant: "primary" | "secondary"
};
export default class ThemeModeSwitcher extends React.Component<IProps, IState> {
	private removeOnSwitch = () => { };

	static defaultProps: IProps = {
		variant: "primary",
	};


	public constructor(props: IProps) {
		super(props);
		this.updateStatus();
		this.state = {
			status: ThemeMode.getInstance().type,
		};
	}

	public render(): JSX.Element {
		return (<>
			{this.props.variant === "primary" &&
				<div {...this.props} className={classes["root"]} onClick={() => this.toggle()}>
					<div className={classes["first-part"]}>
						<ThemeModeIcon variant={this.props.variant}  />
						<I18n map="components.header_menu.darkmode" />
					</div>
					<div className={classes["second-part"]}>
						<Mode active={ThemeMode.getInstance().type} />
					</div>
				</div>
			}
			{this.props.variant === "secondary" && <ThemeModeIcon variant={this.props.variant} onClick={() => this.toggle()} />}
		</>
		);
	}

	private toggle(): void {
		ThemeMode.getInstance().toggle();
	}

	private updateStatus() {
		this.setState({
			status: ThemeMode.getInstance().type,
		});
	}

	public componentDidMount() {
		this.removeOnSwitch = ThemeMode.getInstance().onSwitch((type) => {
			this.updateStatus();
		});
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
	}
}
