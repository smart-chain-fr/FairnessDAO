import AddressShortElement from "Components/Elements/AddressShort";
import CopyClipboard from "Components/Elements/CopyClipboard";
import React from "react";
import Wallet, { IWallet } from "Stores/Wallet";

type IProps = {};
type IState = {
	walletData: IWallet | null;
};

export default class WalletAddressShort extends React.Component<IProps, IState> {
	private removeOnChange = () => { };

	constructor(props: IProps) {
		super(props);
		this.state = {
			walletData: Wallet.getInstance().walletData,
		};
	}

	public render(): JSX.Element | null {
		if (!this.state.walletData?.userAddress) return null;
		return (
			<CopyClipboard value={this.state.walletData?.userAddress}>
				<AddressShortElement text={this.state.walletData?.userAddress} />
			</CopyClipboard>
		);
	}

	public componentDidMount() {
		this.removeOnChange = Wallet.getInstance().onChange((walletData) => this.onUserConnect(walletData));
	}

	public componentWillUnmount() {
		this.removeOnChange();
	}

	private onUserConnect(walletData: IWallet) {
		this.setState({ walletData });
	}
}
