import React from "react";
import { ReactComponent as GlassMobile } from "assets/images/icons/glass-mobile.svg";
import TopSearchBarStatus, { EOpeningState } from "Stores/TopSearchBar";
import classes from "./classes.module.scss";
type IState = {
	status: EOpeningState;
};
type IProps = {};

export default class MenuBurger extends React.Component<IProps, IState> {
	private removeOnSwitch = () => {};

	constructor(props: IProps) {
		super(props);
		this.state = {
			status: TopSearchBarStatus.getInstance().status,
		};
	}

	public render(): JSX.Element {
		return (
			<span onClick={this.toggleSearchBar} className={classes["root"]}>
				<GlassMobile className={classes["icon-mobile"]} />
			</span>
		);
	}

	public componentDidMount() {
		this.removeOnSwitch = TopSearchBarStatus.getInstance().onSwitch((type) => {
			this.updateTopSearchBarStatus();
		});
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
	}

	public toggleSearchBar() {
		TopSearchBarStatus.getInstance().toggle();
	}

	public getStatus() {
		return this.state.status;
	}

	private updateTopSearchBarStatus() {
		this.setState({
			status: TopSearchBarStatus.getInstance().status,
		});
	}
}
