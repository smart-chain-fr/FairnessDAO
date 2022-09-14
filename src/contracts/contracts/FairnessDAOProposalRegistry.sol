// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {FixedPointMathLib} from
    "@rari-capital/solmate/utils/FixedPointMathLib.sol";
import {SafeERC20} from
    "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IFairnessDAOFairVesting} from "./Interfaces/IFairnessDAOFairVesting.sol";
import {FairnessDAOPolicyController} from "./FairnessDAOPolicyController.sol";

/// @title FairnessDAOProposalRegistry
/// @dev First draft of FairnessDAO protocol.
/// @author Smart-Chain Team

contract FairnessDAOProposalRegistry is FairnessDAOPolicyController {
    using SafeERC20 for IFairnessDAOFairVesting;
    using FixedPointMathLib for uint256;

    /// @dev Error when the proposal submitter does not have enough vesting tokens to initate vote.
    error FairnessDAOProposalRegistry__CallerDoesNotHaveEnoughVestingTokens();

    /// @dev Error when the proposalURI is empty.
    error FairnessDAOProposalRegistry__CannotSetEmptyProposalURI();

    /// @dev Error when the voting period has not started yet.
    error FairnessDAOProposalRegistry__VotingPeriodHasNotStartedYet();

    /// @dev Internal Accounting.
    uint256 public proposalCount;
    uint256[] public proposalQueue;
    uint256 public proposalLengthHardcap;
    uint256 totalAmountOfVestingTokensBurned;

    address fairnessDAOFairVesting;

    mapping(uint256 => Proposal) proposalIdToProposalDetails;

    enum VotingStatus {
        NotStarted,
        InProgress,
        Passed,
        Tie
    }
    /// NotPassed cannot be used since the contract has no knowledge of the choices' weights.

    enum ProposalLevel {
        Soft,
        Hard
    }

    struct Proposal {
        address proposerAddress;
        uint256 startTime;
        uint256 endTime;
        /// @dev Can be removed eventually since the endTime can be computed.
        uint256 proposalLength;
        string proposalURI;
        VotingStatus votingStatus;
        ProposalLevel proposalLevel;
    }

    struct Voting {
        uint256 proposalId;
        /// @dev For each proposal choice, we register the amount of vote.
        /// An DoS should be avoided during the result counting since the amount of proposal choices is capped.
        mapping(uint256 => uint256) proposalChoiceToTotalAmountOfVote;
        uint256 totalAmountOfVotingTokensUsed;
        uint256 totalAmountOfUniqueVoters;
        mapping(address => Vote) addressToUserVote;
    }

    struct Vote {
        uint256 chosenProposalLevel;
        uint256 votedAtTimestamp;
    }

    constructor(
        address initialFairnessDAOFairVesting,
        uint256 initMinimumSupplyShareRequiredForSubmittingProposals,
        uint256 initialVoteTimeLengthSoftProposal,
        uint256 initialVoteTimeLengthHardProposal
    )
        FairnessDAOPolicyController(
            initMinimumSupplyShareRequiredForSubmittingProposals,
            initialVoteTimeLengthSoftProposal,
            initialVoteTimeLengthHardProposal
        )
    {
        fairnessDAOFairVesting = initialFairnessDAOFairVesting;
    }

    function submitProposal(
        uint256 startTime,
        string memory proposalURI,
        uint256 proposalLength,
        ProposalLevel proposalLevel
    )
        external
    {
        uint256 amountRequiredForSubmittingProposals =
            _amountRequiredForSubmittingProposals();
        if (
            IFairnessDAOFairVesting(fairnessDAOFairVesting).balanceOf(msg.sender)
                < amountRequiredForSubmittingProposals
        ) {
            revert
                FairnessDAOProposalRegistry__CallerDoesNotHaveEnoughVestingTokens();
        }

        if (bytes(proposalURI).length == 0) {
            revert FairnessDAOProposalRegistry__CannotSetEmptyProposalURI();
        }

        /// @dev We burn the user vesting tokens before proceding to the proposal storage.
        IFairnessDAOFairVesting(fairnessDAOFairVesting).burn(
            amountRequiredForSubmittingProposals
        );

        unchecked {
            proposalIdToProposalDetails[proposalCount] = Proposal(
                msg.sender, // proposerAddress
                startTime, // startTime
                proposalLevel == ProposalLevel.Soft
                    /// @dev We check wether the proposal given is a Soft or Hard proposal.
                    ? startTime + voteTimeLengthSoftProposal
                    /// @dev Unless the voting time length is improperly set at deployment, the addition should never overflow.
                    : startTime + voteTimeLengthHardProposal, // endTime
                proposalLength, // proposalLength
                proposalURI, // proposalURI
                VotingStatus.NotStarted, // votingStatus
                proposalLevel // proposalLevel
            );
            /// @dev Should never overflow unless someone spams an insane amount of proposals
            /// which should not be possible since vesting tokens are required and burned after each submission.
            ++proposalCount;
        }
    }

    function _amountRequiredForSubmittingProposals()
        internal
        view
        returns (uint256)
    {
        return IFairnessDAOFairVesting(fairnessDAOFairVesting).totalSupply()
            .mulWadDown(minimumSupplyShareRequiredForSubmittingProposals);
    }
}
