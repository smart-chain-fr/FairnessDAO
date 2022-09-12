import { ethers } from "hardhat";
import { Signer } from "ethers";

const log = console.log;

async function main() {
  /** @dev DEPLOY VALUES **/
  const initTokenName = "Vested Fair Token";
  const initTokenSymbol = "VFAIR";
  /** @dev Update the ERC-20 targeted address **/
  const fairTokenTarget = ethers.constants.AddressZero;
  const initialZInflationDelta = 1;

  let overrides = {
    gasPrice: ethers.utils.parseUnits("30.0", "gwei"),
  };

  let signers: Signer[];
  signers = await ethers.getSigners();

  const FairnessDAOFairVestingFactory = await ethers.getContractFactory("FairnessDAOFairVesting");
  let fairnessDAOFairVesting = await FairnessDAOFairVestingFactory.deploy(
    initTokenName,
    initTokenSymbol,
    fairTokenTarget,
    initialZInflationDelta,
    overrides,
  );
  log(`FairnessDAOFairVesting deployment transaction hash: ${fairnessDAOFairVesting.deployTransaction.hash}`);
  await fairnessDAOFairVesting.deployed();
  log(`FairnessDAOFairVesting deployed address: ${fairnessDAOFairVesting.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
