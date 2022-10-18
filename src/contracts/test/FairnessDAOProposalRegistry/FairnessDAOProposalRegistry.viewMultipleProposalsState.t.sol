// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOProposalRegistry} from
    "../initState/InitFairnessDAOProposalRegistry.sol";
import {FairnessDAOProposalRegistry} from
    "../../contracts/FairnessDAOProposalRegistry.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";
import {MockERC20} from "../../contracts/Mocks/MockERC20.sol";

contract FairnessDAOProposalRegistryViewMultipleProposalsStateTest is
    Test,
    InitFairnessDAOProposalRegistry
{
    uint256 public initialProposalId = 0;
    uint256 public initialAmountToVest = 1 ether;
    uint256 public defaultStartTime = 10;
    uint8 public proposalTotalDepth = 10;

    function setUp() public virtual override {
        super.setUp();

        /// @dev We initialize a vesting with the vesting contract.
        /// We then make a proposal, and set another account on the vesting governance to allow another party for voting.
        mockERC20.faucet(initialAmountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), initialAmountToVest);
        fairnessDAOFairVesting.initiateVesting(initialAmountToVest);
        /// @dev We skip 1 second, which should reward the user of 1 ether equivalent of vesting tokens.
        skip(1);
        fairnessDAOFairVesting.updateFairVesting(address(this));
        fairnessDAOFairVesting.whitelistProposalRegistryAddress(
            address(fairnessDAOProposalRegistry)
        );

        fairnessDAOFairVesting.approve(
            address(fairnessDAOProposalRegistry), type(uint256).max
        );

        /// @dev We set random default values with an SP level.
        fairnessDAOProposalRegistry.submitProposal(
            defaultStartTime,
            "proposalURI",
            proposalTotalDepth,
            FairnessDAOProposalRegistry.ProposalLevel.SP
        );
    }

    /// @dev Should not allow the caller to view multiple proposals if the index bounds are incorrect.
    function testFuzz_viewMultipleProposals_func_withRevert_incorrectBoundIndex(
        uint256 fromIndex,
        uint256 endIndex
    ) public {
        vm.assume(fromIndex > endIndex);

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__IncorrectBoundIndex
                .selector
        );
        fairnessDAOProposalRegistry.viewMultipleProposals(fromIndex, endIndex);
    }

    /// @dev Should not allow the caller to view multiple proposals if they do not exist.
    function testFuzz_viewMultipleProposals_func_withRevert_proposalDoesNotExist(
        uint256 fromIndex,
        uint256 endIndex
    ) public {
        vm.assume(endIndex > fromIndex);

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__ProposalDoesNotExist
                .selector
        );
        fairnessDAOProposalRegistry.viewMultipleProposals(fromIndex, endIndex);
    }

    /// @dev Should allow the caller to view multiple proposals that have not started yet with the proper NotStarted status.
    function test_viewMultipleProposals_func_shouldReturnNotStartedForNonStartedProposalVoting(
    ) public {
        FairnessDAOProposalRegistry.Proposal[] memory proposals =
        fairnessDAOProposalRegistry.viewMultipleProposals(
            initialProposalId, initialProposalId
        );
        assertEq(proposals[0].proposerAddress, address(this));
        assertEq(proposals[0].startTime, defaultStartTime);
        assertEq(proposals[0].endTime, defaultStartTime + 14 days);
        assertEq(proposals[0].proposalTotalDepth, proposalTotalDepth);
        assertEq(proposals[0].proposalURI, "proposalURI");
        assertEq(
            uint8(proposals[0].votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.NotStarted)
        );
        assertEq(
            uint8(proposals[0].proposalLevel),
            uint8(FairnessDAOProposalRegistry.ProposalLevel.SP)
        );
        assertGt(proposals[0].amountOfVestingTokensBurnt, 0);
    }

    /// @dev Should allow the caller to view multiple proposals that have their voting period started but its status is not updated on the contract storage yet with `voteOnProposal()`.
    function test_viewMultipleProposals_func_shouldReturnInProgressForStartedProposalVoting(
    ) public {
        skip(defaultStartTime);

        FairnessDAOProposalRegistry.Proposal[] memory proposals =
        fairnessDAOProposalRegistry.viewMultipleProposals(
            initialProposalId, initialProposalId
        );
        assertEq(proposals[0].proposerAddress, address(this));
        assertEq(proposals[0].startTime, defaultStartTime);
        assertEq(proposals[0].endTime, defaultStartTime + 14 days);
        assertEq(proposals[0].proposalTotalDepth, proposalTotalDepth);
        assertEq(proposals[0].proposalURI, "proposalURI");
        assertEq(
            uint8(proposals[0].votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.InProgress)
        );
        assertEq(
            uint8(proposals[0].proposalLevel),
            uint8(FairnessDAOProposalRegistry.ProposalLevel.SP)
        );
        assertGt(proposals[0].amountOfVestingTokensBurnt, 0);
    }

    /// @dev Should allow the caller to view multiple proposals that have their voting period ended but its status is not updated on the contract storage yet with `finalizeProposal()`.
    function test_viewMultipleProposals_func_shouldReturnWaitingForFinalizedForEndeddProposalVoting(
    ) public {
        skip(defaultStartTime + 14 days);

        FairnessDAOProposalRegistry.Proposal[] memory proposals =
        fairnessDAOProposalRegistry.viewMultipleProposals(
            initialProposalId, initialProposalId
        );
        assertEq(proposals[0].proposerAddress, address(this));
        assertEq(proposals[0].startTime, defaultStartTime);
        assertEq(proposals[0].endTime, defaultStartTime + 14 days);
        assertEq(proposals[0].proposalTotalDepth, proposalTotalDepth);
        assertEq(proposals[0].proposalURI, "proposalURI");
        assertEq(
            uint8(proposals[0].votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.WaitingForFinalized)
        );
        assertEq(
            uint8(proposals[0].proposalLevel),
            uint8(FairnessDAOProposalRegistry.ProposalLevel.SP)
        );
        assertGt(proposals[0].amountOfVestingTokensBurnt, 0);
    }
}
