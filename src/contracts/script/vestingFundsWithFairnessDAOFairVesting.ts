import { ethers } from "hardhat";
import { Signer } from "ethers";
import MockERC20Artifact from "../artifacts/contracts/Mocks/MockERC20.sol/MockERC20.json";
import FairnessDAOFairVestingArtifact from "../artifacts/contracts/FairnessDAOFairVesting.sol/FairnessDAOFairVesting.json";

const log = console.log;

async function main() {
  /** @dev INITIAL VALUES **/
  /** @dev Update the ERC-20 targeted address **/
  const fairTokenTargetAddress = ethers.constants.AddressZero;
  /** @dev Update the FairnessDAOFairVesting contract address **/
  const fairnessDAOFairVestingAddress = ethers.constants.AddressZero;

  let overrides = {
    gasPrice: ethers.utils.parseUnits("30.0", "gwei"),
  };

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

  /** @dev If the fairTokenTarget is the MockERC20 contract, we can use its faucet. **/
  const faucetTx = await fairTokenTarget.faucet(ethers.utils.parseEther("1"));
  await faucetTx.wait();
  log(`faucet tx hash: ${faucetTx.hash}`);

  /** @dev We then need to setup the allowance for the vesting. **/
  const allowanceTx = await fairTokenTarget.approve(
    fairnessDAOFairVesting.address,
    ethers.utils.parseEther("1"),
    overrides,
  );
  await allowanceTx.wait();
  log(`allowance tx hash: ${allowanceTx.hash}`);

  /** @dev Once the allowance is approved, the vesting can be initiated by the user. **/
  const initiateVestingTx = await fairnessDAOFairVesting.initiateVesting(ethers.utils.parseEther("1"), overrides);
  await initiateVestingTx.wait();
  log(`Initiate vesting tx hash: ${initiateVestingTx.hash}`);

  /** @dev We then need to setup the allowance for the vesting. **/
  const allowanceTx2 = await fairTokenTarget.approve(
    fairnessDAOFairVesting.address,
    ethers.utils.parseEther("2"),
    overrides,
  );
  await allowanceTx2.wait();
  log(`allowance 2 tx hash: ${allowanceTx2.hash}`);

  /** @dev If the fairTokenTarget is the MockERC20 contract, we can use its faucet. **/
  const faucetTx2 = await fairTokenTarget.faucet(ethers.utils.parseEther("2"));
  await faucetTx2.wait();
  log(`faucet 2 tx hash: ${faucetTx2.hash}`);

  /** @dev The vesting initiation is mandatory if the user wants to increase its vesting. **/
  const increaseVestingTx = await fairnessDAOFairVesting.increaseVesting(ethers.utils.parseEther("2"), overrides);
  await increaseVestingTx.wait();
  log(`Increase vesting tx hash: ${increaseVestingTx.hash}`);

  /** @dev The user can preview its voting token rewards at any time if he has an active vesting. **/
  log(await fairnessDAOFairVesting.getClaimableFairVesting(await signers[0].getAddress()));

  /** @dev The user can claim its voting token rewards at any time if he has an active vesting. **/
  const claimVestingRewardsTx = await fairnessDAOFairVesting.updateFairVesting(await signers[0].getAddress());
  await claimVestingRewardsTx.wait();
  log(`Claim vesting rewards tx hash: ${claimVestingRewardsTx.hash}`);

  log(await fairnessDAOFairVesting.balanceOf(await signers[0].getAddress()));

  /** @dev The user can claim its initial stake if he burns his entire holding of voting tokens. **/
  const withdrawVestingTx = await fairnessDAOFairVesting.withdrawVesting(
    await fairnessDAOFairVesting.balanceOf(await signers[0].getAddress()),
  );
  await withdrawVestingTx.wait();
  log(`Withdraw vesting tx hash: ${withdrawVestingTx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
