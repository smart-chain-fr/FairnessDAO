import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { ethers } from "ethers";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import MockERC20Abi from "../../../Assets/abi/MockERC20.json";
import FairnessDAOFairVestingAbi from "../../../Assets/abi/FairnessDAOFairVesting.json";
import EthBigNumber from "Services/Wallet/EthBigNumber";
import Config from "Configs/Config";

type IProps = {};

type IState = {
	stakeAmount: string;
	fdaoBalance: number;
	stakedFdaoBalance: number;
	claimableVeFdaoBalance: number;
};

export default class Staking extends BasePage<IProps, IState> {
	private timer: any;

	public constructor(props: IProps) {
		super(props);
		this.state = {
			stakeAmount: "",
			fdaoBalance: 0,
			stakedFdaoBalance: 0,
			claimableVeFdaoBalance: 0,
		};
	}

	public componentDidMount() {
		this.timer = setInterval(() => this.getBalances(), 1000);
	}

	public componentWillUnmount() {
		clearInterval(this.timer);
	}

	private stake = async (amountToStake: string) => {
		const provider = Wallet.getInstance().walletData?.provider;
		if (provider) {
			const signer = provider.getSigner();
			const mockERC20Contract = new ethers.Contract(Config.getInstance().get().contracts.MockERC20ContractAddress, MockERC20Abi.abi, provider);
			const mockERC20ContractWithSigner = mockERC20Contract.connect(signer);
			const fairnessDAOFairVestingContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOFairVestingContractAddress, FairnessDAOFairVestingAbi.abi, provider);
			const fairnessDAOFairVestingContractWithSigner = fairnessDAOFairVestingContract.connect(signer);

			const approveTx = await mockERC20ContractWithSigner["approve"](Config.getInstance().get().contracts.FairnessDAOFairVestingContractAddress, ethers.utils.parseEther(amountToStake));
			const approveTxReceipt = await approveTx.wait();
			console.log(approveTxReceipt);

			let functionToCall = "initiateVesting";
			try {
				await fairnessDAOFairVestingContractWithSigner["addressToVestingInfo"](Wallet.getInstance().walletData?.userAddress).amountVested;
				functionToCall = "increaseVesting";
			} catch (e: any) {
				console.log("User not staking");
			}

			const increaseVestingTx = await fairnessDAOFairVestingContractWithSigner[functionToCall](ethers.utils.parseEther(amountToStake));
			const increaseVestingReceipt = await increaseVestingTx.wait();
			console.log(increaseVestingReceipt);
		}
	};

	private unstake = async () => {
		const provider = Wallet.getInstance().walletData?.provider;
		if (provider) {
			const signer = provider.getSigner();
			const fairnessDAOFairVestingContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOFairVestingContractAddress, FairnessDAOFairVestingAbi.abi, provider);
			const fairnessDAOFairVestingContractWithSigner = fairnessDAOFairVestingContract.connect(signer);
			const increaseVestingTx = await fairnessDAOFairVestingContractWithSigner["withdrawVesting"](await fairnessDAOFairVestingContractWithSigner["balanceOf"](Wallet.getInstance().walletData?.userAddress!));
			const increaseVestingReceipt = await increaseVestingTx.wait();
			console.log(increaseVestingReceipt);
		}
	};

	private claim = async () => {
		const provider = Wallet.getInstance().walletData?.provider;
		if (provider) {
			const signer = provider.getSigner();
			const fairnessDAOFairVestingContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOFairVestingContractAddress, FairnessDAOFairVestingAbi.abi, provider);
			const fairnessDAOFairVestingContractWithSigner = fairnessDAOFairVestingContract.connect(signer);
			const updateVestingTx = await fairnessDAOFairVestingContractWithSigner["updateFairVesting"](Wallet.getInstance().walletData?.userAddress!);
			const updateVestingReceipt = await updateVestingTx.wait();
			console.log(updateVestingReceipt);
		}
	};

	private async getBalances() {
		const provider = Wallet.getInstance().walletData?.provider;
		if (provider) {
			const signer = provider.getSigner();
			const mockERC20Contract = new ethers.Contract(Config.getInstance().get().contracts.MockERC20ContractAddress, MockERC20Abi.abi, provider);
			const mockERC20ContractWithSigner = mockERC20Contract.connect(signer);
			const fairnessDAOFairVestingContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOFairVestingContractAddress, FairnessDAOFairVestingAbi.abi, provider);
			const fairnessDAOFairVestingContractWithSigner = fairnessDAOFairVestingContract.connect(signer);

			const fdaoBalanceBn = await mockERC20ContractWithSigner["balanceOf"](Wallet.getInstance().walletData?.userAddress);
			const fdaoBalance = new EthBigNumber(fdaoBalanceBn).removeDecimals().toNumber();
			console.log("fdaoBalance", fdaoBalance);

			const stakedFdaoBalanceBn = (await fairnessDAOFairVestingContractWithSigner["addressToVestingInfo"](Wallet.getInstance().walletData?.userAddress)).amountVested;
			const stakedFdaoBalance = new EthBigNumber(stakedFdaoBalanceBn).removeDecimals().toNumber();
			console.log("stakedFdaoBalance", stakedFdaoBalance);

			let claimableVeFdaoBalance = 0;
			try {
				const claimableVeFdaoBalanceBn = await fairnessDAOFairVestingContractWithSigner["getClaimableFairVesting"](Wallet.getInstance().walletData?.userAddress);
				claimableVeFdaoBalance = new EthBigNumber(claimableVeFdaoBalanceBn).removeDecimals().toNumber();
				console.log("claimableVeFdaoBalance", claimableVeFdaoBalance);
			} catch (e: any) {
				console.log("User not staking");
			}

			this.setState({
				...this.state,
				fdaoBalance,
				stakedFdaoBalance,
				claimableVeFdaoBalance,
			});
		}
	}

	public render(): JSX.Element {
		return (
			<I18n
				map={["pages_title.resources"]}
				content={([title]) => (
					<DefaultTemplate title={title!}>
						<div className={classes["root"]}>
							<h1>Staking</h1>

							<div className={classes["card"]}>
								<div className={classes["subcard"]}>
									<div className={[classes["staking-amount"], classes["left"]].join(" ")}>
										<img alt="logo" src="/logo.svg" />
										<div className={classes["amount-value"]}>{this.state.fdaoBalance} FDAO Available</div>
									</div>
									<div className={classes["staking-input-input-container"]}>
										<div className={classes["staking-input-input-title"]}>Amount to stake</div>
										<div className={classes["staking-input-grid"]}>
											<input
												type="text"
												className={classes["staking-input-input"]}
												value={this.state.stakeAmount}
												onChange={(e) => {
													this.setState({
														stakeAmount: e.target.value,
													});
												}}
												placeholder="Amount"
											/>
											<Button onClick={() => this.stake(this.state.stakeAmount)}>Stake</Button>
										</div>
									</div>
								</div>

								<div className={classes["subgrid"]}>
									<div className={[classes["subcard"], classes["subcenter"]].join(" ")}>
										<h2>Staked FDAO</h2>
										<div className={classes["staking-balance"]}>
											<div className={classes["amount-value"]}>{this.state.stakedFdaoBalance} FDAO</div>
										</div>
										<Button variant="ghost" onClick={() => this.unstake()}>
											Unstake
										</Button>
									</div>
									<div className={[classes["subcard"], classes["subcenter"]].join(" ")}>
										<h2>Claimable VeFDAO</h2>
										<div className={classes["staking-balance"]}>
											<div className={classes["amount-value"]}>{this.state.claimableVeFdaoBalance} VeFDAO</div>
										</div>
										<Button onClick={() => this.claim()}>Redeem</Button>
									</div>
								</div>
							</div>
						</div>
					</DefaultTemplate>
				)}
			/>
		);
	}
}

