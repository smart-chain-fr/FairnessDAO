
import Config from "Configs/Config";
import EthBigNumber from "Services/Wallet/EthBigNumber";
import SaleContractAbi from "../../assets/abi/SaleContract.json";
import Phase from "./Classes/Phase";
import SaleContract from "./Classes/SaleContract";

export type IAbi = typeof SaleContractAbi.abi;
export default class Services {
	private static ctx: Services;

	private constructor() {
		Services.ctx = this;
	}

	public static getInstance(newInstance: boolean = false) {
		if (!Services.ctx || newInstance) new this();
		return Services.ctx;
	}

	public async getPhases(saleContract: SaleContract): Promise<Phase[]> {
		const totalPhase: number = (await saleContract.getTotalPhase()).toNumber();
		const countArray = Array.from(Array(totalPhase).fill(null));

		const phases = await Promise.all(
			countArray.map(async (_, index) => {
				return new Phase(saleContract.getContract()!, this.getPhaseConfig(index + 1)!);
			}),
		);
		return phases;
	}

	private getPhaseConfig(index: number) {
		const phase = Config.getInstance()
			.get()
			.phases.find((phase) => phase.index === index);
		if (!phase) throw Error(`Phase ${index} config not found`);
		return phase;
	}

	public async getUserPurchasedTokens(saleContract: SaleContract, userAddress: string): Promise<EthBigNumber> {
		const phases = await this.getPhases(saleContract);
		const totalTokensPurchased = await phases.reduce(async (previousPromise, phase) => {
			const previousAmount = await previousPromise;
			const phaseTokensPurchased = await phase.getUserTokensPurchased(userAddress);
			return previousAmount.add(phaseTokensPurchased);
		}, Promise.resolve(EthBigNumber.fromZero()));

		return totalTokensPurchased;
	}

	public async getUserLockedTokens(saleContract: SaleContract, userAddress: string) {
		const phases = await this.getPhases(saleContract);
		let totalLockedTokens = EthBigNumber.fromZero();
		let totalPurchasedTokens = await this.getUserPurchasedTokens(saleContract, userAddress);
		for (const phase of phases) {
			const tokensPurchased = await phase.getUserTokensPurchased(userAddress);
			totalPurchasedTokens.add(tokensPurchased);
		}
		const totalAvailableTokens = await this.getUserAvailableTokens(saleContract, userAddress);
		totalLockedTokens = totalPurchasedTokens.sub(totalAvailableTokens);
		return totalLockedTokens;
	}

	public async getUserAvailableTokens(saleContract: SaleContract, userAddress: string) {
		const phases = await this.getPhases(saleContract);
		let totalAvailableTokens = EthBigNumber.fromZero();
		for (const phase of phases) {
			const vestedTokens = await phase.getUserVestedTokens(userAddress);
			const tgeTokens = await phase.getUserTgeTokens(userAddress);
			const tgeStatus = await phase.getTgeStatus();
			const vestingStatus = await phase.getVestingStatus();

			let phaseAvailableTokens: EthBigNumber = EthBigNumber.fromZero();
			if (tgeStatus) phaseAvailableTokens = phaseAvailableTokens.add(tgeTokens);
			if (vestingStatus) phaseAvailableTokens = phaseAvailableTokens.add(vestedTokens);
			totalAvailableTokens = totalAvailableTokens.add(phaseAvailableTokens);
		}
		return totalAvailableTokens;
	}
}

