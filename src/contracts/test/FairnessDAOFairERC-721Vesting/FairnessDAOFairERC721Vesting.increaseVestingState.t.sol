// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC721} from
    "../initState/InitFairnessDAOFairVestingWithERC721.sol";
import {FairnessDAOFairERC721Vesting} from
    "../../contracts/FairnessDAOFairERC721Vesting.sol";
import {EventsUtils} from "../utils/EventsUtils.sol";
import {EventsUtilsERC721} from "../utils/EventsUtilsERC721.sol";

contract FairnessDAOFairERC721VestingIncreaseVestingStateTest is
    Test,
    InitFairnessDAOFairVestingWithERC721
{
    uint256 public initialAmountToVest = 10;

    function setUp() public virtual override {
        super.setUp();
        uint256[] memory tokenIds = mockERC721.faucet(initialAmountToVest);
        mockERC721.setApprovalForAll(
            address(fairnessDAOFairERC721Vesting), true
        );
        fairnessDAOFairERC721Vesting.initiateVesting(tokenIds);
    }

    /// @dev Should not allow the caller to increase vesting with zero amount.
    function test_increaseVesting_func_withRevert_cannotSetZeroAmount()
        public
    {
        uint256[] memory tokenIds;
        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__CannotSetZeroAmount
                .selector
        );
        fairnessDAOFairERC721Vesting.increaseVesting(tokenIds);
    }

    /// @dev Should not allow the caller to increase vesting if the latter does not already has an active vesting.
    function testFuzz_increaseVesting_func_withRevert_callerIsNotVesting(
        address randomCaller,
        uint8 amountToVest
    ) public {
        vm.assume(randomCaller != address(this));
        vm.assume(amountToVest != 0);
        uint256[] memory tokenIds = new uint256[](amountToVest);
        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__CannotIncreaseVestingForNonVestedUser
                .selector
        );
        hoax(randomCaller);
        fairnessDAOFairERC721Vesting.increaseVesting(tokenIds);
    }

    /// @dev Should not allow the caller to increase vesting with random token Ids if he does not own nor approved with those token Ids.
    function testFuzz_increaseVesting_func_withRevert_ERC721InvalidTokenID(
        uint256 randTokenId
    ) public {
        vm.assume(randTokenId > initialAmountToVest);
        vm.assume(randTokenId < type(uint256).max - initialAmountToVest);
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = randTokenId;
        vm.expectRevert(bytes("ERC721: invalid token ID"));
        fairnessDAOFairERC721Vesting.increaseVesting(tokenIds);
    }

    /// @dev Should not allow the caller to increase vesting with random amount if he does not approve the amount.
    function testFuzz_increaseVesting_func_withRevert_ERC721IncorrectOwner()
        public
    {
        /// @dev we mint deposit assets to increase vesting
        uint256[] memory tokenIds = mockERC721.faucet(2);
        /// @dev random address mint a new token Id
        hoax(makeAddr("randomAddress"));
        mockERC721.faucet(1);
        /// @dev try to vest the last tokenId minted by the random address
        tokenIds[1] = initialAmountToVest + 2;
        vm.expectRevert(bytes("ERC721: caller is not token owner nor approved"));
        fairnessDAOFairERC721Vesting.increaseVesting(tokenIds);
    }

    /// @dev Should allow the caller to initiate vesting with random amount.
    function testFuzz_increaseVesting_func(uint8 amountToVest) public {
        vm.assume(amountToVest != 0);
        amountToVest % 50 == 0
            ? amountToVest = 1
            : amountToVest = amountToVest % 50;
        uint256[] memory tokenIds = mockERC721.faucet(amountToVest);
        for (uint256 i; i < amountToVest;) {
            vm.expectEmit(true, true, true, false, address(mockERC721));
            emit EventsUtilsERC721.Transfer(
                address(this),
                address(fairnessDAOFairERC721Vesting),
                initialAmountToVest + i
                );
            unchecked {
                ++i;
            }
        }

        fairnessDAOFairERC721Vesting.increaseVesting(tokenIds);

        (uint256 startTimestamp, uint256 lastClaimedTimestamp) =
            fairnessDAOFairERC721Vesting.addressToVestingInfo(address(this));
        for (uint256 i; i < amountToVest;) {
            assertEq(
                fairnessDAOFairERC721Vesting.addressToTokenIdsVested(
                    address(this), initialAmountToVest + i
                ),
                initialAmountToVest + i
            );
            unchecked {
                ++i;
            }
        }
        /// @dev Both stay the same since we did not skip time between blocks.
        assertEq(startTimestamp, block.timestamp);
        assertEq(lastClaimedTimestamp, block.timestamp);
    }

    /// @dev Should allow the caller to initiate vesting with fixed amount.
    function test_increaseVesting_func() public {
        uint256 amountToVest = 10;
        uint256[] memory tokenIds = mockERC721.faucet(amountToVest);
        for (uint256 i; i < amountToVest;) {
            vm.expectEmit(true, true, true, true, address(mockERC721));
            emit EventsUtilsERC721.Transfer(
                address(this),
                address(fairnessDAOFairERC721Vesting),
                initialAmountToVest + i
                );
            unchecked {
                ++i;
            }
        }
        fairnessDAOFairERC721Vesting.increaseVesting(tokenIds);

        (uint256 startTimestamp, uint256 lastClaimedTimestamp) =
            fairnessDAOFairERC721Vesting.addressToVestingInfo(address(this));
        for (uint256 i; i < amountToVest;) {
            assertEq(
                fairnessDAOFairERC721Vesting.addressToTokenIdsVested(
                    address(this), initialAmountToVest + i
                ),
                initialAmountToVest + i
            );
            unchecked {
                ++i;
            }
        }
        /// @dev Both stay the same since we did not skip time between blocks.
        assertEq(startTimestamp, block.timestamp);
        assertEq(lastClaimedTimestamp, block.timestamp);
    }
}
