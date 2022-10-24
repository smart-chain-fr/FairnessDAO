// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {InitMockERC721} from "./InitMockERC721.sol";
import {InitFairnessDAOFactoryERC721} from "./InitFairnessDAOFactoryERC721.sol";

abstract contract InitFairnessDAOFairVestingInstanceWithERC721 is
    Test,
    InitFairnessDAOFactoryERC721,
    InitMockERC721
{
    string public tokenName = "tokenName";
    string public tokenSymbol = "tokenSymbol";
    /// @notice zInflationDeltaBp:
    /// 100% = 1000
    /// 10%  = 100
    /// 1%   = 10
    /// 0.1% = 1
    uint256 public zInflationDeltaBp = 1000; // 100%
    uint256 public zInflationDelta = (1e18 * zInflationDeltaBp) / 1000;

    function setUp() public virtual override {
        super.setUp();
        setUpERC721();

        fairnessDAOFairERC721Vesting.initialize(
            tokenName,
            tokenSymbol,
            address(mockERC721),
            zInflationDelta,
            address(fairnessDAOProposalRegistry)
        );
    }
}
