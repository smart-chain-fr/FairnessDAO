import { BigNumber, ethers } from "ethers";
import EthBigNumber from "Services/Wallet/EthBigNumber";
import Web3ModalWallet, { IWallet as IWeb3Wallet } from "Services/Wallet/Web3ModalWallet";
import EventService from "Services/EventEmitter";

class EventEmitter extends EventService {}
export interface IWallet {
	userAddress: string | null;
	balance: EthBigNumber | null;
	chainId: number | null;
	provider: ethers.providers.Web3Provider | null;
}

export default class Wallet {
	private static ctx: Wallet;
	private readonly event = new EventEmitter();
	private web3ModalWallet: Web3ModalWallet | null = null;

	public get walletData() {
		let balance = Wallet.bigNumberToEthBigNumber(this.web3ModalWallet?.web3WalletData?.balance ?? null);
		return {
			userAddress: this.web3ModalWallet?.web3WalletData?.userAddress ?? null,
			chainId: this.web3ModalWallet?.web3WalletData?.chainId ?? null,
			balance,
			provider: this.web3ModalWallet?.web3WalletData?.provider ?? null,
		};
	}

	private constructor() {
		Wallet.ctx = this;
		this.autoConnect();
	}

	public static getInstance(): Wallet {
		if (!Wallet.ctx) new this();
		return Wallet.ctx;
	}

	public onChange(callback: (walletData: IWallet) => void): () => void {
		this.event.on("wallet-change", callback);
		return () => {
			this.event.off("wallet-change", callback);
		};
	}

	public async connect(): Promise<void> {
		try {
			this.web3ModalWallet = await Web3ModalWallet.getInstance().connect();
			this.web3ModalWallet.onChange((web3Event) => this.changed(web3Event));
			this.changed({
				userAddress: this.walletData?.userAddress,
				chainId: this.walletData?.chainId,
				balance: this.walletData?.balance?.getBigNumber() ?? null,
				provider: this.walletData?.provider ?? null,
			});
		} catch (e) {
			console.warn(e);
		}
	}

	public disconnect(): void {
		Web3ModalWallet.getInstance().disconnect();
	}

	private autoConnect(): void {
		if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
			this.connect();
		}
	}

	private async changed(web3Wallet: IWeb3Wallet | null): Promise<void> {
		let balance = Wallet.bigNumberToEthBigNumber(web3Wallet?.balance ?? null);
		const walletData: IWallet = {
			userAddress: web3Wallet?.userAddress ?? null,
			chainId: web3Wallet?.chainId ?? null,
			balance,
			provider: web3Wallet?.provider ?? null,
		};
		this.event.emit("wallet-change", walletData);
	}

	private static bigNumberToEthBigNumber(bigNumber: BigNumber | null): EthBigNumber | null {
		let ethBigNumber: EthBigNumber | null = null;
		if (bigNumber) {
			ethBigNumber = new EthBigNumber(bigNumber);
		}
		return ethBigNumber;
	}
}
