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

contract FairnessDAOProposalRegistrySubmitProposalStateTest is
    Test,
    InitFairnessDAOProposalRegistry
{
    uint256 public initialAmountToVest = 1 ether;
    uint256 public defaultStartTime = 2;

    function setUp() public virtual override {
        super.setUp();

        mockERC20.faucet(initialAmountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), initialAmountToVest);
        fairnessDAOFairVesting.initiateVesting(initialAmountToVest);
        /// @dev We skip 1 second, which should reward the user of 1 ether equivalent of vesting tokens.
        skip(1);
        fairnessDAOFairVesting.updateFairVesting(address(this));
        fairnessDAOFairVesting.whitelistProposalRegistryAddress(
            address(fairnessDAOProposalRegistry)
        );
    }

    /// @dev Should not allow the caller to submit a proposal with an empty proposal URI.
    function test_submitProposal_func_withRevert_cannotSetEmptyProposalURI()
        public
    {
        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__CannotSetEmptyProposalURI
                .selector
        );
        fairnessDAOProposalRegistry.submitProposal(
            defaultStartTime, "", 69, FairnessDAOProposalRegistry.ProposalLevel.SP
        );
    }

    /// @dev Should not allow the caller to submit a proposal with a choice depth below two.
    /// @notice We should have at least two voting choices for any proposal.
    function testFuzz_submitProposal_func_withRevert_cannotSetProposalDepthToBelowTwo(
        uint8 randomProposalDepth
    )
        public
    {
        randomProposalDepth = randomProposalDepth % 2;

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__CannotSetProposalDepthToBelowTwo
                .selector
        );
        fairnessDAOProposalRegistry.submitProposal(
            defaultStartTime,
            "proposalURI",
            randomProposalDepth,
            FairnessDAOProposalRegistry.ProposalLevel.SP
        );
    }

    /// @dev Should not allow the caller to submit a proposal if he does not give enough allowance for burning vesting tokens.
    function testFuzz_submitProposal_func_withRevert_insufficientAllowanceForBurningVestingToken(
        uint256 startTime,
        string memory proposalURI,
        uint256 proposalTotalDepth
    )
        public
    {
        vm.assume(startTime > defaultStartTime);
        vm.assume(keccak256(bytes(proposalURI)) != keccak256(bytes("")));
        vm.assume(proposalTotalDepth > 1);

        vm.expectRevert(bytes("ERC20: insufficient allowance"));

        fairnessDAOProposalRegistry.submitProposal(
            startTime,
            proposalURI,
            proposalTotalDepth,
            FairnessDAOProposalRegistry.ProposalLevel.SP
        );
    }

    /// @dev Should allow the caller to submit a proposal if he has enough vesting tokens to burn and a proper proposal.
    function testFuzz_submitProposal_func(
        uint128 startTime,
        string memory proposalURI,
        uint256 proposalTotalDepth,
        uint8 proposalLevelSeed
    )
        public
    {
        vm.assume(startTime > defaultStartTime);
        vm.assume(keccak256(bytes(proposalURI)) != keccak256(bytes("")));
        vm.assume(proposalTotalDepth > 1);

        fairnessDAOFairVesting.approve(
            address(fairnessDAOProposalRegistry), type(uint256).max
        );

        assertEq(fairnessDAOProposalRegistry.proposalCount(), 0);

        fairnessDAOProposalRegistry.submitProposal(
            startTime,
            proposalURI,
            proposalTotalDepth,
            proposalLevelSeed % 2 == 0
                ? FairnessDAOProposalRegistry.ProposalLevel.SP
                : FairnessDAOProposalRegistry.ProposalLevel.HP
        );

        assertEq(fairnessDAOProposalRegistry.proposalCount(), 1);
        assertEq(
            fairnessDAOProposalRegistry.totalAmountOfVestingTokensBurned(),
            initialAmountToVest / 1000
        );

        (
            address storedProposerAddress,
            uint256 storedStartTime,
            uint256 storedEndTime,
            uint256 storedProposalTotalDepth,
            string memory storedProposalURI,
            FairnessDAOProposalRegistry.VotingStatus storedVotingStatus,
            FairnessDAOProposalRegistry.ProposalLevel storedProposalLevel,
            uint256 storedAmountOfVestingTokensBurnt
        ) = fairnessDAOProposalRegistry.proposalIdToProposalDetails(0);

        assertEq(storedProposerAddress, address(this));
        assertEq(storedStartTime, startTime);
        assertEq(
            storedEndTime,
            proposalLevelSeed % 2 == 0
                ? uint256(startTime) + 14 days
                : uint256(startTime) + 28 days
        );
        assertEq(storedProposalTotalDepth, proposalTotalDepth);
        assertEq(
            keccak256(bytes(storedProposalURI)), keccak256(bytes(proposalURI))
        );
        assertEq(
            uint8(storedVotingStatus),
            uint8(FairnessDAOProposalRegistry.VotingStatus.NotStarted)
        );
        assertEq(
            uint8(storedProposalLevel),
            proposalLevelSeed % 2 == 0
                ? uint8(FairnessDAOProposalRegistry.ProposalLevel.SP)
                : uint8(FairnessDAOProposalRegistry.ProposalLevel.HP)
        );
        assertEq(storedAmountOfVestingTokensBurnt, initialAmountToVest / 1000);
    }
}
