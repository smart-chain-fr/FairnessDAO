// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {FairnessDAOFactory} from "../contracts/FairnessDAOFactory.sol";

/// @title DeployFairnessDAOFactory
/// @dev Simple deploying script.
/// @author Smart-Chain Team

contract DeployFairnessDAOFactory is Test {
    FairnessDAOFactory public fairnessDAOFactory;

    function run() public {
        vm.startBroadcast();

        fairnessDAOFactory = new FairnessDAOFactory(
        );

        console.log(msg.sender);
        console.log(address(fairnessDAOFactory));

        vm.stopBroadcast();
    }
}
