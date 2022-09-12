import BurgerCross from "Components/Elements/BurgerCross";
import React from "react";
import ProfileMenuStatus, { EOpeningState } from "Stores/ProfileMenuStatus";

type IState = {
	status: EOpeningState;
};
type IProps = {};

export default class MenuBurger extends React.Component<IProps, IState> {
	private removeOnSwitch = () => {};

	constructor(props: IProps) {
		super(props);
		this.state = {
			status: ProfileMenuStatus.getInstance().status,
		};
	}

	public render(): JSX.Element {
		return (
			<span onClick={this.toggleMenu}>
				<BurgerCross type={this.state.status !== EOpeningState.OPENED ? "burger" : "cross"} />
			</span>
		);
	}

	public componentDidMount() {
		this.removeOnSwitch = ProfileMenuStatus.getInstance().onSwitch((type) => {
			this.updateTopMenuStatus();
		});
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
	}

	public toggleMenu() {
		ProfileMenuStatus.getInstance().toggle();
	}

	public getStatus() {
		return this.state.status;
	}

	private updateTopMenuStatus() {
		this.setState({
			status: ProfileMenuStatus.getInstance().status,
		});
	}
}
