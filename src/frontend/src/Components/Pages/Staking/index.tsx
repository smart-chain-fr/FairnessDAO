import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { ethers } from "ethers";
import { useState } from "react";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import TokenContractAbi from "../../../Assets/abi/TokenContract.json"
import DaoContractAbi from "../../../Assets/abi/DaoContract.json"

type IProps = {};

type IState = {
	stakeAmount: string;
};

export default class Staking extends BasePage<IProps, IState> {
	public constructor(props: IProps) {
		super(props);
		this.state = {
			stakeAmount: "",
		};
	}

	public componentDidMount() {}

	private stake = async () => {
		const provider = Wallet.getInstance().walletData?.provider;
		console.log(provider);

		if (provider) {
			const signer = provider.getSigner();

			const tokenContract = new ethers.Contract("0xb082f8547F959417b0c75Da4a8E1F291F0495b54", TokenContractAbi.abi, provider);
			const tokenContractWithSigner = tokenContract.connect(signer);

			const daoContract = new ethers.Contract("0x9FB6d267a169B51faE65c6C482B06C278EC9d83C", DaoContractAbi.abi, provider);
			const daoContractWithSigner = daoContract.connect(signer);

			// const tx = await tokenContractWithSigner.stake(this.state.stakeAmount);
			// const receipt = await tx.wait();
			// console.log(receipt);
		}
	};

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
										<div className={classes["amount-value"]}>237,80 FDAO</div>
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
											<Button>Stake</Button>
										</div>
									</div>
								</div>

								<div className={classes["subgrid"]}>
									<div className={[classes["subcard"], classes["subcenter"]].join(" ")}>
										<h2>Staked FDAO</h2>
										<div className={classes["staking-amount"]}>
											<img alt="logo" src="/logo.svg" />
											<div className={classes["amount-value"]}>237,80 FDAO</div>
										</div>
										<Button variant="ghost">Unstake</Button>
									</div>
									<div className={[classes["subcard"], classes["subcenter"]].join(" ")}>
										<h2>Claimable VeFDAO</h2>
										<div className={classes["staking-amount"]}>
											<img alt="logo" src="/logo.svg" />
											<div className={classes["amount-value"]}>237,80 VeFDAO</div>
										</div>
										<Button>Redeem</Button>
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

