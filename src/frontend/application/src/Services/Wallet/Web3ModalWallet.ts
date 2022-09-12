import Torus from "@toruslabs/torus-embed";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BigNumber, ethers } from "ethers";
import { EventEmitter } from "events";
import Web3Modal from "web3modal";

import ThemeMode from "Stores/ThemeMode";
import BaseWallet from "./BaseWallet";
import Config from "Configs/Config";

export interface IWallet {
	userAddress: string | null;
	balance: BigNumber | null;
	chainId: number | null;
	provider: ethers.providers.Web3Provider | null
}

export default class Web3ModalWallet extends BaseWallet {
	private static ctx: Web3ModalWallet;
	private static web3Modal: Web3Modal;
	private removeEvents = () => {};

	private _web3WalletData: IWallet | null = null;
	private readonly event = new EventEmitter();

	private static readonly providerOptions = {
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				infuraId: Config.getInstance().get().wallet.infuraId,
			},
		},
		torus: {
			package: Torus,
		},
		binancechainwallet: {
			package: true,
		},
	};

	constructor() {
		super();
		if (Web3ModalWallet.ctx) return Web3ModalWallet.ctx;
		Web3ModalWallet.ctx = this;
		return Web3ModalWallet.ctx;
	}

	public get web3WalletData() {
		return this._web3WalletData;
	}

	public static getInstance() {
		if (!Web3ModalWallet.ctx) new this();
		return Web3ModalWallet.ctx;
	}

	public onChange(callback: (web3WalletData: IWallet) => void) {
		this.event.on("web3modal-change", callback);
		return () => {
			this.event.off("web3modal-change", callback);
		};
	}

	private async changed(provider: ethers.providers.Web3Provider | null) {
		const userAddress: string | null = (await provider?.listAccounts())?.[0] ?? null;
		const balance: BigNumber | null = userAddress ? (await provider?.getBalance(userAddress)) ?? null : null;
		const web3Event: IWallet = {
			userAddress: userAddress,
			chainId: (await provider?.getNetwork())?.chainId ?? null,
			balance: balance,
			provider
		};
		this._web3WalletData = web3Event;
		this.event.emit("web3modal-change", web3Event);
	}

	private static getWeb3Modal() {
		if (Web3ModalWallet.web3Modal) return Web3ModalWallet.web3Modal;
		Web3ModalWallet.web3Modal = Web3ModalWallet.newWeb3Modal();

		return Web3ModalWallet.web3Modal;
	}

	public async connect(): Promise<Web3ModalWallet> {
		try {
			const instance = await Web3ModalWallet.getWeb3Modal().connect();
			const provider = new ethers.providers.Web3Provider(instance, "any");
			this.initEvents(instance, provider);
			if (!provider) throw new Error("provider not found");
			this.changed(provider);
		} catch (e) {
			console.warn(e);
		}

		return this;
	}

	public disconnect() {
		try {
			this._web3WalletData = null;
			Web3ModalWallet.getWeb3Modal().clearCachedProvider();
			this.changed(null);
			this.removeEvents();
			return;
		} catch (e) {
			console.warn(e);
		}
	}

	private static newWeb3Modal() {
		return new Web3Modal({
			network: Config.getInstance().get().wallet.network,
			cacheProvider: true,
			providerOptions: Web3ModalWallet.providerOptions,
			theme: ThemeMode.getInstance().type,
		});
	}

	private initEvents(instance: any | null, provider: ethers.providers.Web3Provider | null): void {
		this.removeEvents();
		const anyChanged = () => {
			this.changed(provider);
		};

		instance.on("accountsChanged", anyChanged);
		instance.on("chainChanged", anyChanged);
		instance.on("connect", anyChanged);
		instance.on("disconnect", anyChanged);
		this.removeEvents = () => {
			if (instance.removeAllListeners) {
				instance.removeAllListeners();
			}
		};
	}
}
