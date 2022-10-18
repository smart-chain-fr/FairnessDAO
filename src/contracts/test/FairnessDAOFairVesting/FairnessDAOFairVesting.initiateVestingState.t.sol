// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC20} from
    "../initState/InitFairnessDAOFairVestingWithERC20.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";

contract FairnessDAOFairVestingInitiateVestingStateTest is
    Test,
    InitFairnessDAOFairVestingWithERC20
{
    /// @dev Should not allow the caller to initiate vesting with zero amount.
    function test_initiateVesting_func_withRevert_cannotSetZeroAmount()
        public
    {
        vm.expectRevert(
            FairnessDAOFairVesting
                .FairnessDAOFairVesting__CannotSetZeroAmount
                .selector
        );
        fairnessDAOFairVesting.initiateVesting(0);
    }

    /// @dev Should not allow the caller to initiate vesting with random amount if he does not own the amount.
    function testFuzz_initiateVesting_func_withRevert_insufficientBalance(
        uint256 amountToVest
    ) public {
        vm.assume(amountToVest != 0);
        vm.expectRevert(bytes("ERC20: insufficient allowance"));
        fairnessDAOFairVesting.initiateVesting(amountToVest);
    }

    /// @dev Should not allow the caller to initiate vesting with random amount if he does not approve the amount.
    function testFuzz_initiateVesting_func_withRevert_ERC20BalanceNotApproved(
        uint256 amountToVest
    ) public {
        vm.assume(amountToVest != 0);
        mockERC20.faucet(amountToVest);
        vm.expectRevert(bytes("ERC20: insufficient allowance"));
        fairnessDAOFairVesting.initiateVesting(amountToVest);
    }

    /// @dev Should allow the caller to initiate vesting with random amount.
    function testFuzz_initiateVesting_func(uint128 amountToVest) public {
        vm.assume(amountToVest != 0);
        mockERC20.faucet(amountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), amountToVest);
        fairnessDAOFairVesting.initiateVesting(amountToVest);

        (
            uint256 amountVested,
            uint256 startTimestamp,
            uint256 lastClaimedTimestamp
        ) = fairnessDAOFairVesting.addressToVestingInfo(address(this));
        assertEq(amountVested, amountToVest);
        assertEq(startTimestamp, block.timestamp);
        assertEq(lastClaimedTimestamp, block.timestamp);
    }

    /// @dev Should allow the caller to initiate vesting with fixed amount.
    function test_initiateVesting_func() public {
        uint256 amountToVest = 1 ether;
        mockERC20.faucet(amountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), amountToVest);
        fairnessDAOFairVesting.initiateVesting(amountToVest);

        (
            uint256 amountVested,
            uint256 startTimestamp,
            uint256 lastClaimedTimestamp
        ) = fairnessDAOFairVesting.addressToVestingInfo(address(this));
        assertEq(amountVested, amountToVest);
        assertEq(startTimestamp, block.timestamp);
        assertEq(lastClaimedTimestamp, block.timestamp);
    }

    /// @dev Should not allow the caller to initiate another vesting if the first one is active.
    function testFuzz_initiateVesting_func_withRevert_cannotInitiateVestingTwice(
        uint128 amountToVest
    ) public {
        vm.assume(amountToVest != 0);
        testFuzz_initiateVesting_func(amountToVest);
        mockERC20.faucet(amountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), amountToVest);
        vm.expectRevert(
            FairnessDAOFairVesting
                .FairnessDAOFairVesting__UserAlreadyHasActiveVesting
                .selector
        );
        fairnessDAOFairVesting.initiateVesting(amountToVest);
    }
}
