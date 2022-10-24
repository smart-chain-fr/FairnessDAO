// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {IFairnessDAOFairVesting} from
    "../contracts/Interfaces/IFairnessDAOFairVesting.sol";
import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {FairnessDAOFairVesting} from "../contracts/FairnessDAOFairVesting.sol";
import {FairnessDAOProposalRegistry} from
    "../contracts/FairnessDAOProposalRegistry.sol";

/// @title DeployFairnessDAOFairVesting
/// @dev Simple deploying script.
/// @author Smart-Chain Team

contract DeployFairnessDAOProposalRegistry is Test {
    FairnessDAOProposalRegistry public fairnessDAOProposalRegistry;

    /// @dev To replace with the proper values in production.
    address public initialFairnessDAOFairVesting =
        address(0xF5FBB09BA243DF4189B978a127a5716C6fAC3F05);
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

        fairnessDAOProposalRegistry = new FairnessDAOProposalRegistry();
        fairnessDAOProposalRegistry.initialize(
            initialFairnessDAOFairVesting,
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
        console.log(address(fairnessDAOProposalRegistry));

        vm.stopBroadcast();
    }
}
