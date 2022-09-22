import { ethers } from "hardhat";
import { Signer, BigNumber } from "ethers";
const got = require("got");
import MockERC20Artifact from "../artifacts/contracts/Mocks/MockERC20.sol/MockERC20.json";
import FairnessDAOFairVestingArtifact from "../artifacts/contracts/FairnessDAOFairVesting.sol/FairnessDAOFairVesting.json";
import FairnessDAOProposalRegistryArtifact from "../artifacts/contracts/FairnessDAOProposalRegistry.sol/FairnessDAOProposalRegistry.json";

const log = console.log;

async function main() {
  /** @dev INITIAL VALUES **/
  /** @dev Update the ERC-20 targeted address **/
  const fairTokenTargetAddress = "0xb082f8547F959417b0c75Da4a8E1F291F0495b54";
  /** @dev Update the FairnessDAOFairVesting contract address **/
  const fairnessDAOFairVestingAddress = "0xdd4eeb6c1e6edd368b452d963fd96f9fcbce4cd4";
  /** @dev Update the FairnessDAOProposalRegistry contract address **/
  const fairnessDAOProposalRegistryAddress = "0x165d05092377512d2f04BfF5Cee1b7d97d106A32";

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

  type ProposalInfo = {
    /// On-Chain ProposalDetails
    proposerAddress?: string;
    startTime?: BigNumber;
    endTime?: BigNumber;
    proposalTotalDepth: BigNumber;
    proposalURI?: string;
    votingStatus?: number; /// @dev Between 0 and 6.
    proposalLevel?: number; /// @dev Either 0 or 1.
    amountOfVestingTokensBurnt?: BigNumber; /// @dev use `ethers.utils.formatUnits(_BigNumValue_, 18)` to display it as a string.
    /// IPFS ProposalDetails
    title?: string;
    description?: string;
    voteChoices?: string[];
    /// VotingStatus
    totalAmountOfVotingTokensUsed?: BigNumber; /// @dev use `ethers.utils.formatUnits(_BigNumValue_, 18)` to display it as a string.
    totalAmountOfUniqueVoters?: BigNumber;
    proposalDepthToTotalAmountOfVote: BigNumber[];
  };

  /// @dev We retrieve the total amount of proposals stored inside the contract.
  const amountOfSubmittedProposals = await fairnessDAOProposalRegistry.proposalCount();
  log(`There are currently ${amountOfSubmittedProposals} submitted proposals.`);

  /// @dev We init an array for storing the proposals' info.
  var arrayOfProposals = new Array<ProposalInfo>(amountOfSubmittedProposals);

  /// @dev We iterate through each proposal.
  for (var i = 0; i < amountOfSubmittedProposals; ++i) {
    /// @dev We first get the info of the proposal sent during the submission process.
    const tmpProposal: any = await fairnessDAOProposalRegistry.viewProposal(i);

    var tmpProposalInfo: ProposalInfo = {
      proposerAddress: tmpProposal.proposerAddress,
      startTime: tmpProposal.startTime.toNumber(),
      endTime: tmpProposal.endTime.toNumber(),
      proposalTotalDepth: tmpProposal.proposalTotalDepth.toNumber(),
      proposalURI: tmpProposal.proposalURI,
      votingStatus: tmpProposal.votingStatus, /// @dev Between 0 and 6.
      proposalLevel: tmpProposal.proposalLevel, /// @dev Either 0 or 1.
      amountOfVestingTokensBurnt: tmpProposal.amountOfVestingTokensBurnt,
      proposalDepthToTotalAmountOfVote: new Array<BigNumber>(),
    };

    /// @dev We retrieve the content of the proposal from IPFS.
    const ipfsData: any = await got.get(`https://ipfs.io/ipfs/${tmpProposalInfo.proposalURI}`).json();
    tmpProposalInfo.title = ipfsData.title;
    tmpProposalInfo.description = ipfsData.description;
    tmpProposalInfo.voteChoices = ipfsData.voteChoices;

    /// @dev We now retrieve the info of the proposal from the voting phase.
    /// If the proposal is not in active or passed voting status, everything should be set at 0 by default.
    const tmpVotingStatus: any = await fairnessDAOProposalRegistry.proposalIdToVotingStatus(i);
    tmpProposalInfo.totalAmountOfVotingTokensUsed = tmpVotingStatus.totalAmountOfVotingTokensUsed;
    tmpProposalInfo.totalAmountOfUniqueVoters = tmpVotingStatus.totalAmountOfUniqueVoters;

    /// @dev We then retrieve the amount of vesting tokens used for voting for each proposal voting choice.
    for (var j = 0; j < BigNumber.from(tmpProposalInfo.proposalTotalDepth).toNumber(); ++j) {
      const tmpProposalDepthToTotalAmountOfVote: any =
        await fairnessDAOProposalRegistry.getProposalIdToProposalDepthToTotalAmountOfVote(i, j);
      tmpProposalInfo.proposalDepthToTotalAmountOfVote.push(tmpProposalDepthToTotalAmountOfVote);
    }

    /// @dev Once everything is properly retrieved, we can store it inside the main array.
    arrayOfProposals.push(tmpProposalInfo);
  }

  log(arrayOfProposals);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
