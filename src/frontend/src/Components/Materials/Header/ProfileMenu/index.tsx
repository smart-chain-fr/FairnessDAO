import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as AuctionsImg } from "Assets/images/icons/auctions.svg";
import { ReactComponent as FavoritesImg } from "Assets/images/icons/favorites.svg";
import { ReactComponent as CollectionsImg } from "Assets/images/icons/my_collections.svg";
import { ReactComponent as OffersImg } from "Assets/images/icons/offers.svg";
import { ReactComponent as ProfileImg } from "Assets/images/icons/profile-second.svg";
import { ReactComponent as SalesHistoryImg } from "Assets/images/icons/sales_history.svg";
import { ReactComponent as ReservationsImg } from "Assets/images/icons/reservations.svg";

import { ReactComponent as HomeImg } from "Assets/images/icons/home.svg";
import { ReactComponent as MarketplaceImg } from "Assets/images/icons/marketplace.svg";
import { ReactComponent as ResourcesImg } from "Assets/images/icons/resources.svg";
import { ReactComponent as ProfileAddressImg } from "Assets/images/icons/profile.svg";
import { ReactComponent as LotteryImg } from "Assets/images/icons/lottery.svg";

import ProfileMenuStatus, { EOpeningState } from "Stores/ProfileMenuStatus";
import Wallet, { IWallet } from "Stores/Wallet";

import LogoutButton from "../../LogoutButton";
import ThemeModeSwitcher from "../../ThemeModeSwitcher";
import classes from "./classes.module.scss";
import WindowStore from "Stores/WindowStore";
import Module from "Components/Materials/Module";
import I18n from "Components/Materials/I18n";
import PassKyc from "Components/Elements/PassKyc";
import WalletAddressShort from "Components/Materials/WalletAddressShort.tsx";

type IState = {
	status: EOpeningState;
	useraddress: string | null;
};
type IProps = {};

export default class ProfileMenu extends React.Component<IProps, IState> {
	private removeOnSwitch = () => {};
	private removeOnClick = () => {};
	private removeOnWalletChange = () => {};

	private ref: React.RefObject<HTMLDivElement>;

	public constructor(props: IProps) {
		super(props);
		this.state = {
			status: ProfileMenuStatus.getInstance().status,
			useraddress: Wallet.getInstance().walletData?.userAddress ?? null,
		};

		this.ref = React.createRef();
	}

	public render(): JSX.Element {
		const config = Module.config;
		const isConnected = !!this.state.useraddress;
		return (
			<div className={classes["root"]} {...this.state} ref={this.ref}>
				{/* {config.Kyc.enabled && <PassKyc />}
				<div className={classes["links-container-mobile"]}>
					{isConnected && (
						<>
							<div className={classes["link"]}>
								<ProfileAddressImg />
								<WalletAddressShort />
							</div>
							<div className={classes["separator-mobile"]} />
						</>
					)}
				</div>
				<div className={classes["links-container-mobile"]}>
					{this.getLinkElement(<HomeImg />, <I18n map="pages_title.home" />, "/")}
					{this.getLinkElement(<MarketplaceImg />, <I18n map="pages_title.marketplace" />, "/")}
					{this.getLinkElement(<ResourcesImg />, <I18n map="pages_title.resources" />, "/")}
					{this.getLinkElement(<LotteryImg />, <I18n map="pages_title.lottery" />, "/")}
				</div>
				<div className={classes["separator-mobile"]} />
				{isConnected && (
					<>
						<div className={classes["links-container"]}>
							{this.getLinkElement(<ProfileImg />, <I18n map="components.header_menu.profile" />, config.pages.Profile.props.path)}
							{this.getLinkElement(<CollectionsImg />, <I18n map="components.header_menu.my_collections" />, "/")}
							{this.getLinkElement(<FavoritesImg />, <I18n map="components.header_menu.favorites" />, "/")}
							{this.getLinkElement(<OffersImg />, <I18n map="components.header_menu.offers" />, "/")}
							{this.getLinkElement(<AuctionsImg />, <I18n map="components.header_menu.auctions" />, "/")}
							{this.getLinkElement(<SalesHistoryImg />, <I18n map="components.header_menu.sales_history" />, "/")}
							{config.pages.Reservations.enabled && this.getLinkElement(<ReservationsImg />, <I18n map="components.header_menu.reservations" />, "/")}
						</div>
						<div className={classes["separator"]} />
					</>
				)} */}
				<div>
					{/* <ThemeModeSwitcher /> */}
					<LogoutButton />
				</div>
			</div>
		);
	}

	public componentDidMount() {
		this.removeOnClick = WindowStore.getInstance().onClick((e: MouseEvent) => this.handleClickOutside(e));
		this.removeOnSwitch = ProfileMenuStatus.getInstance().onSwitch((type) => this.updateStatus());
		this.removeOnWalletChange = Wallet.getInstance().onChange((web3Event: IWallet | null) => this.onWalletChange(web3Event));
	}

	public componentWillUnmount() {
		this.removeOnClick();
		this.removeOnSwitch();
		this.removeOnWalletChange();
	}

	private handleClickOutside(event: MouseEvent) {
		if (!this.ref.current?.contains(event.target as Node)) ProfileMenuStatus.getInstance().close();
	}

	private onWalletChange(walletData: IWallet | null) {
		this.setState({
			useraddress: walletData?.userAddress ?? null,
		});
	}

	private updateStatus() {
		this.setState({
			status: ProfileMenuStatus.getInstance().status,
		});
	}

	private getLinkElement(icon: JSX.Element, label: JSX.Element | string, url: string): JSX.Element {
		return (
			<Link to={url} className={classes["link"]}>
				{icon}
				{label}
			</Link>
		);
	}
}
