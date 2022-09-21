import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { ethers } from "ethers";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import MockERC20Abi from "../../../Assets/abi/MockERC20.json";
import Config from "Configs/Config";

type IProps = {};

type IState = {
	stakeAmount: string;
};

export default class DaoNewProposal extends BasePage<IProps, IState> {
	public constructor(props: IProps) {
		super(props);
	}

	public componentDidMount() {}

	private getTokens = async () => {
		const provider = Wallet.getInstance().walletData?.provider;
		console.log(provider);

		if (provider) {
			const signer = provider.getSigner();
			const mockERC20Contract = new ethers.Contract(Config.getInstance().get().contracts.MockERC20ContractAddress, MockERC20Abi.abi, provider);
			const mockERC20ContractWithSigner = mockERC20Contract.connect(signer);

			// const tx = await mockERC20ContractWithSigner.stake(this.state.stakeAmount);
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
							<h1>Dao</h1>

							<div className={classes["card"]}>
								<div className={classes["subcard"]}>
									<Button>Get Some Tokens</Button>
								</div>
							</div>
						</div>
					</DefaultTemplate>
				)}
			/>
		);
	}
}

