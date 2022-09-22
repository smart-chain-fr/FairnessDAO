import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { ethers } from "ethers";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import FairnessDAOFairVestingAbi from "../../../Assets/abi/FairnessDAOFairVesting.json";
import Config from "Configs/Config";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

type IProps = {};

type IPropsClass = IProps & {
	navigate: NavigateFunction;
	proposalId: number;
};

type IState = {
	stakeAmount: string;
};

class DaoProposalDetailsClass extends BasePage<IPropsClass, IState> {
	public constructor(props: IPropsClass) {
		super(props);
	}

	public componentDidMount() {
		console.log(this.props.proposalId);
	}

	private getTokens = async () => {
		const provider = Wallet.getInstance().walletData?.provider;
		console.log(provider);

		if (provider) {
			const signer = provider.getSigner();
			const fairnessDAOFairVestingContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOFairVestingContractAddress, FairnessDAOFairVestingAbi.abi, provider);
			const fairnessDAOFairVestingContractWithSigner = fairnessDAOFairVestingContract.connect(signer);

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
							<h1>Proposal </h1>

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

export default function DaoProposalDetails(props: IProps) {
	const { proposalId } = useParams<{ proposalId: string }>();
	const navigate = useNavigate();
	return <DaoProposalDetailsClass {...props} proposalId={+(proposalId as string)} navigate={navigate} />;
}

