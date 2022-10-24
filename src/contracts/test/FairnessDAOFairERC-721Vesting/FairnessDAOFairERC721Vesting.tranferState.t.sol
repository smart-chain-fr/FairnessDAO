// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC721} from
    "../initState/InitFairnessDAOFairVestingWithERC721.sol";
import {FairnessDAOFairERC721Vesting} from
    "../../contracts/FairnessDAOFairERC721Vesting.sol";
import {EventsUtilsERC20} from "../utils/EventsUtilsERC20.sol";

contract FairnessDAOFairER721VestingTransferStateTest is
    Test,
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

        /// @dev Skipping one block is more than enough to get a first stack of tokens.
        skip(1);

        fairnessDAOFairERC721Vesting.updateFairVesting(address(this));
    }

    /// @dev Should not allow the user to transfer the vested token to any recipient with any amount.
    function testFuzz_transferFrom_func_withRevert_cannotTransferToRandomRecipient(
        uint16 amountToTransfer,
        address recipient
    ) public {
        vm.assume(amountToTransfer != 0);
        vm.assume(recipient != address(0));

        vm.expectRevert(
            FairnessDAOFairERC721Vesting
                .FairnessDAOFairERC721Vesting__VestingTokenIsNonTransferable
                .selector
        );
        fairnessDAOFairERC721Vesting.transfer(address(2), amountToTransfer);
    }

    /// @dev Should not allow the user to transfer the vested token to zero address.
    function testFuzz_transferFrom_func_withRevert_cannotTransferToZeroAddress(
        uint16 amountToTransfer
    ) public {
        vm.assume(amountToTransfer != 0);

        vm.expectRevert(bytes("ERC20: transfer to the zero address"));
        fairnessDAOFairERC721Vesting.transfer(address(0), amountToTransfer);
    }

    /// @dev Should allow the user to transfer the vested token to the whitelisted proposal registry.
    function testFuzz_transferFrom_func_to_WhitelistedProposalRegistry(
        uint8 amountToTransfer,
        address whitelistedProposalRegistry
    ) public {
        vm.assume(amountToTransfer != 0);
        vm.assume(whitelistedProposalRegistry != address(0));
        amountToTransfer % initialAmountToVest == 0
            ? amountToTransfer = 1
            : amountToTransfer = amountToTransfer % initialAmountToVest;

        /// @dev update whitelistedProposalRegistry address, should not be possible outside the test framework
        vm.store(
            address(fairnessDAOFairERC721Vesting),
            bytes32(uint256(106)),
            bytes32(uint256(uint160(whitelistedProposalRegistry)))
        );

        vm.expectEmit(
            true, true, true, false, address(fairnessDAOFairERC721Vesting)
        );
        emit EventsUtilsERC20.Transfer(
            address(this), whitelistedProposalRegistry, amountToTransfer
            );
        fairnessDAOFairERC721Vesting.transfer(
            whitelistedProposalRegistry, amountToTransfer
        );
    }
}
