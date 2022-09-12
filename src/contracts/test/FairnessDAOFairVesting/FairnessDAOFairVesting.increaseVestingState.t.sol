// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC20} from
    "../initState/InitFairnessDAOFairVestingWithERC20.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";

contract FairnessDAOFairVestingIncreaseVestingStateTest is
    Test,
    InitFairnessDAOFairVestingWithERC20
{
    uint256 public initialAmountToVest = 1 ether;

    function setUp() public virtual override {
        super.setUp();
        mockERC20.faucet(initialAmountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), initialAmountToVest);
        fairnessDAOFairVesting.initiateVesting(initialAmountToVest);
    }

    /// @dev Should not allow the caller to increase vesting with zero amount.
    function test_increaseVesting_func_withRevert_cannotSetZeroAmount()
        public
    {
        vm.expectRevert(
            FairnessDAOFairVesting.FairnessDAOFairVesting__CannotSetZeroAmount.selector
        );
        fairnessDAOFairVesting.increaseVesting(0);
    }

    /// @dev Should not allow the caller to increase vesting if the latter does not already has an active vesting.
    function testFuzz_increaseVesting_func_withRevert_callerIsNotVesting(
        address randomCaller,
        uint256 amountToVest
    )
        public
    {
        vm.assume(randomCaller != address(this));
        vm.assume(amountToVest != 0);
        vm.expectRevert(
            FairnessDAOFairVesting
                .FairnessDAOFairVesting__CannotIncreaseVestingForNonVestedUser
                .selector
        );
        hoax(randomCaller);
        fairnessDAOFairVesting.increaseVesting(amountToVest);
    }

    /// @dev Should not allow the caller to increase vesting with random amount if he does not own the amount.
    function testFuzz_increaseVesting_func_withRevert_insufficientBalance(
        uint256 amountToVest
    )
        public
    {
        vm.assume(amountToVest != 0);
        vm.expectRevert(bytes("ERC20: insufficient allowance"));
        fairnessDAOFairVesting.increaseVesting(amountToVest);
    }

    /// @dev Should not allow the caller to increase vesting with random amount if he does not approve the amount.
    function testFuzz_increaseVesting_func_withRevert_ERC20BalanceNotApproved(
        uint128 amountToVest
    )
        public
    {
        vm.assume(amountToVest != 0);
        mockERC20.faucet(amountToVest);
        vm.expectRevert(bytes("ERC20: insufficient allowance"));
        fairnessDAOFairVesting.increaseVesting(amountToVest);
    }

    /// @dev Should allow the caller to initiate vesting with random amount.
    function testFuzz_increaseVesting_func(uint128 amountToVest) public {
        vm.assume(amountToVest != 0);
        mockERC20.faucet(amountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), amountToVest);
        fairnessDAOFairVesting.increaseVesting(amountToVest);

        (uint256 amountVested, uint256 startTimestamp, uint256 debt) =
            fairnessDAOFairVesting.addressToVestingInfo(address(this));
        assertEq(amountVested, amountToVest + initialAmountToVest);
        assertEq(startTimestamp, block.timestamp);
        assertEq(debt, 0);
    }

    /// @dev Should allow the caller to initiate vesting with fixed amount.
    function test_increaseVesting_func() public {
        uint256 amountToVest = 1 ether;
        mockERC20.faucet(amountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), amountToVest);
        fairnessDAOFairVesting.increaseVesting(amountToVest);

        (uint256 amountVested, uint256 startTimestamp, uint256 debt) =
            fairnessDAOFairVesting.addressToVestingInfo(address(this));
        assertEq(amountVested, amountToVest + initialAmountToVest);
        assertEq(startTimestamp, block.timestamp);
        assertEq(debt, 0);
    }
}
