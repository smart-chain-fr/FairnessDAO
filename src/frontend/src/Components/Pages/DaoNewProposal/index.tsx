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
	stakeAmount: string;
};

export type Proposal = {
	title: string;
	description: string;
	voteChoices: string[];
	totalVoteChoices: number;
	startTime: number;
	proposalLevel: number; /// @dev Must be either 0 (Soft) or 1 (Hard).
	submittedAt: number; // Or Date or String since it's not used on-chain.
	submitterAddress: string;
	signedProposal: string;
};

export default class DaoNewProposal extends BasePage<IProps, IState> {
	public constructor(props: IProps) {
		super(props);
		this.state = {
			stakeAmount: "",
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

			// ---------------- TEST ---------------- //
			const proposalToSubmit: Proposal = {
				title: "FIP#X: Lorem ipsum",
				description:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				voteChoices: ["Yes", "No", "Maybe"],
				totalVoteChoices: 3,
				startTime: 1663766604,
				proposalLevel: 0,
				submittedAt: 1663759426,
				submitterAddress: ethers.constants.AddressZero,
				signedProposal: "",
			};

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
			const proposalURI: any = await client.add(JSON.stringify(proposalToSubmit));
			console.log('proposalURI', proposalURI)

			const allowanceTx = await fairnessDAOFairVestingContractWithSigner['approve'](Config.getInstance().get().contracts.FairnessDAOProposalRegistryContractAddress, ethers.utils.parseEther("999999999999999999999999999999"));
			await allowanceTx.wait();
			console.log(`allowance tx hash: ${allowanceTx.hash}`);

			const submitProposalTx = await fairnessDAOProposalRegistryContractWithSigner['submitProposal'](proposalToSubmit.startTime, proposalURI.path, proposalToSubmit.totalVoteChoices, proposalToSubmit.proposalLevel);
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
										value={this.state.stakeAmount}
										onChange={(e) => {
											this.setState({
												stakeAmount: e.target.value,
											});
										}}
										placeholder="Amount"
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

