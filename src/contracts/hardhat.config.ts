import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig, task } from "hardhat/config";

import "solidity-docgen";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "solidity-coverage";
import "@eth-optimism/plugins/hardhat/compiler";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-solhint";
import { hdkey } from "ethereumjs-wallet";
const bip39 = require("bip39");
const rlp = require("rlp");
import keccak from "keccak";
import fs from "fs";
import clui from "clui";
import { ethers } from "hardhat";
const Spinner = clui.Spinner;
const log = console.log;

// const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
// const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "";
// const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
// const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';

const config: HardhatUserConfig = {
  // ovm: {
  //   solcVersion: "0.8.4",
  // },
  defaultNetwork: "hardhat",
  paths: {
    sources: "./contracts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
          optimizer: { enabled: true, runs: 1 },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      gas: 12000000,
      // blockGasLimit: 0x1fffffffffffff, // defaultValue: 12450000
      blockGasLimit: 30_000_000,
      allowUnlimitedContractSize: true,
      chainId: 1,
      initialBaseFeePerGas: 0,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // ropsten: {
    //   url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
    //   accounts: [ROPSTEN_PRIVATE_KEY],
    // },
    // rinkeby: {
    //   url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
    //   accounts: [RINKEBY_PRIVATE_KEY],
    // },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
  docgen: { outputDir: "docs", pageExtension: ".md" },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  gasReporter: {
    enabled: process.env.GAS_REPORTER ? true : false,
    gasPrice: 90,
    coinmarketcap: COINMARKETCAP_API_KEY,
    showTimeSpent: true,
  },
};

// task("mineContractAddress", "Looks for a deployer account that will give leading zeros")
//   .addParam("searchFor", "String to search for")
//   .setAction(async (taskArgs, { network, ethers }) => {
//     let contract_address = "";
//     let address;
//     let mnemonic = "";
//     let privateKey = "";
//     var spin = new Spinner("Mining a wallet...  ", ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]);
//     spin.start();
//     while (contract_address.indexOf(taskArgs.searchFor) != 0) {
//       mnemonic = bip39.generateMnemonic();
//       const seed = await bip39.mnemonicToSeed(mnemonic);
//       const hdwallet = hdkey.fromMasterSeed(seed);
//       const wallet_hdpath = "m/44'/60'/0'/0/";
//       const account_index = 0;
//       let fullPath = wallet_hdpath + account_index;
//       const wallet = hdwallet.derivePath(fullPath).getWallet();
//       privateKey = wallet.getPrivateKeyString();
//       address = wallet.getAddressString();

//       let nonce = 0x00; // The nonce must be a hex literal dear sir
//       let sender = address;

//       let input_arr = [sender, nonce];
//       let rlp_encoded = rlp.encode(input_arr);

//       let contract_address_long = keccak("keccak256").update(rlp_encoded).digest("hex");

//       contract_address = contract_address_long.substring(24); //Trim the first 24 characters
//     }
//     log("\n");
//     log("⛏  Account Mined as " + address + " and set as mnemonic in src/contracts");
//     log("📜 This will create the first contract: " + "0x" + contract_address);
//     log("\n");
//     fs.writeFileSync("./minedWallet.json", JSON.stringify({ mnemonic: mnemonic, privateKey: privateKey }));
//   });

export default config;
