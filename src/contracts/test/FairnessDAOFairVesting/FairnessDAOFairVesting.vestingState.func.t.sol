// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC20} from
    "../initState/InitFairnessDAOFairVestingWithERC20.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";

contract FairnessDAOFairVestingVestingStateTest is
    Test,
    InitFairnessDAOFairVestingWithERC20
{
    address public vesterAddress = makeAddr("vesterAddress");

    /// @dev Should allow user to vest funds and claim periodically.
    function test_shouldAllowUserToVestFundsAndClaimPeriodically() public {
        /// @dev We impersonate vesterAddress during the entire process to avoid dependencies with this contract.
        startHoax(vesterAddress);

        uint256 initialAmountToVest = 1 ether;

        mockERC20.faucet(initialAmountToVest);

        mockERC20.approve(address(fairnessDAOFairVesting), initialAmountToVest);

        fairnessDAOFairVesting.initiateVesting(initialAmountToVest);

        /// @dev Vesting computation formula V = X x Y x Z - debt
        ///      X:    1 ether
        ///      Y:    ...
        ///      Z:    1
        ///      debt: 0

        /// @dev if Y = 10s;
        /// V = 1 ether * 10 * 1 - 0 = 10 ether
        skip(10);
        assertEq(
            fairnessDAOFairVesting.getClaimableFairVesting(vesterAddress),
            10 ether
        );

        assertEq(fairnessDAOFairVesting.balanceOf(vesterAddress), 0);
        fairnessDAOFairVesting.updateFairVesting(vesterAddress);
        assertEq(fairnessDAOFairVesting.balanceOf(vesterAddress), 10 ether);

        /// @dev Vesting computation status:
        ///      X:    1 ether
        ///      Y:    10...
        ///      Z:    1
        ///      debt: 10 ether

        /// @dev if Y = 60s;
        /// V = 1 ether * 60 * 1 - 10 ether = 50 ether
        /// @dev We skip 50s, so 10 (from before) + 50 = 60s in total.
        skip(50);
        assertEq(
            fairnessDAOFairVesting.getClaimableFairVesting(vesterAddress),
            50 ether
        );

        assertEq(fairnessDAOFairVesting.balanceOf(vesterAddress), 10 ether);
        fairnessDAOFairVesting.updateFairVesting(vesterAddress);
        assertEq(fairnessDAOFairVesting.balanceOf(vesterAddress), 60 ether);

        /// @dev If user wants to retrieve half of his vested tokens, he needs to burn half of his vesting tokens.
        /// Should burn 30 ether out of 60 ether, to get back 0.5 ether out of 1 ether
        fairnessDAOFairVesting.withdrawVesting(
            fairnessDAOFairVesting.balanceOf(vesterAddress) / 2
        );
        assertEq(mockERC20.balanceOf(vesterAddress), initialAmountToVest / 2);

        /// @dev if Y = 160s;
        /// V = 0.5 ether * 160 * 1 - (60 ether - 30 ether) = 50 ether
        /// @dev We skip 100s, so 60 (from before) + 100 = 160s in total.
        skip(100);
        assertEq(
            fairnessDAOFairVesting.getClaimableFairVesting(vesterAddress),
            50 ether
        );

        fairnessDAOFairVesting.addressToVestingInfo(vesterAddress);

        assertEq(fairnessDAOFairVesting.balanceOf(vesterAddress), 30 ether);
        fairnessDAOFairVesting.updateFairVesting(vesterAddress);
        assertEq(fairnessDAOFairVesting.balanceOf(vesterAddress), 80 ether);

        fairnessDAOFairVesting.addressToVestingInfo(vesterAddress);

        /// @dev We claim 1 ether out of 80 ether, so 1.25% of 0.5 ether.
        fairnessDAOFairVesting.withdrawVesting(1 ether);
        assertEq(fairnessDAOFairVesting.balanceOf(vesterAddress), 79 ether);
        assertEq(mockERC20.balanceOf(vesterAddress), 0.5 ether + 0.00625 ether);

        assertEq(
            fairnessDAOFairVesting.getClaimableFairVesting(vesterAddress), 0
        );

        /// @dev if Y = 7129s;
        /// V = 0.49375 ether * 7129 * 1 - (110 ether - 31 ether)  = 3440.94375 ether
        /// @dev We skip 6969s, so 160 (from before) + 6969 = 7129s in total.
        skip(6969);
        fairnessDAOFairVesting.addressToVestingInfo(vesterAddress);
        assertEq(
            fairnessDAOFairVesting.getClaimableFairVesting(vesterAddress),
            3_440_943_750_000_000_000_000
        );
    }

    /// @dev Yearly vesting PoC.
    function test_yearlyVestingPoC() public {
        startHoax(vesterAddress);

        uint256 zInflationDeltaBpPoC = 32; // 0.0000016%
        /// @dev (1e+18* 3,154e+7* (1e+18 * 32/1_000_000_000))/1e+18 = 1e+18
        uint256 zInflationDeltaPoC =
            (1e18 * zInflationDeltaBpPoC) / 1_000_000_000;

        FairnessDAOFairVesting fairnessDAOFairVestingPoC =
        new FairnessDAOFairVesting(
            tokenName,
            tokenSymbol,
            address(mockERC20),
            zInflationDeltaPoC
        );

        uint256 initialAmountToVest = 1 ether;

        mockERC20.faucet(initialAmountToVest);

        mockERC20.approve(
            address(fairnessDAOFairVestingPoC), initialAmountToVest
        );

        fairnessDAOFairVestingPoC.initiateVesting(initialAmountToVest);

        uint256 onYearTimestamp = 365 days;
        skip(onYearTimestamp);

        /// @dev The APR is not 100% exactly, the result is still aproximate but close enough.
        assertGt(
            fairnessDAOFairVestingPoC.getClaimableFairVesting(vesterAddress),
            0.9 ether
        );
        assertLt(
            fairnessDAOFairVestingPoC.getClaimableFairVesting(vesterAddress),
            1.1 ether
        );
    }
}
