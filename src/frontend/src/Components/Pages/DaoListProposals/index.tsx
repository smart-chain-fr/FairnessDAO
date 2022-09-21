import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { ethers } from "ethers";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import FairnessDAOProposalRegistryAbi from "../../../Assets/abi/FairnessDAOProposalRegistry.json";
import Config from "Configs/Config";
import { Link } from "react-router-dom";
import { Proposal } from "../DaoNewProposal";

type IProps = {};

type IState = {
	proposals: Proposal[];
};

export default class DaoListProposals extends BasePage<IProps, IState> {
	public constructor(props: IProps) {
		super(props);
		this.state = {
			proposals: []
		}
	}

	public componentDidMount() {
		setTimeout(() => this.getProposals(), 1000);
	}

	private getProposals = async () => {
		const provider = Wallet.getInstance().walletData?.provider;
		console.log(provider);

		if (provider) {
			const signer = provider.getSigner();
			const fairnessDAOProposalRegistryContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOProposalRegistryContractAddress, FairnessDAOProposalRegistryAbi.abi, provider);
			const fairnessDAOProposalRegistryContractWithSigner = fairnessDAOProposalRegistryContract.connect(signer);

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
							<h1>Proposals</h1>
							<Link to="/new-proposal"><Button>New Proposal</Button></Link>
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

