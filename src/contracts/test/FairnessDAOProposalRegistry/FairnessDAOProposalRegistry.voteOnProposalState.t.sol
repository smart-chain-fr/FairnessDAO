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

contract FairnessDAOProposalRegistryVoteOnProposalStateTest is
    Test,
    InitFairnessDAOProposalRegistry
{
    uint256 public initialProposalId = 0;
    uint256 public initialAmountToVest = 1 ether;
    uint256 public defaultStartTime = 10;
    uint8 public proposalTotalDepth = 10;
    address public voterAddress = makeAddr("voterAddress");

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

        fairnessDAOFairVesting.approve(
            address(fairnessDAOProposalRegistry), type(uint256).max
        );

        /// @dev We set random default values.
        fairnessDAOProposalRegistry.submitProposal(
            defaultStartTime,
            "proposalURI",
            proposalTotalDepth,
            FairnessDAOProposalRegistry.ProposalLevel.SP
        );

        /// @dev We also set another DAO member, to avoid relying too much on the test contract.
        startHoax(voterAddress);
        mockERC20.faucet(initialAmountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), initialAmountToVest);
        fairnessDAOFairVesting.initiateVesting(initialAmountToVest);
        /// @dev We skip 1 second, which should reward the user of 1 ether equivalent of vesting tokens.
        skip(1);
        // fairnessDAOFairVesting.updateFairVesting(address(this));
        /// @dev The `voterAddress` account is the one executing the following tests.
        /// vm.stopPrank();
    }

    /// @dev Should not allow the caller to vote on proposal if the latter does not exist.
    function testFuzz_voteOnProposal_func_withRevert_proposalDoesNotExist(
        uint256 proposalId,
        uint256 chosenProposalDepth
    ) public {
        vm.assume(proposalId != 0);

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__ProposalDoesNotExist
                .selector
        );
        fairnessDAOProposalRegistry.voteOnProposal(
            proposalId, chosenProposalDepth
        );
    }

    /// @dev Should not allow the caller to vote on proposal if the selected choice depth does not exist on the targeted proposal.
    function testFuzz_voteOnProposal_func_withRevert_votingDepthChosenDoesNotExistOnProposal(
        uint256 chosenProposalDepth
    ) public {
        vm.assume(chosenProposalDepth > proposalTotalDepth);

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__VotingDepthDoesNotExistInProposalDepth
                .selector
        );
        fairnessDAOProposalRegistry.voteOnProposal(
            initialProposalId, chosenProposalDepth
        );
    }

    /// @dev Should not allow the caller to vote on proposal if the voting period for the latter has not started yet.
    function testFuzz_voteOnProposal_func_withRevert_votingPeriodHasNotStartedYet(
        uint8 chosenProposalDepth
    ) public {
        if (chosenProposalDepth >= proposalTotalDepth) {
            chosenProposalDepth = chosenProposalDepth % proposalTotalDepth;
        }

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__VotingPeriodHasNotStartedYet
                .selector
        );
        fairnessDAOProposalRegistry.voteOnProposal(
            initialProposalId, chosenProposalDepth
        );
    }

    /// @dev Should not allow the caller to vote on proposal if the voting period for the latter has ended.
    function testFuzz_voteOnProposal_func_withRevert_votingPeriodHasEnded(
        uint8 chosenProposalDepth
    ) public {
        if (chosenProposalDepth >= proposalTotalDepth) {
            chosenProposalDepth = chosenProposalDepth % proposalTotalDepth;
        }

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__VotingPeriodHasAlreadyEnded
                .selector
        );
        skip(type(uint128).max);
        fairnessDAOProposalRegistry.voteOnProposal(
            initialProposalId, chosenProposalDepth
        );
    }

    /// @dev Should not allow the caller to vote on proposal if the caller has no voting tokens/is not vesting.
    function testFuzz_voteOnProposal_func_withRevert_cannotVoteIfUserIsNotVesting(
        address randomVoterWithZeroVotingTokens,
        uint8 chosenProposalDepth
    ) public {
        vm.assume(randomVoterWithZeroVotingTokens != address(this));
        vm.assume(randomVoterWithZeroVotingTokens != address(voterAddress));

        if (chosenProposalDepth >= proposalTotalDepth) {
            chosenProposalDepth = chosenProposalDepth % proposalTotalDepth;
        }

        vm.expectRevert(
            FairnessDAOFairVesting
                .FairnessDAOFairVesting__UserIsNotVesting
                .selector
        );
        skip(defaultStartTime);
        vm.stopPrank();
        hoax(randomVoterWithZeroVotingTokens);
        fairnessDAOProposalRegistry.voteOnProposal(
            initialProposalId, chosenProposalDepth
        );
    }

    /// @dev Should not allow the caller to vote on proposal if the caller has no voting tokens even if he had vested.
    function testFuzz_voteOnProposal_func_withRevert_cannotVoteWithZeroWeight(
        address randomVoterWithZeroVotingTokens,
        uint8 chosenProposalDepth
    ) public {
        vm.assume(randomVoterWithZeroVotingTokens != address(this));
        vm.assume(randomVoterWithZeroVotingTokens != address(0));
        vm.assume(randomVoterWithZeroVotingTokens != address(voterAddress));

        if (chosenProposalDepth >= proposalTotalDepth) {
            chosenProposalDepth = chosenProposalDepth % proposalTotalDepth;
        }

        vm.mockCall(
            address(fairnessDAOFairVesting),
            abi.encodeWithSelector(MockERC20.totalSupply.selector),
            abi.encode(type(uint128).max)
        );

        skip(defaultStartTime);
        vm.stopPrank();
        startHoax(randomVoterWithZeroVotingTokens);
        mockERC20.faucet(1);
        mockERC20.approve(address(fairnessDAOFairVesting), 1);
        fairnessDAOFairVesting.initiateVesting(1);
        skip(1);
        fairnessDAOFairVesting.updateFairVesting(
            randomVoterWithZeroVotingTokens
        );
        fairnessDAOFairVesting.burn(1);
        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__CannotVoteWithZeroWeight
                .selector
        );
        fairnessDAOProposalRegistry.voteOnProposal(
            initialProposalId, chosenProposalDepth
        );
        vm.stopPrank();
    }

    /// @dev Should allow the caller to vote on proposal.
    function testFuzz_voteOnProposal_func(uint8 chosenProposalDepth) public {
        if (chosenProposalDepth >= proposalTotalDepth) {
            chosenProposalDepth = chosenProposalDepth % proposalTotalDepth;
        }

        skip(defaultStartTime);

        fairnessDAOProposalRegistry.voteOnProposal(
            initialProposalId, chosenProposalDepth
        );

        (
            uint256 userChosenProposalDepth,
            uint256 userVotingPower,
            uint256 userVotedAtTimestamp
        ) = fairnessDAOProposalRegistry.proposalIdToVoterAddressToUserVote(
            initialProposalId, voterAddress
        );
        assertEq(userChosenProposalDepth, chosenProposalDepth);
        assertEq(
            userVotingPower,
            fairnessDAOFairVesting.balanceOf(address(voterAddress))
        );
        assertEq(userVotedAtTimestamp, block.timestamp);

        (
            uint256 totalAmountOfVotingTokensUsed,
            uint256 totalAmountOfUniqueVoters
        ) = fairnessDAOProposalRegistry.proposalIdToVotingStatus(
            initialProposalId
        );
        assertEq(
            totalAmountOfVotingTokensUsed,
            fairnessDAOFairVesting.balanceOf(address(voterAddress))
        );
        assertEq(totalAmountOfUniqueVoters, 1);
    }

    /// @dev Should not allow the caller to vote on proposal if the caller has already voted on the same proposal.
    function testFuzz_voteOnProposal_func_withRevert_cannotVoteTwiceOnSameProposal(
        uint8 chosenProposalDepth
    ) public {
        if (chosenProposalDepth >= proposalTotalDepth) {
            chosenProposalDepth = chosenProposalDepth % proposalTotalDepth;
        }

        testFuzz_voteOnProposal_func(chosenProposalDepth);

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__CannotVoteTwiceOnTheSameProposal
                .selector
        );

        fairnessDAOProposalRegistry.voteOnProposal(
            initialProposalId, chosenProposalDepth
        );
    }
}
