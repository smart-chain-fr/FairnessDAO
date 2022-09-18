import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { ethers } from "ethers";
import { useState } from "react";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";

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
			// const contract = new ethers.Contract("0x...", abi, provider);
			// const contractWithSigner = contract.connect(signer);
			// const tx = await contractWithSigner.stake(this.state.stakeAmount);
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
										<div className={classes["amount-value"]}>237,80 SMART</div>
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
										<h2>Staked SMART</h2>
										<div className={classes["staking-amount"]}>
											<img alt="logo" src="/logo.svg" />
											<div className={classes["amount-value"]}>237,80 SMART</div>
										</div>
										<Button variant="ghost">Unstake</Button>
									</div>
									<div className={[classes["subcard"], classes["subcenter"]].join(" ")}>
										<h2>Claimable vSMART</h2>
										<div className={classes["staking-amount"]}>
											<img alt="logo" src="/logo.svg" />
											<div className={classes["amount-value"]}>237,80 vSMART</div>
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

