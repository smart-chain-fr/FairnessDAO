// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

/// @title FairnessDAOPolicyController
/// @dev First draft of FairnessDAO protocol.
/// @author Smart-Chain Team
/// @dev TODO Optimize the internal storage.
/// @dev TODO Set up a generic storage which will be read by all fairness DAOs to streamline everything and avoid broken governances.
abstract contract FairnessDAOPolicyController {
    /// @dev Minimum supply share for submitting proposals should be set with 18 decimals.
    /// ex: 1/1000 = 0.1% = ((1e18 * 1) / 1000);
    uint256 public minimumSupplyShareRequiredForSubmittingProposals;
    /// @dev In seconds.
    uint256 public voteTimeLengthSoftProposal;
    uint256 public voteTimeLengthHardProposal;
    /// @dev Minimum total supply share for meeting quorum should be set with 18 decimals.
    /// ex: 330/1000 = 33% = ((1e18 * 330) / 1000);
    /// ex: 660/1000 = 66% = ((1e18 * 660) / 1000);
    uint256 public minimumTotalSupplyShareRequiredForSoftProposal;
    uint256 public minimumTotalSupplyShareRequiredForHardProposal;
    // /// @dev Basis point defining the minimum share of unique voters for meeting quorum.
    // /// Percentage share should be in base 100.
    // /// 1% = 100
    // uint256 public minimumVoterShareRequiredForSoftProposal;
    // uint256 public minimumVoterShareRequiredForHardProposal;
    /// @dev Minimum share of unique voters for meeting quorum.
    /// ex: 100/1000 = 10% = ((1e18 * 100) / 1000);
    /// ex: 200/1000 = 20% = ((1e18 * 200) / 1000);
    uint256 public minimumVoterShareRequiredForSoftProposal;
    uint256 public minimumVoterShareRequiredForHardProposal;
    /// @dev Bonus value for reward for the caller if his passed proposal met quorum.
    /// ex: 1000/1000 = 100% = ((1e18 * 1000) / 1000);
    uint256 public boostedRewardBonusValue;
}
