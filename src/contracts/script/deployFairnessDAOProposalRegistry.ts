import { ethers } from "hardhat";
import { Signer } from "ethers";
import FairnessDAOFairVestingArtifact from "../artifacts/contracts/FairnessDAOFairVesting.sol/FairnessDAOFairVesting.json";

const log = console.log;

async function main() {
  /** @dev INITIAL VALUES **/
  const fairnessDAOFairVestingAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  /** @dev DEPLOY VALUES **/
  /** @dev Update the FairDAO vesting targeted address **/
  // const initialFairnessDAOFairVesting = ethers.constants.AddressZero;
  const initialFairnessDAOFairVesting = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const initMinimumSupplyShareRequiredForSubmittingProposals = (1e18 * 1) / 1000;
  const initialVoteTimeLengthSoftProposal = 1209600; // 14 days: 1209600s
  const initialVoteTimeLengthHardProposal = 2419200; // 28 days: 2419200s
  const initialMinimumTotalSupplyShareRequiredForSoftProposal = ethers.utils.parseEther("0.33"); // (1e18 * 330) / 1000;
  const initialMinimumTotalSupplyShareRequiredForHardProposal = ethers.utils.parseEther("0.66"); // (1e18 * 660) / 1000;
  const initialMinimumVoterShareRequiredForSoftProposal = ethers.utils.parseEther("0.1"); // (1e18 * 100) / 1000;
  const initialMinimumVoterShareRequiredForHardProposal = ethers.utils.parseEther("0.2"); // (1e18 * 200) / 1000;
  const initalBoostedRewardBonusValue = ethers.utils.parseEther("1"); // (1e18 * 1000) / 1000;

  let overrides = {
    gasPrice: ethers.utils.parseUnits("30.0", "gwei"),
  };

  let signers: Signer[];
  signers = await ethers.getSigners();

  const FairnessDAOProposalRegistryFactory = await ethers.getContractFactory("FairnessDAOProposalRegistry");
  let fairnessDAOProposalRegistry = await FairnessDAOProposalRegistryFactory.deploy(
    initialFairnessDAOFairVesting,
    initMinimumSupplyShareRequiredForSubmittingProposals,
    initialVoteTimeLengthSoftProposal,
    initialVoteTimeLengthHardProposal,
    initialMinimumTotalSupplyShareRequiredForSoftProposal,
    initialMinimumTotalSupplyShareRequiredForHardProposal,
    initialMinimumVoterShareRequiredForSoftProposal,
    initialMinimumVoterShareRequiredForHardProposal,
    initalBoostedRewardBonusValue,
    overrides,
  );
  log(`FairnessDAOProposalRegistry deployment transaction hash: ${fairnessDAOProposalRegistry.deployTransaction.hash}`);
  await fairnessDAOProposalRegistry.deployed();
  log(`FairnessDAOProposalRegistry deployed address: ${fairnessDAOProposalRegistry.address}`);

  /** @dev RETRIEVING CONTRACT INSTANCES **/
  const fairnessDAOFairVesting = await ethers.getContractAt(
    FairnessDAOFairVestingArtifact.abi,
    fairnessDAOFairVestingAddress,
    signers[0],
  );
  log(`FairnessDAOFairVesting deployed address: ${fairnessDAOFairVesting.address}`);
  /** @dev We update the vesting contract with the proposal registry address **/
  const registerTx = await fairnessDAOFairVesting.whitelistProposalRegistryAddress(
    fairnessDAOProposalRegistry.address,
    overrides,
  );
  await registerTx.wait();
  log(`Registering the proposal registry address tx hash: ${registerTx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
