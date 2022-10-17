// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC721} from
    "../initState/InitFairnessDAOFairVestingWithERC721.sol";
import {FairnessDAOFairERC721Vesting} from
    "../../contracts/FairnessDAOFairERC721Vesting.sol";
import {EventsUtils} from "../utils/EventsUtils.sol";
import {ERC721Holder} from
    "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {EventsUtilsERC721} from "../utils/EventsUtilsERC721.sol";
import {EventsUtilsERC20} from "../utils/EventsUtilsERC20.sol";

contract FairnessDAOFairERC721VestingWithdrawVestingStateTest is
    Test,
    ERC721Holder,
    InitFairnessDAOFairVestingWithERC721
{
    uint8 public initialAmountToVest = 10;

    function setUp() public virtual override {
        super.setUp();
        uint256[] memory tokenIds = mockERC721.faucet(initialAmountToVest);
        mockERC721.setApprovalForAll(
            address(fairnessDAOFairERC721Vesting), true
        );
        fairnessDAOFairERC721Vesting.initiateVesting(tokenIds);
    }

    /// @dev Should not allow the caller to withdraw vesting with zero amount.
    function test_withdrawVesting_func_withRevert_cannotSetZeroAmount()
        public
    {
        uint256[] memory tokenIds;
        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__CannotSetZeroAmount
                .selector
        );
        fairnessDAOFairERC721Vesting.withdrawVesting(tokenIds);
    }

    /// @dev Should not allow the caller to withdraw vesting if the latter does not already has an active vesting.
    function testFuzz_withdrawVesting_func_withRevert_callerIsNotVesting(
        address randomCaller,
        uint8 amountToWithdraw
    ) public {
        vm.assume(randomCaller != address(this));
        vm.assume(amountToWithdraw != 0);
        amountToWithdraw % 50 == 0
            ? amountToWithdraw = 1
            : amountToWithdraw = amountToWithdraw % 50;
        uint256[] memory tokenIds = mockERC721.faucet(amountToWithdraw);

        hoax(randomCaller);
        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__UserIsNotVesting
                .selector
        );
        fairnessDAOFairERC721Vesting.withdrawVesting(tokenIds);
    }

    /// @dev Should not allow the caller to withdraw more than he owns.
    function testFuzz_withdrawVesting_func_withRevert_cannotWithdrawMoreThanTheCallerOwns(
    ) public {
        uint256[] memory tokenIds = new uint256[](initialAmountToVest + 1);
        for (uint256 i; i < initialAmountToVest + 1;) {
            tokenIds[i] = i;
            unchecked {
                ++i;
            }
        }
        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__CannotWithdrawMoreThanYouOwn
                .selector
        );
        fairnessDAOFairERC721Vesting.withdrawVesting(tokenIds);
    }

    /// @dev Should allow the caller to withdraw partial vesting with random amount.
    function testFuzz_withdrawVesting_func_partialWithdrawal(
        uint32 timeSkipping,
        uint8 amountToWithdraw
    ) public {
        vm.assume(timeSkipping != 0);
        amountToWithdraw % initialAmountToVest == 0
            ? amountToWithdraw = 1
            : amountToWithdraw = amountToWithdraw % initialAmountToVest;

        skip(timeSkipping);
        fairnessDAOFairERC721Vesting.updateFairVesting(address(this));

        uint256 burnedAmount = (
            ((amountToWithdraw * 1e18) / initialAmountToVest)
        ) * fairnessDAOFairERC721Vesting.balanceOf(address(this)) / 1e18;

        uint256[] memory indexOfTokensIdsToWithdraw =
            new uint256[](amountToWithdraw);
        for (uint256 i; i < amountToWithdraw;) {
            indexOfTokensIdsToWithdraw[i] = i;
            unchecked {
                ++i;
            }
        }
        vm.expectEmit(
            true, true, true, false, address(fairnessDAOFairERC721Vesting)
        );
        emit EventsUtilsERC20.Transfer(address(this), address(0), burnedAmount);
        for (uint256 i = 1; i < amountToWithdraw;) {
            vm.expectEmit(true, true, true, false, address(mockERC721));
            emit EventsUtilsERC721.Transfer(
                address(fairnessDAOFairERC721Vesting),
                address(this),
                amountToWithdraw - i
                );
            unchecked {
                ++i;
            }
        }
        fairnessDAOFairERC721Vesting.withdrawVesting(indexOfTokensIdsToWithdraw);
    }

    /// @dev Should allow the caller to withdraw full vesting with random timeSkipping.
    /// Despite the time skipping, if the user completely withdraws its vesting, the vesting storage is still cleared and no token update is made.
    function testFuzz_withdrawVesting_func_fullWithdrawal(uint32 timeSkipping)
        public
    {
        vm.assume(timeSkipping != 0);
        uint256[] memory tokenIds = new uint256[](initialAmountToVest);
        for (uint256 i; i < initialAmountToVest;) {
            tokenIds[i] = i;
            unchecked {
                ++i;
            }
        }

        skip(timeSkipping);
        fairnessDAOFairERC721Vesting.updateFairVesting(address(this));

        uint256 vestTokenBalance =
            fairnessDAOFairERC721Vesting.balanceOf(address(this));

        vm.expectEmit(
            true, true, true, false, address(fairnessDAOFairERC721Vesting)
        );
        emit EventsUtilsERC20.Transfer(
            address(this), address(0), vestTokenBalance
            );
        for (uint256 i; i < initialAmountToVest;) {
            vm.expectEmit(true, true, true, false, address(mockERC721));
            emit EventsUtilsERC721.Transfer(
                address(fairnessDAOFairERC721Vesting), address(this), i
                );
            unchecked {
                ++i;
            }
        }

        fairnessDAOFairERC721Vesting.withdrawVesting(tokenIds);

        (uint256 startTimestamp, uint256 lastClaimedTimestamp) =
            fairnessDAOFairERC721Vesting.addressToVestingInfo(address(this));
        assertEq(startTimestamp, 0);
        assertEq(lastClaimedTimestamp, 0);
    }

    /// @dev Should not allow the caller to withdraw partial vesting with amount too low.
    function testFuzz_withdrawVesting_func_withRevert_withdrawalAmountTooLow(
        uint32 timeSkipping
    ) public {
        vm.assume(timeSkipping != 0);
        if (timeSkipping < type(uint16).max) {
            timeSkipping = type(uint16).max;
        }

        skip(timeSkipping);
        fairnessDAOFairERC721Vesting.updateFairVesting(address(this));

        uint256[] memory tokenIds = new uint256[](1);
        /// @dev Store a value >> amountToWithdraw for tokenIds vested array length at `addressToTokenIdsVested` slot (#102) for address(this)
        vm.store(
            address(fairnessDAOFairERC721Vesting),
            keccak256(abi.encode(address(this), uint256(102))),
            bytes32(type(uint256).max)
        );
        /// @dev Try to withdraw 1 ERC-721 out of 1.1579209E77. the vToken burn amount can't be computed
        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__WithdrawalAmountIsTooLow
                .selector
        );
        fairnessDAOFairERC721Vesting.withdrawVesting(tokenIds);
    }
}
