// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {IFairnessDAOFactory} from
    "../contracts/Interfaces/IFairnessDAOFactory.sol";

/// @title DebugFairnessDAOFactory
/// @dev Simple debugging script.
/// @author Smart-Chain Team

contract DebugFairnessDAOFactory is Test {
    /// @dev To replace with the proper values in production.
    address public fairnessDAOFactoryAddress =
        address(0x6CaE3a76d2dBB49301A5dc4aFADeDC1d1375d0Ed);
    /// @dev For FairnessDAOFairVesting.
    string public initTokenName = "Vested FairnessDAO";
    string public initTokenSymbol = "VeFDAO";
    address public initFairTokenTarget =
        address(0xb082f8547F959417b0c75Da4a8E1F291F0495b54);
    /// @notice zInflationDeltaBp:
    uint256 zInflationDeltaBpPoC = 32; // 0.0000032%
    /// @dev (1e+18* 3,154e+7* (1e+18 * 32/1_000_000_000))/1e+18 = 1e+18
    uint256 initZInflationDelta = (1e18 * zInflationDeltaBpPoC) / 1_000_000_000;
    /// @dev For FairnessDAOProposalRegistry.
    uint256 public initMinimumSupplyShareRequiredForSubmittingProposals =
        (1e18 * 1) / 1000;
    uint256 public initialVoteTimeLengthSoftProposal = 1_209_600; // 14 days: 1209600s
    uint256 public initialVoteTimeLengthHardProposal = 2_419_200; // 28 days: 2419200s
    uint256 public initialMinimumTotalSupplyShareRequiredForSoftProposal =
        (1e18 * 330) / 1000;
    uint256 public initialMinimumTotalSupplyShareRequiredForHardProposal =
        (1e18 * 660) / 1000;
    uint256 public initialMinimumVoterShareRequiredForSoftProposal =
        (1e18 * 100) / 1000;
    uint256 public initialMinimumVoterShareRequiredForHardProposal =
        (1e18 * 200) / 1000;
    uint256 public initalBoostedRewardBonusValue = (1e18 * 1000) / 1000;

    function run() public {
        vm.startBroadcast();

        (
            address newFairnessDAOFairVesting,
            address newFairnessDAOProposalRegistry
        ) = IFairnessDAOFactory(fairnessDAOFactoryAddress)
            .deployFairGovernanceForERC20Token(
            initTokenName,
            initTokenSymbol,
            initFairTokenTarget,
            initZInflationDelta,
            initMinimumSupplyShareRequiredForSubmittingProposals,
            initialVoteTimeLengthSoftProposal,
            initialVoteTimeLengthHardProposal,
            initialMinimumTotalSupplyShareRequiredForSoftProposal,
            initialMinimumTotalSupplyShareRequiredForHardProposal,
            initialMinimumVoterShareRequiredForSoftProposal,
            initialMinimumVoterShareRequiredForHardProposal,
            initalBoostedRewardBonusValue
        );

        console.log(msg.sender);
        console.log(address(newFairnessDAOFairVesting));
        console.log(address(newFairnessDAOProposalRegistry));

        vm.stopBroadcast();
    }
}
