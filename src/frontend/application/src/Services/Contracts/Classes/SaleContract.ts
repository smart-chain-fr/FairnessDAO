import { BigNumber, ethers } from "ethers";
import LightCache from "Services/LightCache";
import BaseContract from "./BaseContract";

export default class SaleContract extends BaseContract {
	protected readonly saleContractCache: LightCache;
	protected static readonly QUERY_DELAY = 8;
	constructor(
		protected contractAddress: string,
		protected abi: any,
		protected provider: ethers.providers.InfuraProvider | ethers.providers.Web3Provider,
		protected signer: ethers.providers.JsonRpcSigner | null,
	) {
		super(contractAddress, abi, provider, signer);
		this.saleContractCache = LightCache.getNewNameSpace();
	}

	public async getTotalPhase(): Promise<BigNumber> {
		return await this.contract!["totalSalePhase"]();
	}
}

