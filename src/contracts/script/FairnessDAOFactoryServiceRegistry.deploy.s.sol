// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {FairnessDAOFactoryServiceRegistry} from
    "../contracts/FairnessDAOFactoryServiceRegistry.sol";

/// @title DeployFairnessDAOFactoryServiceRegistry
/// @dev Simple deploying script.
/// @author Smart-Chain Team

contract DeployFairnessDAOFactoryServiceRegistry is Test {
    FairnessDAOFactoryServiceRegistry public fairnessDAOFactoryServiceRegistry;

    /// @dev To replace with the proper values in production.
    address public initialENSRegistryWithFallbackAddress =
        address(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
    address public initialPublicResolverAddress =
        address(0xf6305c19e814d2a75429Fd637d01F7ee0E77d615);
    string public topdomain = "eth";
    /// @dev Update this address.
    address public initialFairnessDAOFactoryAddress =
        address(0x6CaE3a76d2dBB49301A5dc4aFADeDC1d1375d0Ed);

    function run() public {
        vm.startBroadcast();

        fairnessDAOFactoryServiceRegistry =
        new FairnessDAOFactoryServiceRegistry(
       initialENSRegistryWithFallbackAddress,initialPublicResolverAddress,topdomain
        );

        fairnessDAOFactoryServiceRegistry.setFairnessDAOFactoryAddress(
            initialFairnessDAOFactoryAddress
        );

        console.log(msg.sender);
        console.log(address(fairnessDAOFactoryServiceRegistry));

        vm.stopBroadcast();
    }
}
