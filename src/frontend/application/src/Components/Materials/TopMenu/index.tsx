import React from "react";
import { Link } from "react-router-dom";

import TopMenuStatus, { EOpeningState } from "../../../Stores/TopMenuStatus";
import ThemeModeSwitcher from "../ThemeModeSwitcher";
import classes from "./classes.module.scss";
import { ReactComponent as AuctionsImg } from "assets/images/icons/auctions.svg";
import { ReactComponent as FavoritesImg } from "assets/images/icons/favorites.svg";
import { ReactComponent as CollectionsImg } from "assets/images/icons/my_collections.svg";
import { ReactComponent as OffersImg } from "assets/images/icons/offers.svg";
import { ReactComponent as ProfileMobile } from "assets/images/icons/profile-second.svg";
import { ReactComponent as SalesHistoryImg } from "assets/images/icons/sales_history.svg";
import { ReactComponent as HomeImg } from "assets/images/icons/home.svg";
import { ReactComponent as MarketplaceImg } from "assets/images/icons/marketplace.svg";
import { ReactComponent as ResourcesImg } from "assets/images/icons/resources.svg";
import { ReactComponent as ProfileImg } from "assets/images/icons/profile.svg";
import Button from "Components/Elements/Button";
import ConnectWalletResponsive from "../ConnectWalletResponsive";
import SearchResults from "../SearchResults";
import I18n from "../I18n";
import Wallet, { IWallet } from "Stores/Wallet";
import WalletAddressShort from "../WalletAddressShort.tsx";
type IState = {
	status: EOpeningState;
	useraddress: string | null;
};
type IProps = {};

export default class TopMenu extends React.Component<IProps, IState> {
	private removeOnSwitch = () => {};
	private removeOnWalletChange = () => {};

	public constructor(props: IProps) {
		super(props);
		this.state = {
			status: TopMenuStatus.getInstance().status,
			useraddress: Wallet.getInstance().walletData?.userAddress ?? null,
		};
	}

	public render(): JSX.Element {
		const isConnected = !!this.state.useraddress;
		return (
			<div className={classes["root"]} {...this.state}>
				<div className={classes["nav"]}>
					{this.getLinkElement(<HomeImg />, <I18n map="pages_title.home" />, "/")}
					{this.getLinkElement(<MarketplaceImg />, <I18n map="pages_title.marketplace" />, "/")}
					{this.getLinkElement(<ResourcesImg />, <I18n map="pages_title.resources" />, "/")}
					{isConnected && (
						<>
							<div className={classes["link-image-container"]}>
								<ProfileImg />
								<WalletAddressShort />
							</div>
							<div className={classes["separator"]} />
						</>
					)}
					{isConnected && (
						<>
							{this.getLinkElement(<ProfileMobile />, <I18n map="components.header_menu.profile" />, "/")}
							{this.getLinkElement(<CollectionsImg />, <I18n map="components.header_menu.my_collections" />, "/")}
							{this.getLinkElement(<FavoritesImg />, <I18n map="components.header_menu.favorites" />, "/")}
							{this.getLinkElement(<OffersImg />, <I18n map="components.header_menu.offers" />, "/")}
							{this.getLinkElement(<AuctionsImg />, <I18n map="components.header_menu.auctions" />, "/")}
							{this.getLinkElement(<SalesHistoryImg />, <I18n map="components.header_menu.sales_history" />, "/")}
							<div className={classes["btn-container"]}>
								<Button sizing="s" variant="ghost">
									<I18n map="general_text.create_collection" />
								</Button>
							</div>
						</>
					)}
					<div className={classes["separator"]} />
					<div className={classes["nav-bottom"]}>
						<ThemeModeSwitcher />
						{isConnected && (
							<div className={classes["btn-container-tablet"]}>
								<Button sizing="s" variant="ghost">
									<I18n map="general_text.create_collection" />
								</Button>
							</div>
						)}
						<ConnectWalletResponsive />
					</div>
				</div>
				<SearchResults />
				<div className={classes["shadow"]} onClick={() => TopMenuStatus.getInstance().close()} />
			</div>
		);
	}

	public componentDidMount() {
		this.removeOnSwitch = TopMenuStatus.getInstance().onSwitch((type) => {
			this.updateStatus();
		});
		this.removeOnWalletChange = Wallet.getInstance().onChange((web3Event: IWallet | null) => this.onWalletChange(web3Event));
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
		this.removeOnWalletChange();
	}

	private updateStatus() {
		document.body.setAttribute("top-menu-status", TopMenuStatus.getInstance().status);
		this.setState({
			status: TopMenuStatus.getInstance().status,
		});
	}

	private onWalletChange(walletData: IWallet | null) {
		this.setState({
			useraddress: walletData?.userAddress ?? null,
		});
	}

	private getLinkElement(icon: JSX.Element, label: string | JSX.Element, url: string): JSX.Element {
		return (
			<div className={classes["link-image-container"]}>
				{icon}
				<Link to={url} className={classes["link"]}>
					{label}
				</Link>
			</div>
		);
	}
}
