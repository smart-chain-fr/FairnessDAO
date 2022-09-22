// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {IFairnessDAOFactoryServiceRegistry} from
    "../contracts/Interfaces/IFairnessDAOFactoryServiceRegistry.sol";

/// @title DebugFairnessDAOFactoryServiceRegistry
/// @dev Simple deploying script.
/// @author Smart-Chain Team

contract DebugFairnessDAOFactoryServiceRegistry is Test {
    /// @dev To replace with the proper values in production.
    address public fairnessDAOFactoryServiceRegistryAddress =
        address(0xf096791906B7D07C560F3D127D52f570feC90948);

    function run() public {
        vm.startBroadcast();

        IFairnessDAOFactoryServiceRegistry(
            fairnessDAOFactoryServiceRegistryAddress
        ).owner();
        IFairnessDAOFactoryServiceRegistry(
            fairnessDAOFactoryServiceRegistryAddress
        ).newSubdomain("subdomaintest", "ftest", msg.sender, msg.sender);

        console.log(msg.sender);
        console.log(address(fairnessDAOFactoryServiceRegistryAddress));

        vm.stopBroadcast();
    }
}
