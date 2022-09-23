import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { BigNumber, ethers } from "ethers";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import FairnessDAOProposalRegistryAbi from "../../../Assets/abi/FairnessDAOProposalRegistry.json";
import Config from "Configs/Config";
import { Link } from "react-router-dom";
import { Proposal, ProposalInfo } from "../DaoNewProposal";
import EthBigNumber from "Services/Wallet/EthBigNumber";
import axios from "axios";
import moment from "moment";

type IProps = {};

type IState = {
	proposals: ProposalInfo[];
};

export default class DaoListProposals extends BasePage<IProps, IState> {
	public constructor(props: IProps) {
		super(props);
		this.state = {
			proposals: [],
		};
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

			const proposalCountBn = await fairnessDAOProposalRegistryContract["proposalCount"]();
			console.log("proposalCountBn", proposalCountBn);
			const proposalCount = proposalCountBn.toNumber();
			console.log("proposalCount", proposalCount);

			if (proposalCount > 0) {
				// const proposals = await fairnessDAOProposalRegistryContract["viewProposal"](0);
				const tmpProposals = await fairnessDAOProposalRegistryContract["viewMultipleProposals"](0, proposalCount - 1);
				const proposals: ProposalInfo[] = [];

				for (var i = tmpProposals.length - 1; i >= 0; --i) {
					const tmpProposal = tmpProposals[i];
					console.log("Reading", i);

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
						id: i
					};

					console.log("Axios", `https://ipfs.io/ipfs/${tmpProposalInfo.proposalURI}`);
					/// @dev We retrieve the content of the proposal from IPFS.
					const ipfsData: any = await axios.get(`https://ipfs.io/ipfs/${tmpProposalInfo.proposalURI}`);
					console.log(ipfsData);
					tmpProposalInfo.title = ipfsData.data.title;
					tmpProposalInfo.description = ipfsData.data.description;
					tmpProposalInfo.voteChoices = ipfsData.data.voteChoices;

					/// @dev We now retrieve the info of the proposal from the voting phase.
					/// If the proposal is not in active or passed voting status, everything should be set at 0 by default.
					const tmpVotingStatus: any = await fairnessDAOProposalRegistryContract["proposalIdToVotingStatus"](i);
					tmpProposalInfo.totalAmountOfVotingTokensUsed = tmpVotingStatus.totalAmountOfVotingTokensUsed;
					tmpProposalInfo.totalAmountOfUniqueVoters = tmpVotingStatus.totalAmountOfUniqueVoters;

					/// @dev We then retrieve the amount of vesting tokens used for voting for each proposal voting choice.
					for (var j = 0; j < BigNumber.from(tmpProposalInfo.proposalTotalDepth).toNumber(); ++j) {
						const tmpProposalDepthToTotalAmountOfVote: any = await fairnessDAOProposalRegistryContract["getProposalIdToProposalDepthToTotalAmountOfVote"](i, j);
						tmpProposalInfo.proposalDepthToTotalAmountOfVote.push(tmpProposalDepthToTotalAmountOfVote);
					}

					proposals.push(tmpProposalInfo);

					this.setState({
						proposals,
					});
				}
			}
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
							<div className={classes["new-proposal"]}>
								<Link to="/new-proposal">
									<Button>New Proposal</Button>
								</Link>
							</div>
							<div className={classes["card"]}>
								{this.state.proposals.length === 0 ? (
									<div>Loading...</div>
								) : (
									<>
										{this.state.proposals.map((proposal) => (
											<Link key={`proposal-${proposal.id}`} to={`/proposal/${proposal.id}`} className={classes["proposal-link"]}>
												<div className={classes["proposal-subcard"]}>
													{Date.now() / 1000 > proposal.startTime! && Date.now() / 1000 < proposal.endTime! ? (
														<div className={classes["proposal-status-open"]}>{`OPEN FOR ${-moment().diff(moment.unix(proposal.endTime!), "days")} DAYS`}</div>
													) : (
														<div className={classes["proposal-status-closed"]}>CLOSED</div>
													)}

													<div className={classes["proposal-author"]}>{proposal.proposerAddress}</div>
													<div className={classes["proposal-title"]}>{proposal.title}</div>
													<div className={classes["proposal-description"]}>Description {proposal.description}</div>
													<div className={classes["proposal-vefdao"]}>{parseFloat(ethers.utils.formatEther(proposal.totalAmountOfVotingTokensUsed!)).toFixed(5)} VeFDAO</div>
													{/* <div>proposalTotalDepth {parseFloat(ethers.utils.formatEther(proposal.proposalTotalDepth!))}</div>
													<div>proposalURI {proposal.proposalURI}</div>
													<div>votingStatus {proposal.votingStatus}</div>
													<div>proposalLevel {proposal.proposalLevel}</div>
													<div>amountOfVestingTokensBurnt {parseFloat(ethers.utils.formatEther(proposal.amountOfVestingTokensBurnt!))}</div>
													<div>totalAmountOfVotingTokensUsed {parseFloat(ethers.utils.formatEther(proposal.totalAmountOfVotingTokensUsed!))}</div>
													<div>totalAmountOfUniqueVoters {parseFloat(ethers.utils.formatEther(proposal.totalAmountOfUniqueVoters!))}</div>
													{proposal.proposalDepthToTotalAmountOfVote.map((depth: any) => (
														<div>proposalDepthToTotalAmountOfVote {parseFloat(ethers.utils.formatEther(depth!))}</div>
													))}
													{proposal.voteChoices?.map((choice: string, i: number) => (
														<div>
															{choice} {i}
														</div>
													))} */}
												</div>
											</Link>
										))}
									</>
								)}
							</div>
						</div>
					</DefaultTemplate>
				)}
			/>
		);
	}
}

