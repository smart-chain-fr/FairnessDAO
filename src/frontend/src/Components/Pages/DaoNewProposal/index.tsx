import Button from "Components/Elements/Button";
import I18n from "Components/Materials/I18n";
import BasePage from "Components/Pages/Base";
import DefaultTemplate from "Components/PageTemplates/DefaultTemplate";
import { ethers } from "ethers";
import Wallet from "Stores/Wallet";
import classes from "./classes.module.scss";
import FairnessDAOProposalRegistryAbi from "../../../Assets/abi/FairnessDAOProposalRegistry.json";
import FairnessDAOFairVestingAbi from "../../../Assets/abi/FairnessDAOFairVesting.json";
import Config from "Configs/Config";
const ipfsClient = require("ipfs-http-client");

type IProps = {};

type IState = {
	title: string;
	description: string;
	voteChoices: string[];
	totalVoteChoices: number;
	startTime: number;
	proposalLevel: number;
	submittedAt: number;
	submitterAddress: string;
};

export type Proposal = {
	title: string;
	description: string;
	voteChoices: string[];
	totalVoteChoices: number;
	startTime: number;
	proposalLevel: number;
	submittedAt: number;
	submitterAddress: string;
};

export default class DaoNewProposal extends BasePage<IProps, IState> {
	public constructor(props: IProps) {
		super(props);
		this.state = {
			title: "",
			description: "",
			voteChoices: ["Yes", "No", "Maybe"],
			totalVoteChoices: 3,
			startTime: Date.now(),
			proposalLevel: 0,
			submittedAt: Date.now() + 3600,
			submitterAddress: Wallet.getInstance().walletData?.userAddress!,
		};
	}

	public componentDidMount() {}

	private submitProposal = async () => {
		const provider = Wallet.getInstance().walletData?.provider;
		console.log(provider);

		if (provider) {
			const signer = provider.getSigner();
			const fairnessDAOProposalRegistryContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOProposalRegistryContractAddress, FairnessDAOProposalRegistryAbi.abi, provider);
			const fairnessDAOProposalRegistryContractWithSigner = fairnessDAOProposalRegistryContract.connect(signer);
			const fairnessDAOFairVestingContract = new ethers.Contract(Config.getInstance().get().contracts.FairnessDAOFairVestingContractAddress, FairnessDAOFairVestingAbi.abi, provider);
			const fairnessDAOFairVestingContractWithSigner = fairnessDAOFairVestingContract.connect(signer);

			const projectId = "2F2BKlDPX4CaBF8TGPLey2zwkP7";
			const projectSecret = "75be29d11dffc3a0a53702d8259e71f3";
			const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
			const client = ipfsClient.create({
				host: "ipfs.infura.io",
				port: 5001,
				protocol: "https",
				headers: {
					authorization: auth,
				},
			});
			const proposalURI: any = await client.add(JSON.stringify(this.state));
			console.log("proposalURI", proposalURI);

			const allowanceTx = await fairnessDAOFairVestingContractWithSigner["approve"](Config.getInstance().get().contracts.FairnessDAOProposalRegistryContractAddress, ethers.utils.parseEther("999999999999999999999999999999"));
			await allowanceTx.wait();
			console.log(`allowance tx hash: ${allowanceTx.hash}`);

			console.log(this.state);

			const submitProposalTx = await fairnessDAOProposalRegistryContractWithSigner["submitProposal"](this.state.startTime, proposalURI.path, this.state.totalVoteChoices, this.state.proposalLevel);
			await submitProposalTx.wait();
			console.log(`submitProposal tx hash: ${submitProposalTx.hash}`);
		}
	};

	public render(): JSX.Element {
		return (
			<I18n
				map={["pages_title.resources"]}
				content={([title]) => (
					<DefaultTemplate title={title!}>
						<div className={classes["root"]}>
							<h1>New Proposal</h1>
							<div className={classes["card"]}>
								<div className={classes["subcard"]}>
									<input
										type="text"
										className={classes["staking-input-input"]}
										value={this.state.title}
										onChange={(e) => {
											this.setState({
												title: e.target.value,
											});
										}}
										placeholder="Title"
									/>
									<input
										type="text"
										className={classes["staking-input-input"]}
										value={this.state.description}
										onChange={(e) => {
											this.setState({
												description: e.target.value,
											});
										}}
										placeholder="Description"
									/>
									<input
										type="text"
										className={classes["staking-input-input"]}
										value={this.state.voteChoices.toString()}
										onChange={(e) => {
											this.setState({
												voteChoices: e.target.value.split(","),
												totalVoteChoices: e.target.value.split(",").length,
											});
										}}
										placeholder="Choices"
									/>
									<input
										type="text"
										className={classes["staking-input-input"]}
										value={this.state.startTime}
										onChange={(e) => {
											this.setState({
												startTime: parseInt(e.target.value),
											});
										}}
										placeholder="Start time"
									/>
									<input
										type="string"
										className={classes["staking-input-input"]}
										value={this.state.proposalLevel}
										onChange={(e) => {
											this.setState({
												proposalLevel: parseInt(e.target.value),
											});
										}}
										placeholder="Proposal Level"
									/>
									<input
										type="text"
										className={classes["staking-input-input"]}
										value={this.state.submittedAt}
										onChange={(e) => {
											this.setState({
												submittedAt: parseInt(e.target.value),
											});
										}}
										placeholder="Submitted at"
									/>
									<input
										type="text"
										className={classes["staking-input-input"]}
										value={this.state.submitterAddress}
										onChange={(e) => {
											this.setState({
												submitterAddress: e.target.value,
											});
										}}
										placeholder="Submitter Address"
									/>

									<Button onClick={() => this.submitProposal()}>Submit proposal</Button>
								</div>
							</div>
						</div>
					</DefaultTemplate>
				)}
			/>
		);
	}
}

