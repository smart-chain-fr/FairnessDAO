import { BigNumber, ethers, Transaction } from "ethers";
import LightCache from "Services/LightCache";
import EthBigNumber from "Services/Wallet/EthBigNumber";
import Wallet from "Stores/Wallet";

type TStringBigNumber = string;
interface IPhaseConfig {
	label: string;
	name: string;
	index: number;
	attrs: {
		hardCap: TStringBigNumber;
		vesting: string;
		typeOfFundraising: string;
	};
}

export default class Phase {
	protected readonly phaseCache: LightCache;
	protected static readonly QUERY_DELAY = 8;
	constructor(private readonly contract: ethers.Contract, public readonly config: IPhaseConfig) {
		this.contract = contract;
		this.phaseCache = LightCache.getNewNameSpace();
	}

	public async getStatus(): Promise<boolean> {
		return (await this.getPhaseInfo()).saleStatus;
	}

	public async getRatio(): Promise<EthBigNumber> {
		return new EthBigNumber((await this.getPhaseInfo()).priceRatio);
	}

	public async getTokensSold(): Promise<EthBigNumber> {
		try {
			const cacheTokensSold = this.phaseCache.get<EthBigNumber>(`phase-${this.config.index}-tokens-sold`);
			if (cacheTokensSold) return cacheTokensSold;
			const tokensSold = new EthBigNumber(
				await this.contract["uintToTotalTokenBoughtInSalePhase"](this.config.index),
			);
			this.phaseCache.set(`phase-${this.config.index}-tokens-sold`, tokensSold, Phase.QUERY_DELAY);
			return tokensSold;
		} catch (e) {
			if (e instanceof Error) throw e;
			throw new Error(e as string);
		}
	}

	public async getUserHardcap(userAddress: string): Promise<EthBigNumber> {
		return new EthBigNumber((await this.getInvestorInfo(userAddress)).individualHardcap);
	}

	public async getUserInvestedAmount(userAddress: string) {
		return new EthBigNumber((await this.getInvestorInfo(userAddress)).investedAmount);
	}

	public async getUserTokensPurchased(userAddress: string) {
		return new EthBigNumber((await this.getInvestorInfo(userAddress)).amountOfTokenPurchased);
	}

	public async getUserTgeTokens(userAddress: string) {
		return new EthBigNumber((await this.getInvestorInfo(userAddress)).tgeClaimable);
	}

	public async getUserVestedTokens(userAddress: string) {
		return new EthBigNumber((await this.getInvestorInfo(userAddress)).vestedClaimable);
	}

	public async getUserIsWhitelisted(userAddress: string) {
		return (await this.getInvestorInfo(userAddress)).isWhitelisted;
	}

	public async getAmountInvested() {
		try {
			const cacheAmountInvested = this.phaseCache.get<EthBigNumber>(
				`phase-${this.config.index}-total-amount-invested`,
			);
			if (cacheAmountInvested) return cacheAmountInvested;
			const amountInvested = new EthBigNumber(
				await this.contract["uintToTotalInvestedInSalePhase"](this.config.index),
			);
			this.phaseCache.set(`phase-${this.config.index}-total-amount-invested`, amountInvested, Phase.QUERY_DELAY);
			return amountInvested;
		} catch (e) {
			if (e instanceof Error) throw e;
			throw new Error(e as string);
		}
	}

	public async getTotalTokensSold(): Promise<EthBigNumber> {
		try {
			const cacheTotalAmountInvested = this.phaseCache.get<EthBigNumber>(
				`phase-${this.config.index}-total-tokens-sold`,
			);
			if (cacheTotalAmountInvested) return cacheTotalAmountInvested;
			const totalAmountInvested = new EthBigNumber(await this.contract["totalSold"]());
			this.phaseCache.set(`phase-${this.config.index}-total-tokens-sold`, totalAmountInvested, Phase.QUERY_DELAY);
			return totalAmountInvested;
		} catch (e) {
			if (e instanceof Error) throw e;
			throw new Error(e as string);
		}
	}

	public async claimTgeTokens() {
		try {
			return await this.contract["claimTgeTokens"](this.config.index);
		} catch (e) {
			console.error(e);
		}
	}

	public async claimVestedTokens() {
		try {
			return await this.contract["claimVestedTokens"](this.config.index);
		} catch (e) {
			console.error(e);
		}
	}

