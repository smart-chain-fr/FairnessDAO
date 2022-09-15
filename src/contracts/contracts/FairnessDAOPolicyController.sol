// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FairnessDAOPolicyController
/// @dev First draft of FairnessDAO protocol.
/// @author Smart-Chain Team
/// @dev TODO Optimize the internal storage.
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

    constructor(
        uint256 initMinimumSupplyShareRequiredForSubmittingProposals,
        uint256 initialVoteTimeLengthSoftProposal,
        uint256 initialVoteTimeLengthHardProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForSoftProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForHardProposal,
        uint256 initialMinimumVoterShareRequiredForSoftProposal,
        uint256 initialMinimumVoterShareRequiredForHardProposal
    ) {
        minimumSupplyShareRequiredForSubmittingProposals =
            initMinimumSupplyShareRequiredForSubmittingProposals;
        voteTimeLengthSoftProposal = initialVoteTimeLengthSoftProposal;
        voteTimeLengthHardProposal = initialVoteTimeLengthHardProposal;
        minimumTotalSupplyShareRequiredForSoftProposal =
            initialMinimumTotalSupplyShareRequiredForSoftProposal;
        minimumTotalSupplyShareRequiredForHardProposal =
            initialMinimumTotalSupplyShareRequiredForHardProposal;
        minimumVoterShareRequiredForSoftProposal =
            initialMinimumVoterShareRequiredForSoftProposal;
        minimumVoterShareRequiredForHardProposal =
            initialMinimumVoterShareRequiredForHardProposal;
    }
}
