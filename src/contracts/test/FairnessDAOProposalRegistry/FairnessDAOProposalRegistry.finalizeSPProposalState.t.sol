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

contract FairnessDAOProposalRegistryFinalizeSPProposalStateTest is
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
        // fairnessDAOFairVesting.updateFairVesting(address(this));
        /// @dev The `voterAddress` account is the one executing the following tests.
        /// vm.stopPrank();
    }

    /// @dev Should not allow the caller to finalize a proposal if the latter does not exist.
    function testFuzz_finalizeProposal_func_withRevert_proposalDoesNotExist(
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
        fairnessDAOProposalRegistry.finalizeProposal(proposalId);
    }

    /// @dev Should not allow the caller to finalize a proposal if the latter has not finished its voting period.
    function test_finalizeProposal_func_withRevert_votingPeriodNotEndedYet()
        public
    {
        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__VotingPeriodHasNotEndedYet
                .selector
        );
        fairnessDAOProposalRegistry.finalizeProposal(initialProposalId);
    }

    /// @dev Should allow the caller to finalize a proposal but the latter does not meet the Quorum Account QA.
    function test_finalizeProposal_func_SoftProposalDoesNotMeetQuorumAccount()
        public
    {
        skip(defaultStartTime);

        /// @dev We make only one user to vote, but the latter has almost the entire supply of vesting tokens.
        /// It allows the contract to confirm the quantity threshold, but still locks the account threshold.
        fairnessDAOProposalRegistry.voteOnProposal(initialProposalId, 0);

        skip(14 days);
        /// @dev 14 days is the voting duration of an SP proposal level.
        fairnessDAOProposalRegistry.finalizeProposal(initialProposalId);

        (,,,,, FairnessDAOProposalRegistry.VotingStatus votingStatus,,) =
        fairnessDAOProposalRegistry.proposalIdToProposalDetails(
            initialProposalId
        );
        assertEq(
            uint8(votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.NotPassed)
        );
    }

    /// @dev Should allow the caller to finalize a proposal but the latter does not meet the Quorum Token QT.
    function test_finalizeProposal_func_SoftProposalDoesNotMeetQuorumToken()
        public
    {
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

        skip(14 days);

        /// @dev 14 days is the voting duration of an SP proposal level.
        fairnessDAOProposalRegistry.finalizeProposal(initialProposalId);

        (,,,,, FairnessDAOProposalRegistry.VotingStatus votingStatus,,) =
        fairnessDAOProposalRegistry.proposalIdToProposalDetails(
            initialProposalId
        );
        assertEq(
            uint8(votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.NotPassed)
        );
    }

    /// @dev Should allow the caller to finalize a proposal that meets quorum and passes.
    function test_finalizeProposal_func_SoftProposalMeetsCompleteQuorumAndPasses(
    )
        public
    {
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

        hoax(voterAddress);
        /// @dev With the vote from this voter (which has the majority of the voting supply), the contract can now confirm the quantity threshold and the proposal should pass.
        fairnessDAOProposalRegistry.voteOnProposal(initialProposalId, 0);

        skip(14 days);
        /// @dev 14 days is the voting duration of an SP proposal level.
        fairnessDAOProposalRegistry.finalizeProposal(initialProposalId);

        (,,,,, FairnessDAOProposalRegistry.VotingStatus votingStatus,,) =
        fairnessDAOProposalRegistry.proposalIdToProposalDetails(
            initialProposalId
        );
        assertEq(
            uint8(votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.Passed)
        );
    }

    /// @dev Should allow the caller to finalize a proposal that meets quorum but ends up with a tie.
    function test_finalizeProposal_func_SoftProposalMeetsCompleteQuorumButTies()
        public
    {
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

        hoax(voterAddress);
        /// @dev With the vote from this voter (which has the majority of the voting supply), the contract can now confirm the quantity threshold and the proposal should pass.
        fairnessDAOProposalRegistry.voteOnProposal(initialProposalId, 1);

        /// @dev We create another voter account with the same voting power, to create a tie in this situation.
        uint256 anotherTmpAmountToVest = 21 ether;
        startHoax(makeAddr("tieVoter"));
        mockERC20.faucet(anotherTmpAmountToVest);
        mockERC20.approve(
            address(fairnessDAOFairVesting), anotherTmpAmountToVest
        );
        fairnessDAOFairVesting.initiateVesting(anotherTmpAmountToVest);
        skip(1);
        fairnessDAOProposalRegistry.voteOnProposal(initialProposalId, 2);
        vm.stopPrank();

        skip(14 days);
        /// @dev 14 days is the voting duration of an SP proposal level.
        fairnessDAOProposalRegistry.finalizeProposal(initialProposalId);

        (,,,,, FairnessDAOProposalRegistry.VotingStatus votingStatus,,) =
        fairnessDAOProposalRegistry.proposalIdToProposalDetails(
            initialProposalId
        );
        assertEq(
            uint8(votingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.Tie)
        );
    }
}
