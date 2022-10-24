// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFactory} from
    "../initState/InitFairnessDAOProposalRegistry.sol";
import {IFairnessDAOFairVesting} from
    "../../contracts/Interfaces/IFairnessDAOFairVesting.sol";
import {ERC20Upgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract FairnessDAOFactorySetLibraryAddressStateTest is
    Test,
    InitFairnessDAOFactory
{
    /// @dev Should have library address for cloning contracts
    function test_libraryAddress_func() public {
        assertEq(
            fairnessDAOFactory.vestingLibraryAddress(),
            address(fairnessDAOFairVesting)
        );
        assertEq(
            fairnessDAOFactory.proposalLibraryAddress(),
            address(fairnessDAOProposalRegistry)
        );
        (uint256 vestingCounter, uint256 proposalCounter) =
            fairnessDAOFactory.getCountersId();
        assertEq(vestingCounter, 1);
        assertEq(proposalCounter, 1);
    }

    /// @dev Should deploy fair vesting contract with random parameters
    function testFuzz_deployFairVestingForERC20TokenClone_func(
        string memory tokenName,
        string memory tokenSymbol,
        address initFairTokenTarget,
        uint256 initZInflationDelta
    ) public {
        address deployedInstanceAddress = fairnessDAOFactory
            .deployFairVestingForERC20TokenClone(
            tokenName, tokenSymbol, initFairTokenTarget, initZInflationDelta, 1
        );

        assertEq(ERC20Upgradeable(deployedInstanceAddress).name(), tokenName);
        assertEq(
            ERC20Upgradeable(deployedInstanceAddress).symbol(), tokenSymbol
        );
        assertEq(
            IFairnessDAOFairVesting(deployedInstanceAddress).fairTokenTarget(),
            initFairTokenTarget
        );
        assertEq(
            IFairnessDAOFairVesting(deployedInstanceAddress).zInflationDelta(),
            initZInflationDelta
        );
        assertEq(
            IFairnessDAOFairVesting(deployedInstanceAddress)
                .whitelistedProposalRegistry(),
            address(fairnessDAOProposalRegistry)
        );
    }
}
