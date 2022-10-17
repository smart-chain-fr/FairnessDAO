// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC20} from
    "../initState/InitFairnessDAOFairVestingWithERC20.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";
import {EventsUtilsERC20} from "../utils/EventsUtilsERC20.sol";

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

        /// @dev Skipping one block is more than enough to get a first stack of tokens.
        skip(1);

        fairnessDAOFairVesting.updateFairVesting(address(this));
    }

    /// @dev Should not allow the user to transfer the vested token to any recipient with any amount.
    function testFuzz_transferFrom_func_withRevert_cannotTransferToRandomRecipient(
        uint16 amountToTransfer,
        address recipient
    ) public {
        vm.assume(amountToTransfer != 0);
        vm.assume(recipient != address(0));

        vm.expectRevert(
            FairnessDAOFairVesting
                .FairnessDAOFairVesting__VestingTokenIsNonTransferable
                .selector
        );
        fairnessDAOFairVesting.transfer(address(2), amountToTransfer);
    }

    /// @dev Should not allow the user to transfer the vested token to zero address.
    function testFuzz_transferFrom_func_withRevert_cannotTransferToZeroAddress(
        uint16 amountToTransfer
    ) public {
        vm.assume(amountToTransfer != 0);

        vm.expectRevert(bytes("ERC20: transfer to the zero address"));
        fairnessDAOFairVesting.transfer(address(0), amountToTransfer);
    }

    /// @dev Should allow the user to transfer the vested token to the whitelisted proposal registry.
    function testFuzz_transferFrom_func_to_WhitelistedProposalRegistry(
        uint256 amountToTransfer,
        address whitelistedProposalRegistry
    ) public {
        vm.assume(amountToTransfer != 0);
        vm.assume(whitelistedProposalRegistry != address(0));
        amountToTransfer % initialAmountToVest == 0
            ? amountToTransfer = 1
            : amountToTransfer = amountToTransfer % initialAmountToVest;
        /// @dev update whitelistedProposalRegistry address, should not be possible outside the test framework
        vm.store(
            address(fairnessDAOFairVesting),
            bytes32(uint256(105)),
            bytes32(uint256(uint160(whitelistedProposalRegistry)))
        );
        vm.expectEmit(true, true, true, false, address(fairnessDAOFairVesting));
        emit EventsUtilsERC20.Transfer(
            address(this), whitelistedProposalRegistry, amountToTransfer
            );
        fairnessDAOFairVesting.transfer(
            whitelistedProposalRegistry, amountToTransfer
        );
    }
}
