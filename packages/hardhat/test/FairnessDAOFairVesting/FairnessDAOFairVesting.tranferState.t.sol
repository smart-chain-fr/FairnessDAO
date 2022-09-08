// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC20} from
    "../initState/InitFairnessDAOFairVestingWithERC20.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";

contract FairnessDAOFairVestingTransferStateTest is
    Test,
    InitFairnessDAOFairVestingWithERC20
{
    uint256 public initialAmountToVest = 1 ether;

    function setUp() public virtual override {
        super.setUp();
        mockERC20.faucet(initialAmountToVest);
        mockERC20.approve(address(fairnessDAOFairVesting), initialAmountToVest);
        fairnessDAOFairVesting.initiateVesting(initialAmountToVest);
        fairnessDAOFairVesting.addressToVestingInfo(address(this));

        /// @dev Skipping one block is more than enough to get a first stack of tokens.
        skip(1);

        fairnessDAOFairVesting.updateFairVesting(address(this));
    }

    function testFuzz_transferFrom_func_withRevert_cannotTransferToRandomRecipient(uint16 amountToTransfer, address recipient)
        public
    {
        vm.assume(amountToTransfer != 0);
        vm.assume(recipient != address(0));

        vm.expectRevert(FairnessDAOFairVesting.FairnessDAOFairVesting__VestingTokenIsNonTransferable.selector);
        fairnessDAOFairVesting.transfer(
             address(2), amountToTransfer
        );
    }
}
