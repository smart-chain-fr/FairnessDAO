// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {IFairnessDAOFactoryServiceRegistry} from
    "../contracts/Interfaces/IFairnessDAOFactoryServiceRegistry.sol";

/// @title DebugFairnessDAOFactoryServiceRegistry
/// @dev Simple debugging script.
/// @author Smart-Chain Team

contract DebugFairnessDAOFactoryServiceRegistry is Test {
    /// @dev To replace with the proper values in production.
    address public fairnessDAOFactoryServiceRegistryAddress =
        address(0x9C28a736a6645fF601B6f651d5A10Db4f6cDe1Fd);

    address public fairnessDAOProposalRegistryTargetAddress =
        address(0xe7Be23E07FA4309f121E4c78B87720bb0Ee1E89f);

    function run() public {
        vm.startBroadcast();

        IFairnessDAOFactoryServiceRegistry(
            fairnessDAOFactoryServiceRegistryAddress
        ).owner();
        IFairnessDAOFactoryServiceRegistry(
            fairnessDAOFactoryServiceRegistryAddress
        ).newSubdomain(
            "youcansetanysubdomainyouwanthere", // "youcansetanysubdomainyouwanthere" is taken now, use something else. // "subdomaintest",
            "ftest",
            msg.sender,
            fairnessDAOProposalRegistryTargetAddress
        );

        console.log(msg.sender);
        console.log(address(fairnessDAOFactoryServiceRegistryAddress));

        vm.stopBroadcast();
    }
}
