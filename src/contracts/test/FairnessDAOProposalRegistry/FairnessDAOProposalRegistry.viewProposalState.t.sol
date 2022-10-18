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

contract FairnessDAOProposalRegistryViewProposalStateTest is
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

    /// @dev Should not allow the caller to view a proposal if the latter does not exist.
    function testFuzz_viewProposal_func_withRevert_proposalDoesNotExist(
        uint256 proposalId
    ) public {
        vm.assume(proposalId != 0);

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__ProposalDoesNotExist
                .selector
        );
        fairnessDAOProposalRegistry.viewProposal(proposalId);
    }

    /// @dev Should allow the caller to view a proposal that has not started yet with the proper NotStarted status.
    function test_viewProposal_func_shouldReturnNotStartedForNonStartedProposalVoting(
    ) public {
        FairnessDAOProposalRegistry.Proposal memory proposal =
            fairnessDAOProposalRegistry.viewProposal(initialProposalId);
        assertEq(proposal.proposerAddress, address(this));
        assertEq(proposal.startTime, defaultStartTime);
        assertEq(proposal.endTime, defaultStartTime + 14 days);
        assertEq(proposal.proposalTotalDepth, proposalTotalDepth);
        assertEq(proposal.proposalURI, "proposalURI");
        assertEq(
            uint8(proposal.votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.NotStarted)
        );
        assertEq(
            uint8(proposal.proposalLevel),
            uint8(FairnessDAOProposalRegistry.ProposalLevel.SP)
        );
        assertGt(proposal.amountOfVestingTokensBurnt, 0);
    }

    /// @dev Should allow the caller to view a proposal that has its voting period started but its status is not updated on the contract storage yet with `voteOnProposal()`.
    function test_viewProposal_func_shouldReturnInProgressForStartedProposalVoting(
    ) public {
        skip(defaultStartTime);

        FairnessDAOProposalRegistry.Proposal memory proposal =
            fairnessDAOProposalRegistry.viewProposal(initialProposalId);
        assertEq(proposal.proposerAddress, address(this));
        assertEq(proposal.startTime, defaultStartTime);
        assertEq(proposal.endTime, defaultStartTime + 14 days);
        assertEq(proposal.proposalTotalDepth, proposalTotalDepth);
        assertEq(proposal.proposalURI, "proposalURI");
        assertEq(
            uint8(proposal.votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.InProgress)
        );
        assertEq(
            uint8(proposal.proposalLevel),
            uint8(FairnessDAOProposalRegistry.ProposalLevel.SP)
        );
        assertGt(proposal.amountOfVestingTokensBurnt, 0);
    }

    /// @dev Should allow the caller to view a proposal that has its voting period ended but its status is not updated on the contract storage yet with `finalizeProposal()`.
    function test_viewProposal_func_shouldReturnWaitingForFinalizedForEndeddProposalVoting(
    ) public {
        skip(defaultStartTime + 14 days);

        FairnessDAOProposalRegistry.Proposal memory proposal =
            fairnessDAOProposalRegistry.viewProposal(initialProposalId);
        assertEq(proposal.proposerAddress, address(this));
        assertEq(proposal.startTime, defaultStartTime);
        assertEq(proposal.endTime, defaultStartTime + 14 days);
        assertEq(proposal.proposalTotalDepth, proposalTotalDepth);
        assertEq(proposal.proposalURI, "proposalURI");
        assertEq(
            uint8(proposal.votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.WaitingForFinalized)
        );
        assertEq(
            uint8(proposal.proposalLevel),
            uint8(FairnessDAOProposalRegistry.ProposalLevel.SP)
        );
        assertGt(proposal.amountOfVestingTokensBurnt, 0);
    }
}
