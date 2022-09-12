// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC20} from
    "../initState/InitFairnessDAOFairVestingWithERC20.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";

contract FairnessDAOFairVestingPreviewVestingStateTest is
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

    function testFuzz_getClaimableFairVesting_func_withRevert_userIsNotVesting(
        address vestedAddress
    )
        public
    {
        vm.assume(vestedAddress != address(this));

        vm.expectRevert(
            FairnessDAOFairVesting.FairnessDAOFairVesting__UserIsNotVesting.selector
        );
        hoax(vestedAddress);
        fairnessDAOFairVesting.getClaimableFairVesting(vestedAddress);
    }

    function testFuzz_getClaimableFairVesting_func(uint32 timeSkipping)
        public
    {
        vm.assume(timeSkipping != 0);
        skip(timeSkipping);

        assertGt(
            fairnessDAOFairVesting.getClaimableFairVesting(address(this)), 0
        );
    }
}
