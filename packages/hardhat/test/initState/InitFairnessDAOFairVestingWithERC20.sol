// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {InitMockERC20} from "../initState/InitMockERC20.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";

abstract contract InitFairnessDAOFairVestingWithERC20 is Test, InitMockERC20 {
    FairnessDAOFairVesting fairnessDAOFairVesting;

    string public tokenName = "tokenName";
    string public tokenSymbol = "tokenSymbol";
    uint256 public zInflationDelta = 1;

    function setUp() public virtual {
        setUpERC20();

        fairnessDAOFairVesting = new FairnessDAOFairVesting(
            tokenName,
            tokenSymbol,
            address(mockERC20),
            zInflationDelta
        );
    }
}
