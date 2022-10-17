// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {FairnessDAOFairVesting} from "../contracts/FairnessDAOFairVesting.sol";

/// @title DeployFairnessDAOFairVesting
/// @dev Simple deploying script.
/// @author Smart-Chain Team

contract DeployFairnessDAOFairVesting is Test {
    FairnessDAOFairVesting public fairnessDAOFairVesting;

    /// @dev To replace with the proper values in production.
    string public initTokenName = "Vested FairnessDAO";
    string public initTokenSymbol = "VeFDAO";
    address public initFairTokenTarget =
        address(0xb082f8547F959417b0c75Da4a8E1F291F0495b54);
    address public initFairDAOProposalRegistry =
        address(0xb082f8547F959417b0c75Da4a8E1F291F0495b54);
    /// @notice zInflationDeltaBp:
    uint256 zInflationDeltaBpPoC = 32; // 0.0000032%
    /// @dev (1e+18* 3,154e+7* (1e+18 * 32/1_000_000_000))/1e+18 = 1e+18
    uint256 initZInflationDelta = (1e18 * zInflationDeltaBpPoC) / 1_000_000_000;

    function run() public {
        vm.startBroadcast();

        fairnessDAOFairVesting = new FairnessDAOFairVesting();
        fairnessDAOFairVesting.initialize(
            initTokenName,
            initTokenSymbol,
            address(initFairTokenTarget),
            initZInflationDelta,
            address(initFairDAOProposalRegistry)
        );

        console.log(msg.sender);
        console.log(address(fairnessDAOFairVesting));

        vm.stopBroadcast();
    }
}
