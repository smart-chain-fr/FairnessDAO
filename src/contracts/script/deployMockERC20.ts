import { ethers } from "hardhat";
import { Signer } from "ethers";

const log = console.log;

async function main() {
  /** @dev DEPLOY VALUES **/
  const initTokenName = "Fair Token";
  const initTokenSymbol = "FAIR";
  const initialSupply = 0;

  let overrides = {
    gasPrice: ethers.utils.parseUnits("30.0", "gwei"),
  };

  let signers: Signer[];
  signers = await ethers.getSigners();

  const MockERC20Factory = await ethers.getContractFactory("MockERC20");
  let mockERC20 = await MockERC20Factory.deploy(initTokenName, initTokenSymbol, initialSupply, overrides);
  log(`MockERC20 deployment transaction hash: ${mockERC20.deployTransaction.hash}`);
  await mockERC20.deployed();
  log(`MockERC20 deployed address: ${mockERC20.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
