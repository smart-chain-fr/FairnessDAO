// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {MockERC20} from "../contracts/Mocks/MockERC20.sol";

/// @title DeployMockERC20
/// @dev Simple deploying script.
/// @author Smart-Chain Team

contract DeployMockERC20 is Test {
    MockERC20 public mockERC20;

    /// @dev To replace with the proper values in production.
    string public initTokenName = "FairnessDAO";
    string public initTokenSymbol = "FDAO";
    uint256 public initialSupply = 0;

    function run() public {
        vm.startBroadcast();

        mockERC20 = new MockERC20(
          initTokenName,
            initTokenSymbol,
           initialSupply
        );

        console.log(msg.sender);
        console.log(address(mockERC20));

        vm.stopBroadcast();
    }
}