	public async investInPhase(amount: EthBigNumber) {
		try {
			const balance = Wallet.getInstance().walletData.balance;
			if (balance?.lt(amount)) throw Error("Insufficient balance");
			const overrides: Partial<Transaction> = {};
			overrides.value = amount.getBigNumber();
			return await this.contract["investInPhase"](this.config.index, overrides);
		} catch (e) {
			console.error(e);
		}
	}

	private async getInvestorInfo(userAddress: string) {
		try {
			const cacheUserInfo = this.phaseCache.get<any>(`phase-${this.config.index}-user-${userAddress}-info`);
			if (cacheUserInfo) return cacheUserInfo;
			const userInfo = await this.contract["getInvestorInfoFromSalePhaseId"](this.config.index, userAddress);
			this.phaseCache.set(`phase-${this.config.index}-user-${userAddress}-info`, userInfo, Phase.QUERY_DELAY);
			return userInfo;
		} catch (e) {
			if (e instanceof Error) throw e;
			throw new Error(e as string);
		}
	}

	private async getPhaseInfo() {
		try {
			const cachePhaseInfo = this.phaseCache.get<boolean>(`phase-${this.config.index}-info`);
			if (cachePhaseInfo) return cachePhaseInfo;
			const phaseInfo = await this.contract["uintToSalePhase"](this.config.index);
			this.phaseCache.set(`phase-${this.config.index}-info`, phaseInfo, Phase.QUERY_DELAY);
			return phaseInfo;
		} catch (e) {
			if (e instanceof Error) throw e;
			throw new Error(e as string);
		}
	}

	public async getPhaseProgress(): Promise<number> {
		try {
			const cachePhaseProgess = this.phaseCache.get<number>(`phase-${this.config.index}-progress`);
			if (cachePhaseProgess) return cachePhaseProgess;
			const tokensSold = await this.getTokensSold();
			const hardCap = EthBigNumber.from(this.config.attrs.hardCap);
			if (tokensSold.isZero()) return 0;
			const phaseProgess = tokensSold
				.mul(new EthBigNumber(BigNumber.from("100")))
				.div(hardCap)
				.toNumber();
			this.phaseCache.set(`phase-${this.config.index}-progress`, phaseProgess, Phase.QUERY_DELAY);
			return phaseProgess;
		} catch (e) {
			if (e instanceof Error) throw e;
			throw new Error(e as string);
		}
	}

	public async getTgeStatus(): Promise<boolean> {
		return (await this.getPhaseInfo()).tgeClaimStatus;
	}

	public async getVestingStatus(): Promise<boolean> {
		try {
			const cachePhaseStartTimestamp = this.phaseCache.get<boolean>(`phase-${this.config.index}-start-timestamp`);
			if (cachePhaseStartTimestamp) return cachePhaseStartTimestamp;
			const phaseStartTimestamp = await this.contract["uintToUnlockTimestampInSalePhase"](this.config.index);
			const vestingPeriod = (await this.getPhaseInfo()).vestingPeriod;
			const vestingTimestamp = this.getEndOfVestingTimestamp(phaseStartTimestamp, vestingPeriod);
			const today = new Date();
			// VestingClaimTimestamp is in seconds
			return today.getTime() >= vestingTimestamp.toNumber() * 1000;
		} catch (e) {
			if (e instanceof Error) throw e;
			throw new Error(e as string);
		}
	}

	public async getTokenHardcap(ethHarcap: EthBigNumber, ratio: EthBigNumber) {
		return ethHarcap.mul(ratio).removeDecimals();
	}
	public async getTokenPrice(ratio: EthBigNumber) {
		return ratio.toInverse();
	}

	public getMaxToInvest(
		hardcap: EthBigNumber,
		purchasedTokens: EthBigNumber,
		tokenPrice: EthBigNumber,
		balance: EthBigNumber,
	): EthBigNumber {
		const possibleToInvest = hardcap.sub(purchasedTokens).mul(tokenPrice).removeDecimals();
		if (balance.lte(possibleToInvest)) return balance;
		return possibleToInvest;
	}

	private getEndOfVestingTimestamp(phaseStartTimestamp: BigNumber, vestingPeriod: BigNumber) {
		return phaseStartTimestamp.add(vestingPeriod);
	}
}

