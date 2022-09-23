import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { BigNumber, ethers } from "ethers";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import FairnessDAOProposalRegistryAbi from "../../../Assets/abi/FairnessDAOProposalRegistry.json";
import Config from "Configs/Config";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { ProposalInfo } from "../DaoNewProposal";
import axios from "axios";
import moment from "moment";

type IProps = {};

type IPropsClass = IProps & {
	navigate: NavigateFunction;
	proposalId: number;
};

type IState = {
	loading: boolean;
	proposal?: ProposalInfo;
};

class DaoProposalDetailsClass extends BasePage<IPropsClass, IState> {
	public constructor(props: IPropsClass) {
		super(props);
		this.state = {
			loading: true,
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

			const tmpProposal = await fairnessDAOProposalRegistryContract["viewProposal"](proposalId);
			console.log(tmpProposal);

			const tmpProposalInfo: ProposalInfo = {
				proposerAddress: tmpProposal.proposerAddress,
				startTime: tmpProposal.startTime.toNumber(),
				endTime: tmpProposal.endTime.toNumber(),
				proposalTotalDepth: tmpProposal.proposalTotalDepth.toNumber(),
				proposalURI: tmpProposal.proposalURI,
				votingStatus: tmpProposal.votingStatus, /// @dev Between 0 and 6.
				proposalLevel: tmpProposal.proposalLevel, /// @dev Either 0 or 1.
				amountOfVestingTokensBurnt: tmpProposal.amountOfVestingTokensBurnt,
				proposalDepthToTotalAmountOfVote: new Array<BigNumber>(),
				id: proposalId,
			};

			/// @dev We retrieve the content of the proposal from IPFS.
			const ipfsData: any = await axios.get(`https://ipfs.io/ipfs/${tmpProposalInfo.proposalURI}`);
			console.log(ipfsData);
			tmpProposalInfo.title = ipfsData.data.title;
			tmpProposalInfo.description = ipfsData.data.description;
			tmpProposalInfo.voteChoices = ipfsData.data.voteChoices;

			/// @dev We now retrieve the info of the proposal from the voting phase.
			/// If the proposal is not in active or passed voting status, everything should be set at 0 by default.
			const tmpVotingStatus: any = await fairnessDAOProposalRegistryContract["proposalIdToVotingStatus"](proposalId);
			tmpProposalInfo.totalAmountOfVotingTokensUsed = tmpVotingStatus.totalAmountOfVotingTokensUsed;
			tmpProposalInfo.totalAmountOfUniqueVoters = tmpVotingStatus.totalAmountOfUniqueVoters;

			/// @dev We then retrieve the amount of vesting tokens used for voting for each proposal voting choice.
			for (var j = 0; j < BigNumber.from(tmpProposalInfo.proposalTotalDepth).toNumber(); ++j) {
				const tmpProposalDepthToTotalAmountOfVote: any = await fairnessDAOProposalRegistryContract["getProposalIdToProposalDepthToTotalAmountOfVote"](proposalId, j);
				tmpProposalInfo.proposalDepthToTotalAmountOfVote.push(tmpProposalDepthToTotalAmountOfVote);
			}

			this.setState({
				loading: false,
				proposal: tmpProposalInfo,
			});
		}
	};

	private vote = async (proposalId: number, choice: number) => {
		const provider = Wallet.getInstance().walletData?.provider;
		if (provider) {
			const signer = provider.getSigner();
			const fairnessDAOProposalRegistryContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOProposalRegistryContractAddress, FairnessDAOProposalRegistryAbi.abi, provider);
			const fairnessDAOProposalRegistryContractWithSigner = fairnessDAOProposalRegistryContract.connect(signer);

			console.log(proposalId, choice);
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
								{this.state.loading ? (
									<div>Loading....</div>
								) : (
									<div className={classes["subcard"]}>
										<div className={classes["proposal-subcard"]}>
											{Date.now() / 1000 > this.state.proposal!.startTime! && Date.now() / 1000 < this.state.proposal!.endTime! ? (
												<div className={classes["proposal-status-open"]}>{`OPEN FOR ${-moment().diff(moment.unix(this.state.proposal!.endTime!), "days")} DAYS`}</div>
											) : (
												<div className={classes["proposal-status-closed"]}>CLOSED</div>
											)}

											<div className={classes["proposal-author"]}>{this.state.proposal!.proposerAddress}</div>
											<div className={classes["proposal-title"]}>{this.state.proposal!.title}</div>
											<div className={classes["proposal-description"]}>Description {this.state.proposal!.description}</div>
											<div className={classes["proposal-vefdao"]}>{parseFloat(ethers.utils.formatEther(this.state.proposal!.totalAmountOfVotingTokensUsed!)).toFixed(5)} VeFDAO</div>
											{/* <div>proposalTotalDepth {parseFloat(ethers.utils.formatEther(this.state.proposal!.proposalTotalDepth!))}</div>
													<div>proposalURI {this.state.proposal!.proposalURI}</div>
													<div>votingStatus {this.state.proposal!.votingStatus}</div>
													<div>proposalLevel {this.state.proposal!.proposalLevel}</div>
													<div>amountOfVestingTokensBurnt {parseFloat(ethers.utils.formatEther(this.state.proposal!.amountOfVestingTokensBurnt!))}</div>
													<div>totalAmountOfVotingTokensUsed {parseFloat(ethers.utils.formatEther(this.state.proposal!.totalAmountOfVotingTokensUsed!))}</div>
													<div>totalAmountOfUniqueVoters {parseFloat(ethers.utils.formatEther(this.state.proposal!.totalAmountOfUniqueVoters!))}</div>
													{this.state.proposal!.proposalDepthToTotalAmountOfVote.map((depth: any) => (
														<div>proposalDepthToTotalAmountOfVote {parseFloat(ethers.utils.formatEther(depth!))}</div>
													))}
													{this.state.proposal!.voteChoices?.map((choice: string, i: number) => (
														<div>
															{choice} {i}
														</div>
													))} */}

											<div className={classes["proposal-vote"]}>Vote</div>
											<div className={classes["proposal-votes"]}>
												{this.state.proposal?.voteChoices?.map((choice, i) => (
													<Button key={`choice-${i}`} onClick={() => this.vote(this.props.proposalId, i)}>
														{choice}
													</Button>
												))}
											</div>
										</div>
									</div>
								)}
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

