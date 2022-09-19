import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { ethers } from "ethers";
import { useState } from "react";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import TokenContractAbi from "../../../Assets/abi/TokenContract.json";

type IProps = {};

type IState = {
	stakeAmount: string;
};

export default class Faucet extends BasePage<IProps, IState> {
	public constructor(props: IProps) {
		super(props);
	}

	public componentDidMount() {}

	private getTokens = async () => {
		const provider = Wallet.getInstance().walletData?.provider;
		console.log(provider);

		if (provider) {
			const signer = provider.getSigner();

			const tokenContract = new ethers.Contract("0xb082f8547F959417b0c75Da4a8E1F291F0495b54", TokenContractAbi.abi, provider);
			const tokenContractWithSigner = tokenContract.connect(signer);

			const tx = await tokenContractWithSigner['faucet'](ethers.utils.parseEther("1"));
			const receipt = await tx.wait();
			console.log(receipt);
		}
	};

	public render(): JSX.Element {
		return (
			<I18n
				map={["pages_title.resources"]}
				content={([title]) => (
					<DefaultTemplate title={title!}>
						<div className={classes["root"]}>
							<h1>Faucet</h1>

							<div className={classes["card"]}>
								<div className={classes["subcard"]}>
									<Button onClick={() => this.getTokens()}>Get 1 FDAO Token</Button>
								</div>
							</div>
						</div>
					</DefaultTemplate>
				)}
			/>
		);
	}
}

