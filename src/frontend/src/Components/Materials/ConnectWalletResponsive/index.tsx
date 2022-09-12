import React from "react";

import Button from "Components/Elements/Button";
import Wallet, { IWallet } from "Stores/Wallet";
import LogoutButton from "../LogoutButton";
import classes from "./classes.module.scss";
import I18n from "../I18n";

type IProps = {
	onClick?: () => void;
};
type IState = {
	userAddress: string | null;
};

export default class ConnectWallet extends React.Component<IProps, IState> {
	private removeOnChange = () => {};

	constructor(props: IProps) {
		super(props);
		this.state = {
			userAddress: Wallet.getInstance().walletData?.userAddress ?? null,
		};
	}

	public render(): JSX.Element {
		const isConnected = !!this.state.userAddress;
		return (
			<div className={classes["root"]}>
				{!isConnected && (
					<Button sizing="s" variant="primary" onClick={() => this.connect()}>
						<I18n map="general_text.connect_wallet"/>
					</Button>
				)}
				{isConnected && <LogoutButton />}
			</div>
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
