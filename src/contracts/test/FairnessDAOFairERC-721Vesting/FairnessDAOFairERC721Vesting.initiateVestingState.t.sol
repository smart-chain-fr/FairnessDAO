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

contract FairnessDAOFairERC721VestingInitiateVestingStateTest is
    Test,
    InitFairnessDAOFairVestingWithERC721
{
    /// @dev Should not allow the caller to initiate vesting with zero amount.
    function test_initiateVesting_func_withRevert_cannotSetZeroAmount()
        public
    {
        uint256[] memory tokenIds;
        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__CannotSetZeroAmount
                .selector
        );
        fairnessDAOFairERC721Vesting.initiateVesting(tokenIds);
    }

    /// @dev Should not allow the caller to increase vesting with random token Ids if he does not own nor approved with those token Ids.
    function testFuzz_increaseVesting_func_withRevert_ERC721InvalidTokenID(
        uint256 randTokenId
    ) public {
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = randTokenId;
        vm.expectRevert(bytes("ERC721: invalid token ID"));
        fairnessDAOFairERC721Vesting.initiateVesting(tokenIds);
    }

    /// @dev Should not allow the caller to increase vesting with random amount if he does not approve the amount.
    function testFuzz_increaseVesting_func_withRevert_ERC721IncorrectOwner()
        public
    {
        /// @dev we mint deposit assets to increase vesting [0, 1]
        uint256[] memory tokenIds = mockERC721.faucet(2);
        /// @dev random address mint a new token Id [2]
        hoax(makeAddr("randomAddress"));
        mockERC721.faucet(1);
        /// @dev try to vest the last tokenId minted by the random address
        tokenIds[1] = 2;
        vm.expectRevert(bytes("ERC721: caller is not token owner nor approved"));
        fairnessDAOFairERC721Vesting.initiateVesting(tokenIds);
    }

    /// @dev Should allow the caller to initiate vesting with random amount.
    function testFuzz_initiateVesting_func(uint8 amountToVest) public {
        vm.assume(amountToVest != 0);
        amountToVest % 50 == 0
            ? amountToVest = 1
            : amountToVest = amountToVest % 50;
        uint256[] memory tokenIds = mockERC721.faucet(amountToVest);
        mockERC721.setApprovalForAll(
            address(fairnessDAOFairERC721Vesting), true
        );
        for (uint256 i; i < amountToVest;) {
            vm.expectEmit(true, true, true, true, address(mockERC721));
            emit EventsUtilsERC721.Transfer(
                address(this), address(fairnessDAOFairERC721Vesting), i
                );
            unchecked {
                ++i;
            }
        }

        fairnessDAOFairERC721Vesting.initiateVesting(tokenIds);

        (uint256 startTimestamp, uint256 lastClaimedTimestamp) =
            fairnessDAOFairERC721Vesting.addressToVestingInfo(address(this));
        for (uint256 i; i < amountToVest;) {
            assertEq(
                fairnessDAOFairERC721Vesting.addressToTokenIdsVested(
                    address(this), i
                ),
                i
            );
            unchecked {
                ++i;
            }
        }
        /// @dev Both stay the same since we did not skip time between blocks.
        assertEq(startTimestamp, block.timestamp);
        assertEq(lastClaimedTimestamp, block.timestamp);
    }

    /// @dev Should not allow the caller to initiate another vesting if the first one is active.
    function testFuzz_initiateVesting_func_withRevert_cannotInitiateVestingTwice(
        uint8 amountToVest
    ) public {
        vm.assume(amountToVest != 0);
        testFuzz_initiateVesting_func(amountToVest);
        uint256[] memory tokenId = mockERC721.faucet(1);
        mockERC721.setApprovalForAll(
            address(fairnessDAOFairERC721Vesting), true
        );
        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__UserAlreadyHasActiveVesting
                .selector
        );
        fairnessDAOFairERC721Vesting.initiateVesting(tokenId);
    }
}
