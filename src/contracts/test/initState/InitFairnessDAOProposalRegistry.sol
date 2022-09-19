// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {InitMockERC20} from "../initState/InitMockERC20.sol";
import {InitFairnessDAOFairVestingWithERC20} from
    "./InitFairnessDAOFairVestingWithERC20.sol";
import {FairnessDAOProposalRegistry} from
    "../../contracts/FairnessDAOProposalRegistry.sol";

abstract contract InitFairnessDAOProposalRegistry is
    Test,
    InitFairnessDAOFairVestingWithERC20
{
    FairnessDAOProposalRegistry fairnessDAOProposalRegistry;

    uint256 public initMinimumSupplyShareRequiredForSubmittingProposals =
        ((1e18 * 1) / 1000);
    uint256 public initialVoteTimeLengthSoftProposal = 14 days;
    uint256 public initialVoteTimeLengthHardProposal = 28 days;
    uint256 public initialMinimumTotalSupplyShareRequiredForSoftProposal =
        ((1e18 * 330) / 1000);
    uint256 public initialMinimumTotalSupplyShareRequiredForHardProposal =
        ((1e18 * 660) / 1000);
    uint256 public initialMinimumVoterShareRequiredForSoftProposal =
        ((1e18 * 100) / 1000);
    uint256 public initialMinimumVoterShareRequiredForHardProposal =
        ((1e18 * 200) / 1000);
    uint256 public initalBoostedRewardBonusValue = ((1e18 * 1000) / 1000);

    function setUp() public virtual override {
        super.setUp();

        fairnessDAOProposalRegistry = new FairnessDAOProposalRegistry(
            address(fairnessDAOFairVesting),
            initMinimumSupplyShareRequiredForSubmittingProposals,
            initialVoteTimeLengthSoftProposal,
            initialVoteTimeLengthHardProposal,
            initialMinimumTotalSupplyShareRequiredForSoftProposal,
            initialMinimumTotalSupplyShareRequiredForHardProposal,
            initialMinimumVoterShareRequiredForSoftProposal,
            initialMinimumVoterShareRequiredForHardProposal,
            initalBoostedRewardBonusValue);
    }
}
