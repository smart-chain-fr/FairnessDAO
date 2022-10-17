// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC721} from
    "../initState/InitFairnessDAOFairVestingWithERC721.sol";
import {FairnessDAOFairERC721Vesting} from
    "../../contracts/FairnessDAOFairERC721Vesting.sol";

contract FairnessDAOFairERC721VestingPreviewVestingStateTest is
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

    /// @dev Should not allow the user to get a preview of his claimable vested rewards if the latter is not vesting.
    function testFuzz_getClaimableFairVesting_func_withRevert_userIsNotVesting(
        address vestedAddress
    ) public {
        vm.assume(vestedAddress != address(this));

        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__UserIsNotVesting
                .selector
        );
        hoax(vestedAddress);
        fairnessDAOFairERC721Vesting.getClaimableFairVesting(vestedAddress);
    }

    /// @dev Should allow the user to get a preview of his claimable vested rewards.
    function testFuzz_getClaimableFairVesting_func(uint32 timeSkipping)
        public
    {
        vm.assume(timeSkipping != 0);
        skip(timeSkipping);

        assertGt(
            fairnessDAOFairERC721Vesting.getClaimableFairVesting(address(this)),
            0
        );
    }
}
