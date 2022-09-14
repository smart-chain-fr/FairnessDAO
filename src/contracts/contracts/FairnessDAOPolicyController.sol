// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FairnessDAOPolicyController
/// @dev First draft of FairnessDAO protocol.
/// @author Smart-Chain Team

abstract contract FairnessDAOPolicyController {
    /// @dev Minimum supply share for submitting proposals should be set with 18 decimals.
    /// ex: 1/1000 = 0.1% = ((1e18 * 1) / 1000)
    uint256 public minimumSupplyShareRequiredForSubmittingProposals;
    /// @dev In seconds.
    uint256 public voteTimeLengthSoftProposal;
    uint256 public voteTimeLengthHardProposal;

    constructor(
        uint256 initMinimumSupplyShareRequiredForSubmittingProposals,
        uint256 initialVoteTimeLengthSoftProposal,
        uint256 initialVoteTimeLengthHardProposal
    ) {
        minimumSupplyShareRequiredForSubmittingProposals =
            initMinimumSupplyShareRequiredForSubmittingProposals;
        voteTimeLengthSoftProposal = initialVoteTimeLengthSoftProposal;
        voteTimeLengthHardProposal = initialVoteTimeLengthHardProposal;
    }
}
