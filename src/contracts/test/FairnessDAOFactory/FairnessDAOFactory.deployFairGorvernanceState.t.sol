// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFactory} from
    "../initState/InitFairnessDAOProposalRegistry.sol";
import {IFairnessDAOProposalRegistry} from
    "../../contracts/Interfaces/IFairnessDAOProposalRegistry.sol";
import {IFairnessDAOFairVesting} from
    "../../contracts/Interfaces/IFairnessDAOFairVesting.sol";

contract FairnessDAOFactorydeployFairGovernanceStateTest is
    Test,
    InitFairnessDAOFactory
{
    /// @dev Should have library address for cloning contracts
    function test_libraryAddress_func() public {
        assertEq(
            fairnessDAOFactory.vestingLibraryAddress(),
            address(fairnessDAOFairVesting)
        );
        assertEq(
            fairnessDAOFactory.proposalLibraryAddress(),
            address(fairnessDAOProposalRegistry)
        );
        (uint256 vestingCounter, uint256 proposalCounter) =
            fairnessDAOFactory.getCountersId();
        assertEq(vestingCounter, 1);
        assertEq(proposalCounter, 1);
    }

    /// @dev Should deploy fair vesting contract with random parameters
    function testFuzz_deployFairGovernanceForERC20TokenClone_func(
        uint256 initMinimumSupplyShareRequiredForSubmittingProposals,
        uint256 initialVoteTimeLengthSoftProposal,
        uint256 initialVoteTimeLengthHardProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForSoftProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForHardProposal,
        uint256 initialMinimumVoterShareRequiredForSoftProposal,
        uint256 initialMinimumVoterShareRequiredForHardProposal,
        uint256 initalBoostedRewardBonusValue
    ) public {
        address deployedInstanceAddress = fairnessDAOFactory
            .deployFairGovernanceForERC20TokenClone(
            1,
            initMinimumSupplyShareRequiredForSubmittingProposals,
            initialVoteTimeLengthSoftProposal,
            initialVoteTimeLengthHardProposal,
            initialMinimumTotalSupplyShareRequiredForSoftProposal,
            initialMinimumTotalSupplyShareRequiredForHardProposal,
            initialMinimumVoterShareRequiredForSoftProposal,
            initialMinimumVoterShareRequiredForHardProposal,
            initalBoostedRewardBonusValue
        );

        assertEq(
            IFairnessDAOProposalRegistry(deployedInstanceAddress)
                .minimumSupplyShareRequiredForSubmittingProposals(),
            initMinimumSupplyShareRequiredForSubmittingProposals
        );
        assertEq(
            IFairnessDAOProposalRegistry(deployedInstanceAddress)
                .voteTimeLengthSoftProposal(),
            initialVoteTimeLengthSoftProposal
        );
        assertEq(
            IFairnessDAOProposalRegistry(deployedInstanceAddress)
                .voteTimeLengthHardProposal(),
            initialVoteTimeLengthHardProposal
        );
        assertEq(
            IFairnessDAOProposalRegistry(deployedInstanceAddress)
                .minimumTotalSupplyShareRequiredForSoftProposal(),
            initialMinimumTotalSupplyShareRequiredForSoftProposal
        );
        assertEq(
            IFairnessDAOProposalRegistry(deployedInstanceAddress)
                .minimumTotalSupplyShareRequiredForHardProposal(),
            initialMinimumTotalSupplyShareRequiredForHardProposal
        );
        assertEq(
            IFairnessDAOProposalRegistry(deployedInstanceAddress)
                .minimumVoterShareRequiredForSoftProposal(),
            initialMinimumVoterShareRequiredForSoftProposal
        );
        assertEq(
            IFairnessDAOProposalRegistry(deployedInstanceAddress)
                .minimumVoterShareRequiredForHardProposal(),
            initialMinimumVoterShareRequiredForHardProposal
        );
        assertEq(
            IFairnessDAOProposalRegistry(deployedInstanceAddress)
                .boostedRewardBonusValue(),
            initalBoostedRewardBonusValue
        );
        assertEq(
            IFairnessDAOProposalRegistry(deployedInstanceAddress)
                .fairnessDAOFairVesting(),
            fairnessDAOFactory.indexToFairnessDAOVestingAddress(1)
        );
    }
}
