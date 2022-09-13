// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFairVestingWithERC20} from
    "../initState/InitFairnessDAOFairVestingWithERC20.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";

contract FairnessDAOFairVestingVestingStateTest is
    Test,
    InitFairnessDAOFairVestingWithERC20
{
    address public vesterAddress = makeAddr("vesterAddress");

    /// @dev Should allow user to vest funds and claim periodically.
    function test_shouldAllowUserToVestFundsAndClaimPeriodically() public {
        /// @dev We impersonate vesterAddress during the entire process to avoid dependencies with this contract.
        startHoax(vesterAddress);

        uint256 initialAmountToVest = 1 ether;

        mockERC20.faucet(initialAmountToVest);

        mockERC20.approve(address(fairnessDAOFairVesting), initialAmountToVest);

        fairnessDAOFairVesting.initiateVesting(initialAmountToVest);

        /// @dev Vesting computation formula V = X x Y x Z - debt
        ///      X:    1 ether
        ///      Y:    ...
        ///      Z:    1
        ///      debt: 0

        /// @dev if Y = 10s;
        /// V = 1 ether * 10 * 1 - 0 = 10 ether
        skip(10);
        assertEq(
            fairnessDAOFairVesting.getClaimableFairVesting(vesterAddress),
            10 ether
        );

        assertEq(fairnessDAOFairVesting.balanceOf(vesterAddress), 0);
        fairnessDAOFairVesting.updateFairVesting(vesterAddress);
        assertEq(fairnessDAOFairVesting.balanceOf(vesterAddress), 10 ether);

        /// @dev Vesting computation status:
        ///      X:    1 ether
        ///      Y:    10...
        ///      Z:    1
        ///      debt: 10 ether
    
    
    /// @dev if Y = 60s;
        /// V = 1 ether * 60 * 1 - 10 ether = 50 ether
    }
    
}
