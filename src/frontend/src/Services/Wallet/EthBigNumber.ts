import { BigNumber, ethers } from "ethers";

export default class EthBigNumber {
	constructor(private bigNumber: BigNumber) {}

	public formatUnits(unitName: ethers.BigNumberish = 18) {
		return ethers.utils.formatUnits(this.bigNumber, unitName);
	}

	public getBigNumber() {
		return this.bigNumber;
	}

	public static from(value: string, unitName: ethers.BigNumberish = 18) {
		if (!value) return new this(BigNumber.from(0));
		if (unitName) return new this(BigNumber.from(ethers.utils.parseUnits(value, unitName)));
		return new this(BigNumber.from(value));
	}

	public add(other: EthBigNumber) {
		return new EthBigNumber(this.bigNumber.add(other.getBigNumber()));
	}

	public sub(other: EthBigNumber) {
		return new EthBigNumber(this.bigNumber.sub(other.getBigNumber()));
	}

	public mul(other: EthBigNumber) {
		return new EthBigNumber(this.bigNumber.mul(other.getBigNumber()));
	}
	public div(other: EthBigNumber) {
		return new EthBigNumber(this.bigNumber.div(other.getBigNumber()));
	}

	public eq(other: EthBigNumber) {
		return this.bigNumber.eq(other.getBigNumber());
	}

	public gt(other: EthBigNumber) {
		return this.bigNumber.gt(other.getBigNumber());
	}

	public gte(other: EthBigNumber) {
		return this.bigNumber.gte(other.getBigNumber());
	}

	public lt(other: EthBigNumber) {
		return this.bigNumber.lt(other.getBigNumber());
	}

	public lte(other: EthBigNumber) {
		return this.bigNumber.lte(other.getBigNumber());
	}

	public isZero() {
		return this.bigNumber.eq(BigNumber.from(0));
	}

	public toNumber() {
		return this.bigNumber.toNumber();
	}

	public toInverse() {
		const ratio = parseInt(ethers.utils.formatEther(this.bigNumber));
		const price = (1 / ratio).toFixed(5);
		return new EthBigNumber(ethers.utils.parseEther(price.toString()));
	}

	public removeDecimals(unitName: ethers.BigNumberish = 18) {
		return new EthBigNumber(this.bigNumber.div(ethers.utils.parseUnits("1")));
	}

	public static fromZero() {
		return new this(BigNumber.from("0"));
	}
}

