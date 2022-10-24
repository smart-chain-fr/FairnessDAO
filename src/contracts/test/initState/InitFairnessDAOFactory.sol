// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {FairnessDAOFactory} from "../../contracts/FairnessDAOFactory.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";
import {FairnessDAOProposalRegistry} from
    "../../contracts/FairnessDAOProposalRegistry.sol";
import {FairnessDAOProposalRegistry} from
    "../../contracts/FairnessDAOProposalRegistry.sol";

abstract contract InitFairnessDAOFactory is Test {
    FairnessDAOFactory fairnessDAOFactory;
    FairnessDAOFairVesting fairnessDAOFairVesting;
    FairnessDAOProposalRegistry fairnessDAOProposalRegistry;

    function setUp() public virtual {
        fairnessDAOFactory = new FairnessDAOFactory();
        fairnessDAOFairVesting = new FairnessDAOFairVesting();
        fairnessDAOProposalRegistry = new FairnessDAOProposalRegistry();
        fairnessDAOFactory.setLibraryAddress(
            address(fairnessDAOFairVesting),
            address(fairnessDAOProposalRegistry)
        );
    }
}
