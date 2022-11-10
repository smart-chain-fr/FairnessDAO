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
    function test_withdrawVesting_func_withRevert_cannotWithdrawMoreThanTheCallerOwns(
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

    /// @dev Should not allow the caller to withdraw an asset he did not stake.
    function testFuzz_withdrawVesting_func_withRevert_cannotWithdrawWithATokenIdTheCallerDoesNotOwn(
        address caller
    ) public {
        vm.assume(caller != address(0));
        vm.assume(caller != address(this));
        vm.assume(caller != address(fairnessDAOFairERC721Vesting));

        startHoax(caller);

        fairnessDAOFairERC721Vesting.getTokenIdsVestedByUserAddress(
            address(this)
        );
        fairnessDAOFairERC721Vesting.getTokenIdsVestedByUserAddress(caller);

        uint256[] memory tokenIdsToVest = mockERC721.faucet(1);
        mockERC721.setApprovalForAll(
            address(fairnessDAOFairERC721Vesting), true
        );
        fairnessDAOFairERC721Vesting.initiateVesting(tokenIdsToVest);

        fairnessDAOFairERC721Vesting.getTokenIdsVestedByUserAddress(caller);

        uint256[] memory tokenIds = new uint256[](1);
        /// @dev The tokenId `0` was staked by the test contract.
        tokenIds[0] = 11;

        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__CallerIsNotTheOwnerOfTheStakedAsset
                .selector
        );
        fairnessDAOFairERC721Vesting.withdrawVesting(tokenIds);

        fairnessDAOFairERC721Vesting.getTokenIdsVestedByUserAddress(
            address(this)
        );
        fairnessDAOFairERC721Vesting.getTokenIdsVestedByUserAddress(caller);
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

        uint256[] memory indexOfTokensIdsToWithdraw =
            new uint256[](amountToWithdraw);
        for (uint256 i; i < amountToWithdraw;) {
            indexOfTokensIdsToWithdraw[i] = i;
            unchecked {
                ++i;
            }
        }

        for (uint256 i; i < amountToWithdraw;) {
            vm.expectEmit(true, true, true, false, address(mockERC721));
            emit EventsUtilsERC721.Transfer(
                address(fairnessDAOFairERC721Vesting), address(this), i
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

    /// @dev Should allow the caller to withdraw partial vesting with random amount.
    function test_withdrawVesting_func_partialWithdrawal() public {
        address caller = makeAddr("CallerForThisTest");

        startHoax(caller);

        /// @dev The first 9 tokenIds are taked.
        uint256[] memory tokenIds = mockERC721.faucet(3);
        /// @dev It should mint 10/11/12.
        mockERC721.setApprovalForAll(
            address(fairnessDAOFairERC721Vesting), true
        );
        fairnessDAOFairERC721Vesting.initiateVesting(tokenIds);

        uint32 timeSkipping = 10 days;

        skip(timeSkipping);
        fairnessDAOFairERC721Vesting.updateFairVesting(address(this));

        uint256[] memory indexOfTokensIdsToWithdraw = new uint256[](1);
        indexOfTokensIdsToWithdraw[0] = 11;

        fairnessDAOFairERC721Vesting.withdrawVesting(indexOfTokensIdsToWithdraw);

        fairnessDAOFairERC721Vesting.getTokenIdsVestedByUserAddress(caller);
    }
}
