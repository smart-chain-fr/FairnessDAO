import {ReactComponent as Logo} from "Assets/images/logos/simple.svg";
import React from "react";
import ThemeMode, { EThemeModeType } from "Stores/ThemeMode";


type IProps = {
	width: number;
	height: number;
	marginRight?: number;
	marginLeft?: number;
};

type IState = {
	theme: EThemeModeType;
};

export default class TokenSymbol extends React.Component<IProps, IState> {

	private removeOnSwitch = () => { };

	constructor(props: IProps) {
		super(props);
		this.state = {
			theme: ThemeMode.getInstance().type
		}
	}

	public render(): JSX.Element {
		return (
			<Logo 
			width={this.props.width}
			height={this.props.height}
			style={{marginRight:this.props.marginRight, marginLeft: this.props.marginLeft}}
			stroke={this.getColor()}
			/>
		);
	}

	public componentDidMount() {
		this.removeOnSwitch = ThemeMode.getInstance().onSwitch((theme) => this.setState({ theme }))
	}

	public componentWillUnmount() {
		this.removeOnSwitch()
	}

	private getColor() {
		let colorLight: string = "#4535FF"
		let colorDark: string = "#FFFFFF"
		if (this.state.theme === EThemeModeType.LIGHT) return colorLight
		return colorDark
	}

}

