import { ethers } from "ethers";

export default abstract class BaseContract {
	protected contract: ethers.Contract | null = null;

	public constructor(
		protected contractAddress: string,
		protected abi: any,
		protected provider: ethers.providers.InfuraProvider | ethers.providers.Web3Provider,
		protected signer: ethers.providers.JsonRpcSigner | null
	) {
		if(!signer){
			this.contract = new ethers.Contract(contractAddress, abi, provider);
			return
		}
		this.contract = new ethers.Contract(contractAddress, abi, provider).connect(signer);
	}

	public getContract() {
		return this.contract;
	}
}

