import { ethers } from "hardhat";
import { Signer } from "ethers";
const ipfsClient = require("ipfs-http-client");
import MockERC20Artifact from "../artifacts/contracts/Mocks/MockERC20.sol/MockERC20.json";
import FairnessDAOFairVestingArtifact from "../artifacts/contracts/FairnessDAOFairVesting.sol/FairnessDAOFairVesting.json";
import FairnessDAOProposalRegistryArtifact from "../artifacts/contracts/FairnessDAOProposalRegistry.sol/FairnessDAOProposalRegistry.json";

const log = console.log;

async function main() {
  /** @dev INITIAL VALUES **/
  /** @dev Update the ERC-20 targeted address **/
  const fairTokenTargetAddress = ethers.constants.AddressZero;
  /** @dev Update the FairnessDAOFairVesting contract address **/
  const fairnessDAOFairVestingAddress = ethers.constants.AddressZero;
  /** @dev Update the FairnessDAOProposalRegistry contract address **/
  const fairnessDAOProposalRegistryAddress = ethers.constants.AddressZero;
  
  let overrides = {
    gasPrice: ethers.utils.parseUnits("30.0", "gwei"),  };

  let signers: Signer[];
  signers = await ethers.getSigners();

  /** @dev RETRIEVING CONTRACT INSTANCES **/

  const fairTokenTarget = await ethers.getContractAt(MockERC20Artifact.abi, fairTokenTargetAddress, signers[0]);
  log(`FairTokenTarget deployed address: ${fairTokenTarget.address}`);

  const fairnessDAOFairVesting = await ethers.getContractAt(
    FairnessDAOFairVestingArtifact.abi,
    fairnessDAOFairVestingAddress,
    signers[0],
  );
  log(`FairnessDAOFairVesting deployed address: ${fairnessDAOFairVesting.address}`);

  const fairnessDAOProposalRegistry = await ethers.getContractAt(
    FairnessDAOProposalRegistryArtifact.abi,
    fairnessDAOProposalRegistryAddress,
    signers[0],
  );
  log(`FairnessDAOProposalRegistry deployed address: ${fairnessDAOProposalRegistry.address}`);

  /** @dev We create a proposal, and upload it on IPFS. **/

  type Proposal = {
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

  /// @dev Example of Proposal.
  const proposalToSubmit: Proposal = {
    title: "FIP#X: Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    voteChoices: ["Yes", "No", "Maybe"],
    totalVoteChoices: 3,
    startTime: 1663683113, // 16:11
    proposalLevel: 0,
    submittedAt: 1663680931, // 15:35
    submitterAddress: ethers.constants.AddressZero,
    signedProposal:
      "0x14d3b9801457fd86ee31c5a8915eb0218f5cb80fa6e748986645bc7f683875fa36694eb2d679102b32e70ae5109e6c955b2c6bfdb51d0160aa6ec9f6bda7eb601c",
  };

  /** @dev Update these secret values **/
  const projectId = "x";
  const projectSecret = "x";
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

  /** @dev Before we submit the proposal, we need to setup an allowance for the vesting token burn. **/
  const allowanceTx = await fairnessDAOFairVesting.approve(
    fairnessDAOProposalRegistry.address,
    ethers.utils.parseEther("999999999999999999999999999999"),
    overrides,
  );
  await allowanceTx.wait();
  log(`allowance tx hash: ${allowanceTx.hash}`);

  /** @dev Now we can submit the proposal on-chain. **/
  const submitProposalTx = await fairnessDAOProposalRegistry.submitProposal(
   proposalToSubmit.startTime,
    proposalURI.path,
    proposalToSubmit.totalVoteChoices,
    proposalToSubmit.proposalLevel,
    overrides,
  );
  await submitProposalTx.wait();
  log(`submitProposal tx hash: ${submitProposalTx.hash}`);

  /** @dev We can then vote on the proposal submitted above once the time is correct. **/
  const voteOnProposalTx = await fairnessDAOProposalRegistry.voteOnProposal(0, 0, overrides); /// Proposal 0 - Vote: YES
  await voteOnProposalTx.wait();
  log(`voteOnProposal tx hash: ${voteOnProposalTx.hash}`);

  /** @dev Retrieve the details on-chain of a proposal. **/
  /// @dev Single view.
  log(await fairnessDAOProposalRegistry.viewProposal(0));

  /// @dev Multi view.
  /// It's better to use it with more than one proposal.
  log(await fairnessDAOProposalRegistry.viewMultipleProposals(0, 0)); /// startIndex: 0 | endIndex: 0 - 0/0 since we only have the item 0 in storage.
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
