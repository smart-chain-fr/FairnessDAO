
import { ethers } from "ethers";
import Phase from "Services/Contracts/Classes/Phase";
import SaleContract from "Services/Contracts/Classes/SaleContract";
import Services from "Services/Contracts/Services";
import EthBigNumber from "Services/Wallet/EthBigNumber";
import Wallet, { IWallet } from "Stores/Wallet";
import SaleContractAbi from "../Assets/abi/MockERC20.json";
import EventService from "Services/EventEmitter";
import Config from "Configs/Config";

class EventEmitter extends EventService {}
export type ITotalTokens = {
	lockedTokens: EthBigNumber;
	availableTokens: EthBigNumber;
};
export interface IContract {
	saleContract: SaleContract | null;
	phases: Phase[];
	activePhase: number | null;
}
export default class Contract {
	private static ctx: Contract;
	private saleContract: SaleContract | null = null;
	private phases: Phase[] = [];
	private activePhase: number | null = null;
	private readonly event = new EventEmitter();

	public get contractData(): IContract {
		return {
			saleContract: this.saleContract,
			phases: this.phases,
			activePhase: this.activePhase,
		};
	}

	private constructor() {
		this.setContractData(Wallet.getInstance().walletData);
		Contract.ctx = this;
		Wallet.getInstance().onChange(async (web3Event: IWallet) => await this.setContractData(web3Event));
	}

	public static getInstance() {
		if (!Contract.ctx) new this();
		return Contract.ctx;
	}

	public getContract() {
		return this.saleContract;
	}

	public onChange(callback: (contractData: IContract) => void) {
		this.event.on("contract-change", callback);
		return () => {
			this.event.off("contract-change", callback);
		};
	}

	private async setContractData(walletData: IWallet) {
		const saleContractAddress = Config.getInstance().get().contracts.MockERC20ContractAddress;
		const abi = SaleContractAbi.abi;
		const provider =
			walletData.provider ??
			new ethers.providers.InfuraProvider("rinkeby", Config.getInstance().get().wallet.infuraId);
		const signer = walletData.provider?.getSigner() ?? null;
		const contract = new SaleContract(saleContractAddress, abi, provider, signer);
		const phases = await Services.getInstance().getPhases(contract);
		for (const phase of phases) {
			const isActive = await phase.getStatus();
			if (isActive) {
				this.activePhase = phase.config.index;
				break;
			}
		}
		this.saleContract = contract;
		this.phases = phases;
		this.event.emit("contract-change", this.contractData);
	}

	public async getUserPurchasedTokens(userAddress: string): Promise<EthBigNumber> {
		const purchasedTokens = await Services.getInstance().getUserPurchasedTokens(this.saleContract!, userAddress);
		return purchasedTokens;
	}

	public async getUserLockedTokens(userAddress: string) {
		const lockedTokens = await Services.getInstance().getUserLockedTokens(this.saleContract!, userAddress);
		return lockedTokens;
	}

	public async getUserAvailableTokens(userAddress: string) {
		const availableTokens = await Services.getInstance().getUserAvailableTokens(this.saleContract!, userAddress);
		return availableTokens;
	}
}
