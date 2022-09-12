import Config from "Configs/Config";
import React from "react";

import Wallet, { IWallet } from "Stores/Wallet";
import I18n from "../I18n";

import classes from "./classes.module.scss";

type IProps = {};
type IState = {
	walletData: IWallet | null;
	showing: boolean;
};
export default class WrongChain extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		const walletData = Wallet.getInstance().walletData;
		this.state = {
			walletData,
			showing: this.isUserConnected(walletData) && !this.isOnRightChain(walletData),
		};
	}

	public render(): JSX.Element {
		return (
			<div className={classes["root"]} data-visible={this.state.showing.toString()}>
				<div className={classes["root-container"]}>
					<div className={classes["warning-container"]}>Warning</div>
					<p className={classes["wrongchain-text"]}>
						<I18n map="general_text.wrong_blockchain" vars={{ config_wallet_network: Config.getInstance().get().wallet.network }} />
					</p>
				</div>
			</div>
		);
	}

	public componentDidMount() {
		this.removeOnChange = Wallet.getInstance().onChange((walletData) => this.onUserConnect(walletData));
	}

	public componentWillUnmount() {
		this.removeOnChange();
	}

	private onUserConnect(walletData: IWallet) {
		this.setState({ walletData, showing: this.isUserConnected(walletData) && !this.isOnRightChain(walletData) });
	}

	private removeOnChange = () => {};

	private isOnRightChain(walletData: IWallet | null): boolean {
		const rightChain = Config.getInstance().get().wallet.chainId;
		const actualChain = walletData?.chainId;

		return rightChain === actualChain;
	}

	private isUserConnected(walletData: IWallet | null) {
		return !!walletData?.userAddress;
	}
}
