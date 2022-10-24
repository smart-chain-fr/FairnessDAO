// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {InitFairnessDAOFactory} from
    "../initState/InitFairnessDAOProposalRegistry.sol";
import {FairnessDAOProposalRegistry} from
    "../../contracts/FairnessDAOProposalRegistry.sol";
import {FairnessDAOFairVesting} from
    "../../contracts/FairnessDAOFairVesting.sol";
import {MockERC20} from "../../contracts/Mocks/MockERC20.sol";

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

    /// @dev Should have library address for cloning contracts
    function testFuzz_setlibraryAddress_func_WithRevert_CallerIsNotOwner(
        address caller,
        address newLibraryForVesting,
        address newLibraryForProposals
    ) public {
        vm.assume(caller != address(this));
        hoax(caller);
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        fairnessDAOFactory.setLibraryAddress(
            newLibraryForVesting, newLibraryForProposals
        );
    }

    /// @dev Should allow the factory owner to change the base implementation contract address
    function testFuzz_setlibraryAddress_func(
        address newLibraryForVesting,
        address newLibraryForProposals
    ) public {
        fairnessDAOFactory.setLibraryAddress(
            newLibraryForVesting, newLibraryForProposals
        );
        assertEq(
            fairnessDAOFactory.vestingLibraryAddress(), newLibraryForVesting
        );
        assertEq(
            fairnessDAOFactory.proposalLibraryAddress(), newLibraryForProposals
        );
        (uint256 vestingCounter, uint256 proposalCounter) =
            fairnessDAOFactory.getCountersId();
        assertEq(vestingCounter, 2);
        assertEq(proposalCounter, 2);
    }
}
