import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { ethers } from "ethers";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import FairnessDAOProposalRegistryAbi from "../../../Assets/abi/FairnessDAOProposalRegistry.json";
import Config from "Configs/Config";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

type IProps = {};

type IPropsClass = IProps & {
	navigate: NavigateFunction;
	proposalId: number;
};

type IState = {
	proposal: any;
};

class DaoProposalDetailsClass extends BasePage<IPropsClass, IState> {
	public constructor(props: IPropsClass) {
		super(props);
		this.state = {
			proposal: undefined,
		};
	}

	public componentDidMount() {
		this.getProposal(this.props.proposalId);
	}

	private getProposal = async (proposalId: number) => {
		const provider = Wallet.getInstance().walletData?.provider;
		if (provider) {
			const signer = provider.getSigner();
			const fairnessDAOProposalRegistryContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOProposalRegistryContractAddress, FairnessDAOProposalRegistryAbi.abi, provider);
			const fairnessDAOProposalRegistryContractWithSigner = fairnessDAOProposalRegistryContract.connect(signer);

			const proposal = await fairnessDAOProposalRegistryContract["viewProposal"](proposalId);
			// const proposals = await fairnessDAOProposalRegistryContract["viewMultipleProposals"](0, proposalCount - 1);
			console.log(proposal);
			this.setState({
				...this.state,
				proposal,
			});
		}
	};

	private vote = async (proposalId: number, choice: number) => {
		const provider = Wallet.getInstance().walletData?.provider;
		if (provider) {
			const signer = provider.getSigner();
			const fairnessDAOProposalRegistryContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOProposalRegistryContractAddress, FairnessDAOProposalRegistryAbi.abi, provider);
			const fairnessDAOProposalRegistryContractWithSigner = fairnessDAOProposalRegistryContract.connect(signer);

			const voteOnProposalTx = await fairnessDAOProposalRegistryContractWithSigner["voteOnProposal"](proposalId, choice);
			const voteOnProposalReceipt = await voteOnProposalTx.wait();
			console.log(voteOnProposalReceipt);
		}
	};

	public render(): JSX.Element {
		return (
			<I18n
				map={["pages_title.resources"]}
				content={([title]) => (
					<DefaultTemplate title={title!}>
						<div className={classes["root"]}>
							<h1>Proposal</h1>

							<div className={classes["card"]}>
								<div className={classes["subcard"]}>
									<div className={classes["subcard"]}>{JSON.stringify(this.state.proposal)}</div>
								</div>
								<Button onClick={() => this.vote(this.props.proposalId, 0)}>Vote 0</Button>
								<Button onClick={() => this.vote(this.props.proposalId, 1)}>Vote 1</Button>
								<Button onClick={() => this.vote(this.props.proposalId, 2)}>Vote 2</Button>
							</div>
						</div>
					</DefaultTemplate>
				)}
			/>
		);
	}
}

export default function DaoProposalDetails(props: IProps) {
	const { proposalId } = useParams<{ proposalId: string }>();
	const navigate = useNavigate();
	return <DaoProposalDetailsClass {...props} proposalId={+(proposalId as string)} navigate={navigate} />;
}

