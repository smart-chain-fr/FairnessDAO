// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.4;

// import "forge-std/Test.sol";
// import {console} from "forge-std/console.sol";
// import {InitFairnessDAOFactory} from "../initState/InitFairnessDAOFactory.sol";

// contract FairnessDAOFactoryDeployFairGovernanceStateTest is
//     Test,
//     InitFairnessDAOFactory
// {
//     /// @dev Should allow anyone to create a FairGovernance from any ERC-20 token.
//     function testFuzz_deployFairGovernanceForERC20Token_func(
//         string memory tokenName,
//         string memory tokenSymbol,
//         address initFairTokenTarget,
//         uint256 initZInflationDelta,
//         uint256 initMinimumSupplyShareRequiredForSubmittingProposals,
//         uint256 initialVoteTimeLengthSoftProposal,
//         uint256 initialVoteTimeLengthHardProposal,
//         uint256 initialMinimumTotalSupplyShareRequiredForSoftProposal,
//         uint256 initialMinimumTotalSupplyShareRequiredForHardProposal,
//         uint256 initialMinimumVoterShareRequiredForSoftProposal,
//         uint256 initialMinimumVoterShareRequiredForHardProposal,
//         uint256 initalBoostedRewardBonusValue
//     )
//         public
//     {
//         (address fairnessDAOFairVesting, address fairnessDAOProposalRegistry) =
//         fairnessDAOFactory.deployFairGovernanceForERC20Token(
//             tokenName,
//             tokenSymbol,
//             initFairTokenTarget,
//             initZInflationDelta,
//             initMinimumSupplyShareRequiredForSubmittingProposals,
//             initialVoteTimeLengthSoftProposal,
//             initialVoteTimeLengthHardProposal,
//             initialMinimumTotalSupplyShareRequiredForSoftProposal,
//             initialMinimumTotalSupplyShareRequiredForHardProposal,
//             initialMinimumVoterShareRequiredForSoftProposal,
//             initialMinimumVoterShareRequiredForHardProposal,
//             initalBoostedRewardBonusValue
//         );
//         assertTrue(fairnessDAOFairVesting != address(0));
//         assertTrue(fairnessDAOProposalRegistry != address(0));
//     }
// }
