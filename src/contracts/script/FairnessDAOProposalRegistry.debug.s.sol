// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {IFairnessDAOFairVesting} from
    "../contracts/Interfaces/IFairnessDAOFairVesting.sol";
import {IFairnessDAOProposalRegistry} from
    "../contracts/Interfaces/IFairnessDAOProposalRegistry.sol";
import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {FairnessDAOFairVesting} from "../contracts/FairnessDAOFairVesting.sol";
import {FairnessDAOProposalRegistry} from
    "../contracts/FairnessDAOProposalRegistry.sol";

/// @title DebugFairnessDAOProposalRegistry
/// @dev Simple debugging script.
/// @author Smart-Chain Team

contract DebugFairnessDAOProposalRegistry is Test {
    /// @dev To replace with the proper values in production.
    address public fairnessDAOFairVestingAddress =
        address(0xDd4EeB6C1E6eDD368B452D963FD96F9FcbCE4CD4);
    address public fairnessDAOProposalRegistryAddress =
        address(0x165d05092377512d2f04BfF5Cee1b7d97d106A32);

    function run() public {
        vm.startBroadcast();

        IFairnessDAOProposalRegistry(fairnessDAOProposalRegistryAddress)
            .proposalCount();

        console.log(msg.sender);

        vm.stopBroadcast();
    }
}
