// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {EventsUtils} from "../EventsUtils.sol";
import {InitFairnessDAOProposalRegistry} from
    "../initState/InitFairnessDAOProposalRegistry.sol";
import {FairnessDAOProposalRegistry} from
    "../../contracts/FairnessDAOProposalRegistry.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";
import {MockERC20} from "../../contracts/Mocks/MockERC20.sol";

contract FairnessDAOProposalRegistryClaimRewardsForPassedProposalStateTest is
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

        /// @dev We also set another DAO member, to avoid relying too much on the test contract.
        startHoax(voterAddress);
        mockERC20.faucet(initialAmountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), initialAmountToVest);
        fairnessDAOFairVesting.initiateVesting(initialAmountToVest);
        /// @dev We skip 1 second, which should reward the user of 1 ether equivalent of vesting tokens.
        skip(1);
        vm.stopPrank();

        skip(defaultStartTime);

        /// @dev We setup a lot of DAO voters, but they only vote with a single 1e-17 vesting token.
        /// It allows the contract to confirm the account threshold, but still locks the quantity threshold.
        for (uint256 i = 1; i < 11;) {
            uint256 tmpAmountToVest = 1;
            startHoax(address(uint160(i)));
            mockERC20.faucet(tmpAmountToVest);
            mockERC20.approve(address(fairnessDAOFairVesting), tmpAmountToVest);
            fairnessDAOFairVesting.initiateVesting(tmpAmountToVest);
            skip(1);
            fairnessDAOProposalRegistry.voteOnProposal(initialProposalId, 0);
            vm.stopPrank();
            unchecked {
                ++i;
            }
        }

        startHoax(voterAddress);
        /// @dev With the vote from this voter (which has the majority of the voting supply), the contract can now confirm the quantity threshold and the proposal should pass.
        fairnessDAOProposalRegistry.voteOnProposal(initialProposalId, 0);

        skip(14 days);
        /// @dev 14 days is the voting duration of an SP proposal level.
        fairnessDAOProposalRegistry.finalizeProposal(initialProposalId);
    }

    /// @dev Should not allow the caller to claim rewards for a proposal if the latter does not exist.
    function testFuzz_claimRewards_func_withRevert_proposalDoesNotExist(
        uint256 proposalId
    )
        public
    {
        vm.assume(proposalId != 0);

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__ProposalDoesNotExist
                .selector
        );
        fairnessDAOProposalRegistry.claimRewards(proposalId);
    }

    /// @dev Should allow the caller to claim voting rewards for a proposal that met quorum after its voting phase.
    function test_claimRewards_func_claimRewardsForProposalThatDidPassAsRegularVoter(
    )
        public
    {
        /// @dev We claim rewards from vesting to avoid event reading issues.
        fairnessDAOFairVesting.updateFairVesting(voterAddress);

        (
            uint256 totalAmountOfVotingTokensUsed, uint256 totalAmountOfUniqueVoters
        ) =
            fairnessDAOProposalRegistry.proposalIdToVotingStatus(initialProposalId);
        uint256 amountThatShouldBeReceivedByAllVoters =
            totalAmountOfVotingTokensUsed / totalAmountOfUniqueVoters;

        vm.expectEmit(true, true, false, true);
        emit EventsUtils.RewardsClaimed(
            initialProposalId, voterAddress, amountThatShouldBeReceivedByAllVoters
            );
        fairnessDAOProposalRegistry.claimRewards(initialProposalId);
    }

    /// @dev Should allow the caller to claim boosted voting rewards for a proposal that met quorum after its voting phase.
    function test_claimRewards_func_claimRewardsForProposalThatDidPassAsProposalSubmitter(
    )
        public
    {
        /// @dev We set this testing contract as the main caller, and originator of the proposal.
        vm.stopPrank();

        (,,,,,,, uint256 amountOfVestingTokensBurntForProposalSubmission) =
        fairnessDAOProposalRegistry.proposalIdToProposalDetails(
            initialProposalId
        );

        /// @dev We claim rewards from vesting to avoid event reading issues.
        fairnessDAOFairVesting.updateFairVesting(address(this));

        (
            uint256 totalAmountOfVotingTokensUsed, uint256 totalAmountOfUniqueVoters
        ) =
            fairnessDAOProposalRegistry.proposalIdToVotingStatus(initialProposalId);
        uint256 amountThatShouldBeReceivedByAllVoters =
            totalAmountOfVotingTokensUsed / totalAmountOfUniqueVoters;
        uint256 boostedReward = amountOfVestingTokensBurntForProposalSubmission
            * fairnessDAOProposalRegistry.boostedRewardBonusValue() / 1e18;
        uint256 amountThatShouldBeReceivedByProposalSubmitter =
            boostedReward + amountThatShouldBeReceivedByAllVoters;

        vm.expectEmit(true, true, false, true);
        emit EventsUtils.RewardsClaimed(
            initialProposalId,
            address(this),
            amountThatShouldBeReceivedByProposalSubmitter
            );
        fairnessDAOProposalRegistry.claimRewards(initialProposalId);
    }

    /// @dev Should allow the caller to claim boosted voting rewards for a proposal that met quorum after its voting phase.
    function testFuzz_claimRewards_func_withRevert_cannotClaimVotingRewardsAsNonVoter(
        uint160 callerSeed
    )
        public
    {
        vm.assume(callerSeed > 11);
        vm.stopPrank();

        hoax(address(callerSeed));
        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__CannotClaimRewardsForProposalWhereCallerHasNotVoted
                .selector
        );
        fairnessDAOProposalRegistry.claimRewards(initialProposalId);
    }

    /// @dev Should not allow the caller to claim voting rewards twice for the same proposal that met quorum after its voting phase.
    function test_claimRewards_func_withRevert_cannotClaimRewardsTwiceOnSameProposal(
    )
        public
    {
        test_claimRewards_func_claimRewardsForProposalThatDidPassAsRegularVoter();

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__CannotClaimRewardsTwice
                .selector
        );
        fairnessDAOProposalRegistry.claimRewards(initialProposalId);
    }
}
