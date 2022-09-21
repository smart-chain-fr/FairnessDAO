import React from "react";
import { Link, NavLink } from "react-router-dom";

import Logo from "Components/Materials/Logo";
import WindowStore from "Stores/WindowStore";

import ConnectWallet from "../ConnectWallet";
import classes from "./classes.module.scss";
import ProfileMenu from "./ProfileMenu";
import SearchBar from "./SearchBar";
import Module from "../Module";
import MenuBurger from "./MenuBurger";
import TopMenuStatus, { EOpeningState } from "../../../Stores/TopMenuStatus";
import TopSearchBarStatus from "Stores/TopSearchBar";
import I18n from "../I18n";

type IState = {
	open: 1 | 0 | -1;
	topMenu: EOpeningState;
	topSearchBar: EOpeningState;
};
type IProps = {};
export default class Header extends React.Component<IProps, IState> {
	private onScrollYDirectionChange = () => {};
	private removeOnSwitchTopMenu = () => {};
	private removeOnSwitchSearchBar = () => {};

	constructor(props: IProps) {
		super(props);

		this.state = {
			open: 0,
			topMenu: TopMenuStatus.getInstance().status,
			topSearchBar: TopSearchBarStatus.getInstance().status,
		};
	}

	public render(): JSX.Element {
		const pageConfig = Module.config.pages;
		return (
			<header className={classes["root"]} data-top-menu={this.state.topMenu !== EOpeningState.CLOSED || this.state.topSearchBar !== EOpeningState.CLOSED}>
				<div className={classes["content-desktop"]}>
					<div className={classes["segments"]}>
						<div className={[classes["segment"], classes["segment-left"]].join(" ")}>
							<Module from={Module.config.Logo}>
								<Link className={classes["logo"]} to={Module.config.Logo.props.url}>
									{/* <Logo /> */}
									<div className={classes["title"]}>FairnessDAO</div>
								</Link>
							</Module>
						</div>

						<div className={[classes["segment"], classes["segment-right"]].join(" ")}>
							<Module from={pageConfig.Faucet}>
								<NavLink className={(navData) => this.activeLink(navData.isActive)} to={pageConfig.Faucet.props.path}>
									<I18n map={"pages_title.".concat(pageConfig.Faucet.props.labelKey)} />
								</NavLink>
							</Module>
							<Module from={pageConfig.DaoListProposals}>
								<NavLink className={(navData) => this.activeLink(navData.isActive)} to={pageConfig.DaoListProposals.props.path}>
									<I18n map={"pages_title.".concat(pageConfig.DaoListProposals.props.labelKey)} />
								</NavLink>
							</Module>
							<Module from={pageConfig.Staking}>
								<NavLink className={(navData) => this.activeLink(navData.isActive)} to={pageConfig.Staking.props.path}>
									<I18n map={"pages_title.".concat(pageConfig.Staking.props.labelKey)} />
								</NavLink>
							</Module>
							<ConnectWallet />
						</div>
					</div>
					<ProfileMenu />
				</div>
				<div className={classes["content-mobile"]}>
					{this.state.topSearchBar === EOpeningState.CLOSED && (
						<Module from={Module.config.Logo}>
							<Link className={classes["logo"]} to={Module.config.Logo.props.url}>
								<Logo />
							</Link>
						</Module>
					)}
					<div className={classes["content-mobile-right"]}>
						<SearchBar />
						{this.state.topSearchBar === EOpeningState.CLOSED && <MenuBurger />}
					</div>
					<ProfileMenu />
				</div>
			</header>
		);
	}

	public componentDidMount() {
		this.onScrollYDirectionChange = WindowStore.getInstance().onScrollYDirectionChange((scrollYDirection) => this.visibility(scrollYDirection));

		this.removeOnSwitchTopMenu = TopMenuStatus.getInstance().onSwitch(() => this.updateStatus());
		this.removeOnSwitchSearchBar = TopSearchBarStatus.getInstance().onSwitch(() => this.updateStatus());
	}

	public componentWillUnmount() {
		this.onScrollYDirectionChange();
		this.removeOnSwitchTopMenu();
		this.removeOnSwitchSearchBar();
	}

	private updateStatus() {
		this.setState({
			topMenu: TopMenuStatus.getInstance().status,
			topSearchBar: TopSearchBarStatus.getInstance().status,
		});
	}

	private visibility(scrollYDirection: number) {
		let open: IState["open"] = 1;
		if (window.scrollY > 50 && scrollYDirection < 0 && Math.abs(scrollYDirection) > 8) {
			open = -1;
		}

		if (open !== this.state.open) this.setState({ open });
	}

	private activeLink(isActive: boolean) {
		return isActive ? [classes["route"], classes["active-route"]].join(" ") : classes["route"];
	}
}

