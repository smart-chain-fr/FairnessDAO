// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC20} from
    "../initState/InitFairnessDAOFairVestingWithERC20.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";

contract FairnessDAOFairVestingWithdrawVestingStateTest is
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

    /// @dev Should not allow the caller to withdraw vesting with zero amount.
    function test_withdrawVesting_func_withRevert_cannotSetZeroAmount()
        public
    {
        vm.expectRevert(
            FairnessDAOFairVesting.FairnessDAOFairVesting__CannotSetZeroAmount.selector
        );
        fairnessDAOFairVesting.withdrawVesting(0);
    }

    /// @dev Should not allow the caller to withdraw vesting if the latter does not already has an active vesting.
    function testFuzz_withdrawVesting_func_withRevert_callerIsNotVesting(
        address randomCaller,
        uint256 amountToWithdraw
    )
        public
    {
        vm.assume(randomCaller != address(this));
        vm.assume(amountToWithdraw != 0);
        vm.expectRevert(
            FairnessDAOFairVesting.FairnessDAOFairVesting__UserIsNotVesting.selector
        );
        hoax(randomCaller);
        fairnessDAOFairVesting.withdrawVesting(amountToWithdraw);
    }

    /// @dev Should not allow the caller to withdraw more than he owns.
    function testFuzz_withdrawVesting_func_withRevert_cannotWithdrawMoreThanTheCallerOwns(
        uint256 amountToWithdraw
    )
        public
    {
        vm.assume(amountToWithdraw > initialAmountToVest);
        vm.expectRevert(
            FairnessDAOFairVesting
                .FairnessDAOFairVesting__CannotWithdrawMoreThanYouOwn
                .selector
        );
        fairnessDAOFairVesting.withdrawVesting(amountToWithdraw);
    }

    /// @dev Should allow the caller to withdraw partial vesting with random amount.
    function testFuzz_withdrawVesting_func_partialWithdrawal(
        uint32 timeSkipping,
        uint8 shareToWithdraw
    )
        public
    {
        vm.assume(timeSkipping != 0);
        vm.assume(shareToWithdraw != 0);
        vm.assume(shareToWithdraw != 1);

        /// @dev We compute an amount to withdraw based on sharing to avoid amounts too low.
        uint256 amountToWithdraw = initialAmountToVest / shareToWithdraw;

        skip(timeSkipping);
        fairnessDAOFairVesting.updateFairVesting(address(this));

        uint256 withdrawnAmount = (
            (
                (amountToWithdraw * 1e18) / fairnessDAOFairVesting.balanceOf(address(this))
            ) * initialAmountToVest
        ) / 1e18;

        fairnessDAOFairVesting.withdrawVesting(amountToWithdraw);

        (uint256 amountVested,,) =
            fairnessDAOFairVesting.addressToVestingInfo(address(this));
        assertEq(amountVested, initialAmountToVest - withdrawnAmount);
    }

    /// @dev Should allow the caller to withdraw full vesting with random timeSkipping.
    /// Despite the time skipping, if the user completely withdraws its vesting, the vesting storage is still cleared and no token update is made.
    function testFuzz_withdrawVesting_func_fullWithdrawal(uint32 timeSkipping)
        public
    {
        vm.assume(timeSkipping != 0);

        skip(timeSkipping);
        fairnessDAOFairVesting.updateFairVesting(address(this));

        uint256 userVestedBalance =
            fairnessDAOFairVesting.balanceOf(address(this));

        fairnessDAOFairVesting.withdrawVesting(userVestedBalance);

        (
            uint256 amountVested,
            uint256 startTimestamp,
            uint256 lastClaimedTimestamp
        ) = fairnessDAOFairVesting.addressToVestingInfo(address(this));
        assertEq(amountVested, 0);
        assertEq(startTimestamp, 0);
        assertEq(lastClaimedTimestamp, 0);
    }

    /// @dev Should not allow the caller to withdraw partial vesting with amount too low.
    function testFuzz_withdrawVesting_func_withRevert_withdrawalAmountTooLow(
        uint32 timeSkipping,
        uint8 amountToWithdraw
    )
        public
    {
        vm.assume(timeSkipping != 0);
        if (timeSkipping < type(uint16).max) {
            timeSkipping = type(uint16).max;
        }
        vm.assume(amountToWithdraw != 0);
        vm.assume(amountToWithdraw < 100);

        skip(timeSkipping);
        fairnessDAOFairVesting.updateFairVesting(address(this));

        vm.expectRevert(
            FairnessDAOFairVesting.FairnessDAOFairVesting__WithdrawalAmountIsTooLow.selector
        );
        fairnessDAOFairVesting.withdrawVesting(amountToWithdraw);
    }
}
