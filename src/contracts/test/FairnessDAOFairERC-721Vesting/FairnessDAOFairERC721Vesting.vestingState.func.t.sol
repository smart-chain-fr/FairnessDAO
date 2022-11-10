// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC721} from
    "../initState/InitFairnessDAOFairVestingWithERC721.sol";
import {FairnessDAOFairERC721Vesting} from
    "../../contracts/FairnessDAOFairERC721Vesting.sol";

contract FairnessDAOFairERC721VestingVestingStateTest is
    Test,
    InitFairnessDAOFairVestingWithERC721
{
    address public vesterAddress = makeAddr("vesterAddress");

    /// @dev Should allow user to vest funds and claim periodically.
    function test_shouldAllowUserToVestFundsAndClaimPeriodically() public {
        /// @dev We impersonate vesterAddress during the entire process to avoid dependencies with this contract.
        startHoax(vesterAddress);

        uint256 initialAmountToVest = 10;

        uint256[] memory tokenIds = mockERC721.faucet(initialAmountToVest);

        mockERC721.setApprovalForAll(
            address(fairnessDAOFairERC721Vesting), true
        );

        fairnessDAOFairERC721Vesting.initiateVesting(tokenIds);

        /// @dev Vesting computation formula V = X x Y x Z
        ///      X:    10
        ///      Y:    ...
        ///      Z:    1

        /// @dev if Y = 10s;
        /// V = 10 * 10 * 1 = 100
        skip(10);
        assertEq(
            fairnessDAOFairERC721Vesting.getClaimableFairVesting(vesterAddress),
            100
        );

        assertEq(fairnessDAOFairERC721Vesting.balanceOf(vesterAddress), 0);
        fairnessDAOFairERC721Vesting.updateFairVesting(vesterAddress);
        assertEq(fairnessDAOFairERC721Vesting.balanceOf(vesterAddress), 100);

        /// @dev Vesting computation status:
        ///      X:    10
        ///      Y:    50
        ///      Z:    1

        /// @dev if Y = 50s;
        /// V = 10 * 50 * 1 = 500
        /// @dev We skip 50s, so 10 (from before) + 50 = 60s in total.
        skip(50);
        assertEq(
            fairnessDAOFairERC721Vesting.getClaimableFairVesting(vesterAddress),
            500
        );

        assertEq(fairnessDAOFairERC721Vesting.balanceOf(vesterAddress), 100);
        fairnessDAOFairERC721Vesting.updateFairVesting(vesterAddress);
        assertEq(fairnessDAOFairERC721Vesting.balanceOf(vesterAddress), 600);

        uint256[] memory tokenIdsIndexToWithdraw = new uint256[](5);
        tokenIdsIndexToWithdraw[0] = 0;
        tokenIdsIndexToWithdraw[1] = 1;
        tokenIdsIndexToWithdraw[2] = 2;
        tokenIdsIndexToWithdraw[3] = 3;
        tokenIdsIndexToWithdraw[4] = 4;
        /// @dev user withdraw half of his vested tokens
        /// Should burn 300 out of 600, to get back 5 ERC-721 tokens out of 10
        fairnessDAOFairERC721Vesting.withdrawVesting(tokenIdsIndexToWithdraw);
        assertEq(mockERC721.balanceOf(vesterAddress), initialAmountToVest / 2);

        /// @dev if Y = 100s;
        /// V = 5 * 100 * 1 = 500
        /// @dev We skip 100s, so 60 (from before) + 100 = 160s in total.
        skip(100);
        assertEq(
            fairnessDAOFairERC721Vesting.getClaimableFairVesting(vesterAddress),
            500
        );

        fairnessDAOFairERC721Vesting.addressToVestingInfo(vesterAddress);

        fairnessDAOFairERC721Vesting.updateFairVesting(vesterAddress);

        fairnessDAOFairERC721Vesting.addressToVestingInfo(vesterAddress);

        /// @dev We claim 1 ERC-721 token out of 5, so 20% of 800 vtokens will burn.
        tokenIdsIndexToWithdraw = new uint256[](1); // index [0] of addressToTokenIdsVested[0] = 5
        tokenIdsIndexToWithdraw[0] = 5;

        fairnessDAOFairERC721Vesting.withdrawVesting(tokenIdsIndexToWithdraw);

        assertEq(
            mockERC721.balanceOf(vesterAddress), initialAmountToVest / 2 + 1
        );

        assertEq(
            fairnessDAOFairERC721Vesting.getClaimableFairVesting(vesterAddress),
            0
        );

        /// @dev if Y = 6969s;
        /// V = 4 * 6969s * 1 = 27_876
        /// @dev We skip 6969s, so 160 (from before) + 6969 = 7129s in total.
        skip(6969);
        fairnessDAOFairERC721Vesting.addressToVestingInfo(vesterAddress);
        assertEq(
            fairnessDAOFairERC721Vesting.getClaimableFairVesting(vesterAddress),
            27_876
        );
    }

    /// @dev Yearly vesting PoC.
    function test_yearlyVestingPoC() public {
        startHoax(vesterAddress);

        uint256 zInflationDeltaBpPoC = 3200; // 0.00016%
        /// @dev (10 * 3,154e+7* (1e+18 * 3200/1_000_000_000))/1e+18 = 1009.28
        uint256 zInflationDeltaPoC =
            (1e18 * zInflationDeltaBpPoC) / 1_000_000_000;

        FairnessDAOFairERC721Vesting fairnessDAOFairERC721VestingPoC =
            new FairnessDAOFairERC721Vesting();
        fairnessDAOFairERC721VestingPoC.initialize(
            tokenName,
            tokenSymbol,
            address(mockERC721),
            zInflationDeltaPoC,
            address(0)
        );

        uint256 initialAmountToVest = 10;

        uint256[] memory tokenIds = mockERC721.faucet(initialAmountToVest);

        mockERC721.setApprovalForAll(
            address(fairnessDAOFairERC721VestingPoC), true
        );

        fairnessDAOFairERC721VestingPoC.initiateVesting(tokenIds);

        uint256 onYearTimestamp = 365 days;
        skip(onYearTimestamp);

        assertEq(
            fairnessDAOFairERC721VestingPoC.getClaimableFairVesting(
                vesterAddress
            ),
            1009
        );
        emit log_uint(fairnessDAOFairERC721VestingPoC.balanceOf(vesterAddress));
    }
}
