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

contract FairnessDAOProposalRegistrySubmitProposalStateWithMockedTotalSupplyTest
    is Test, InitFairnessDAOProposalRegistry {
    function setUp() public virtual override {
        super.setUp();

        vm.mockCall(
            address(fairnessDAOFairVesting),
            abi.encodeWithSelector(MockERC20.totalSupply.selector),
            abi.encode(type(uint128).max)
        );
    }

    /// @dev Should not allow the caller to submit a proposal with a startTime lower than current time.
    function testFuzz_submitProposal_func_withRevert_cannotSetStartTimeBelowCurrentTime(
        uint128 randomCurrentTime
    ) public {
        vm.assume(randomCurrentTime != 0);
        skip(randomCurrentTime);

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__CannotSetStartTimeBelowCurrentTime
                .selector
        );
        fairnessDAOProposalRegistry.submitProposal(
            randomCurrentTime - 1,
            "proposalURI",
            69,
            FairnessDAOProposalRegistry.ProposalLevel.SP
        );
    }

    /// @dev Should not allow the caller to submit a proposal if the vesting supply is too low to compute a burning fee.
    function test_submitProposal_func_withRevert_notEnoughVestingTokensCirculating(
    ) public {
        vm.mockCall(
            address(fairnessDAOFairVesting),
            abi.encodeWithSelector(MockERC20.totalSupply.selector),
            abi.encode(0)
        );

        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__NotEnoughVestingTokensCirculating
                .selector
        );
        fairnessDAOProposalRegistry.submitProposal(
            1, "proposalURI", 69, FairnessDAOProposalRegistry.ProposalLevel.SP
        );
    }

    /// @dev Should not allow the caller to submit a proposal if the latter does not have enough vesting tokens in his balance.
    function testFuzz_submitProposal_func_withRevert_insufficientBalance()
        public
    {
        vm.expectRevert(
            FairnessDAOProposalRegistry
                .FairnessDAOProposalRegistry__CallerDoesNotHaveEnoughVestingTokens
                .selector
        );
        fairnessDAOProposalRegistry.submitProposal(
            1, "proposalURI", 69, FairnessDAOProposalRegistry.ProposalLevel.SP
        );
    }
}
