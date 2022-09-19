import React from "react";
import Wallet, { IWallet } from "Stores/Wallet";
import { ReactComponent as LogOutImg } from "Assets/images/icons/log_out.svg";
import classes from "./classes.module.scss";
import ProfileMenuStatus from "Stores/ProfileMenuStatus";
import I18n from "../I18n";
import Button from "Components/Elements/Button";
type IState = {
	useraddress: string | null;
};

type IProps = {};

export default class LogoutButton extends React.Component<IProps, IState> {
	private removeOnSwitch = () => {};

	public constructor(props: IProps) {
		super(props);
		this.state = {
			useraddress: Wallet.getInstance().walletData?.userAddress ?? null,
		};
	}

	public render(): JSX.Element {
		const isConnected = !!this.state.useraddress;
		if (isConnected) {
			return (
				<div
					className={classes["root"]}
					onClick={() => {
						ProfileMenuStatus.getInstance().close();
						this.disconnectWallet();
					}}>
					<LogOutImg />
					<span>
						<I18n map="components.header_menu.logout" />
					</span>
				</div>
			);
		} else {
			return (
				<div className={classes["root"]} data-type="connect">
					<Button sizing="s" variant="primary" onClick={() => this.connect()}>
						<I18n map="general_text.connect_wallet" />
					</Button>
				</div>
			);
		}
	}

	public componentDidMount() {
		this.removeOnSwitch = Wallet.getInstance().onChange((web3Event: IWallet | null) => this.onWalletChange(web3Event));
	}

	private onWalletChange(walletData: IWallet | null) {
		this.setState({
			useraddress: walletData?.userAddress ?? null,
		});
	}

	private async connect(): Promise<void> {
		Wallet.getInstance().connect();
	}

	public componentWillUnmount() {
		this.removeOnSwitch();
	}

	private async disconnectWallet() {
		Wallet.getInstance().disconnect();
	}
}
