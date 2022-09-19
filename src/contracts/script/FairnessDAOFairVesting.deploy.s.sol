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
    /// @notice zInflationDeltaBp:
    /// 100% = 1000
    /// 10%  = 100
    /// 1%   = 10
    /// 0.1% = 1
    uint256 public zInflationDeltaBp = 1000; // 100%
    uint256 public initZInflationDelta = (1e18 * zInflationDeltaBp) / 1000;

    function run() public {
        vm.startBroadcast();

        fairnessDAOFairVesting = new FairnessDAOFairVesting(
          initTokenName,
            initTokenSymbol,
            address(initFairTokenTarget),
            initZInflationDelta
        );

        console.log(msg.sender);
        console.log(address(fairnessDAOFairVesting));

        vm.stopBroadcast();
    }
}
