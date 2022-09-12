import React from "react";

import ProfileImg from "assets/images/icons/profile.svg";
import Button from "Components/Elements/Button";
import ProfileMenuStatus from "Stores/ProfileMenuStatus";
import Wallet, { IWallet } from "Stores/Wallet";

import WalletAddressShort from "../WalletAddressShort.tsx";
import classes from "./classes.module.scss";
import I18n from "../I18n";
import ThemeModeSwitcher from "../ThemeModeSwitcher";

type IProps = {
	onClick?: () => void;
};
type IState = {
	userAddress: string | null;
};

export default class ConnectWallet extends React.Component<IProps, IState> {
	private removeOnChange = () => { };

	constructor(props: IProps) {
		super(props);
		this.state = {
			userAddress: Wallet.getInstance().walletData?.userAddress ?? null,
		};
	}

	public render(): JSX.Element {
		const isConnected = !!this.state.userAddress;
		return (
			<>
				{!isConnected && (
					<>
						<ThemeModeSwitcher variant="secondary" />
						<Button sizing="s" variant="primary" onClick={() => this.connect()}>
							<I18n map="general_text.connect_wallet" />
						</Button>
					</>

				)}
				{isConnected && (
					<>
						<Button variant="ghost" sizing="s">
							<I18n map={"general_text.create_collection"} />
						</Button>
						<div className={classes["profile-container"]}>
							<WalletAddressShort />
							<img
								src={ProfileImg}
								className={classes["profile-button"]}
								alt=""
								height="24px"
								onClick={() => ProfileMenuStatus.getInstance().toggle()}
							/>
						</div>


					</>
				)}
			</>
		);
	}

	public componentDidMount() {
		this.removeOnChange = Wallet.getInstance().onChange((web3Event: IWallet | null) => this.onChange(web3Event));
	}

	public componentWillUnmount() {
		this.removeOnChange();
	}

	private async connect(): Promise<void> {
		Wallet.getInstance().connect();
	}

	private onChange(walletData: IWallet | null) {
		this.setState({
			userAddress: walletData?.userAddress ?? null,
		});
	}
}
