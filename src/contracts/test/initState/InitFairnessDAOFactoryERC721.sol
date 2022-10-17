// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {FairnessDAOFactoryERC721} from
    "../../contracts/FairnessDAOFactoryERC721.sol";
import {FairnessDAOFairERC721Vesting} from
    "../../contracts/FairnessDAOFairERC721Vesting.sol";
import {FairnessDAOProposalRegistry} from
    "../../contracts/FairnessDAOProposalRegistry.sol";
import {FairnessDAOProposalRegistry} from
    "../../contracts/FairnessDAOProposalRegistry.sol";

abstract contract InitFairnessDAOFactoryERC721 is Test {
    FairnessDAOFactoryERC721 fairnessDAOFactoryERC721;
    FairnessDAOFairERC721Vesting fairnessDAOFairERC721Vesting;
    FairnessDAOProposalRegistry fairnessDAOProposalRegistry;

    function setUp() public virtual {
        fairnessDAOFactoryERC721 = new FairnessDAOFactoryERC721();
        fairnessDAOFairERC721Vesting = new FairnessDAOFairERC721Vesting();
        fairnessDAOProposalRegistry = new FairnessDAOProposalRegistry();
        fairnessDAOFactoryERC721.setLibraryAddress(
            address(fairnessDAOFairERC721Vesting),
            address(fairnessDAOProposalRegistry)
        );
    }
}
