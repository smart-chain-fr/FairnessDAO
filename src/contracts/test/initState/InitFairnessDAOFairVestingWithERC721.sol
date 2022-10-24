// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {InitMockERC721} from "../initState/InitMockERC721.sol";
import {FairnessDAOFairERC721Vesting} from
    "../../contracts/FairnessDAOFairERC721Vesting.sol";

abstract contract InitFairnessDAOFairVestingWithERC721 is
    Test,
    InitMockERC721
{
    FairnessDAOFairERC721Vesting fairnessDAOFairERC721Vesting;

    string public tokenName = "tokenName";
    string public tokenSymbol = "tokenSymbol";
    /// @notice zInflationDeltaBp:
    /// 100% = 1000
    /// 10%  = 100
    /// 1%   = 10
    /// 0.1% = 1
    uint256 public zInflationDeltaBp = 1000; // 100%
    uint256 public zInflationDelta = (1e18 * zInflationDeltaBp) / 1000;

    function setUp() public virtual {
        setUpERC721();

        fairnessDAOFairERC721Vesting = new FairnessDAOFairERC721Vesting();
        fairnessDAOFairERC721Vesting.initialize(
            tokenName,
            tokenSymbol,
            address(mockERC721),
            zInflationDelta,
            address(0)
        );
    }
}
