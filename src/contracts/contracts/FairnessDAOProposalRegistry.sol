// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IFairnessDAOFairVesting} from "./Interfaces/IFairnessDAOFairVesting.sol";
import {FixedPointMathLib} from
    "@rari-capital/solmate/src/utils/FixedPointMathLib.sol";
import {SafeERC20} from
    "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {FairnessDAOPolicyController} from "./FairnessDAOPolicyController.sol";

/// @title FairnessDAOProposalRegistry
/// @dev First draft of FairnessDAO protocol.
/// @author Smart-Chain Team
contract FairnessDAOProposalRegistry is FairnessDAOPolicyController {
    using SafeERC20 for IFairnessDAOFairVesting;
    using FixedPointMathLib for uint256;

    /// @dev Error when the user is submitting a proposal with a strating time lower than current time.
    error FairnessDAOProposalRegistry__CannotSetStartTimeBelowCurrentTime();

    /// @dev Error when not emough vesting tokens have been minted yet on the FairVesting contract.
    error FairnessDAOProposalRegistry__NotEnoughVestingTokensCirculating();

    /// @dev Error when the proposal submitter does not have enough vesting tokens to initate vote.
    error FairnessDAOProposalRegistry__CallerDoesNotHaveEnoughVestingTokens();

    /// @dev Error when the proposalURI is empty.
    error FairnessDAOProposalRegistry__CannotSetEmptyProposalURI();

    /// @dev Error when the proposal depth is below two.
    error FairnessDAOProposalRegistry__CannotSetProposalDepthToBelowTwo();

    /// @dev Error when the voting period has not started yet.
    error FairnessDAOProposalRegistry__VotingPeriodHasNotStartedYet();

    /// @dev Error when the voting period has already ended.
    error FairnessDAOProposalRegistry__VotingPeriodHasAlreadyEnded();

    /// @dev Error when the voting period has not ended yet.
    error FairnessDAOProposalRegistry__VotingPeriodHasNotEndedYet();

    /// @dev Error when the user interacts with a proposal that does not exist.
    error FairnessDAOProposalRegistry__ProposalDoesNotExist();

    /// @dev Error when the voter choice does not exist in the proposal depth.
    error FairnessDAOProposalRegistry__VotingDepthDoesNotExistInProposalDepth();

    /// @dev Error when the given bounds indexes are incorrect.
    error FairnessDAOProposalRegistry__IncorrectBoundIndex();

    /// @dev Error when the voter has zero voting power.
    error FairnessDAOProposalRegistry__CannotVoteWithZeroWeight();

    /// @dev Error when the voter is trying to vote twice for the same proposal.
    error FairnessDAOProposalRegistry__CannotVoteTwiceOnTheSameProposal();

    /// @dev Error when the caller is claiming rewards for proposal with negative outcome.
    /// A Not Passed status in this context is everything except `Passed` Voting status.
    error FairnessDAOProposalRegistry__CannotClaimRewardsForNotPassedProposal();

    /// @dev Error when the caller is trying to claim rewards twice for the same proposal vote.
    error FairnessDAOProposalRegistry__CannotClaimRewardsTwice();

    /// @dev Error when the caller is trying to claim rewards for a proposal he has not voted on.
    error FairnessDAOProposalRegistry__CannotClaimRewardsForProposalWhereCallerHasNotVoted();

    enum VotingStatus {
        NotStarted,
        InProgress,
        Passed,
        NotPassed,
        Tie,
        WaitingForFinalized,
        Cancelled
    }
    /// @notice NotPassed defines a proposal that did not meet the quorum.
    /// Cancelled is simply a proposal for a V2.

    enum ProposalLevel {
        SP,
        HP
    }

    struct Proposal {
        address proposerAddress;
        uint256 startTime;
        /// @dev Can be removed eventually since the endTime can be computed.
        uint256 endTime;
        /// @dev Can be changed to a different uint size to improve contract storage size.
        uint256 proposalTotalDepth;
        string proposalURI;
        VotingStatus votingStatus;
        ProposalLevel proposalLevel;
        uint256 amountOfVestingTokensBurnt;
    }

    struct Voting {
        /// @dev For each proposal choice, we register the amount of vote.
        /// An DoS should be avoided during the result counting since the amount of proposal choices is capped.
        mapping(uint256 => uint256) proposalDepthToTotalAmountOfVote;
        uint256 totalAmountOfVotingTokensUsed;
        uint256 totalAmountOfUniqueVoters;
    }
    /// @dev Blocks storage variable scope. mapping(address => Vote) addressToUserVote;

    struct Vote {
        uint256 chosenProposalDepth;
        uint256 votingPower;
        uint256 votedAtTimestamp;
    }

    /// @dev Internal Accounting.
    uint256 public proposalCount;
    /// @dev TODO Pop a finalized vote from the queue.
    uint256[] public proposalQueue;
    uint256 public proposalLengthHardcap;
    uint256 public totalAmountOfVestingTokensBurned;

    address public fairnessDAOFairVesting;

    mapping(uint256 => Proposal) public proposalIdToProposalDetails;
    mapping(uint256 => Voting) public proposalIdToVotingStatus;
    mapping(uint256 => mapping(address => Vote)) public
        proposalIdToVoterAddressToUserVote;
    /// @notice The contract won't store pending rewards to claim for the voter.
    /// The latter has to manually claim them, one by one, with the help of an indexer to get the proposal Ids he is eligible for.
    mapping(uint256 => mapping(address => bool)) public
        proposalIdToVoterAddressToHasClaimedStatus;

    constructor(
        address initialFairnessDAOFairVesting,
        uint256 initMinimumSupplyShareRequiredForSubmittingProposals,
        uint256 initialVoteTimeLengthSoftProposal,
        uint256 initialVoteTimeLengthHardProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForSoftProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForHardProposal,
        uint256 initialMinimumVoterShareRequiredForSoftProposal,
        uint256 initialMinimumVoterShareRequiredForHardProposal,
        uint256 initalBoostedRewardBonusValue
    )
        FairnessDAOPolicyController(
            initMinimumSupplyShareRequiredForSubmittingProposals,
            initialVoteTimeLengthSoftProposal,
            initialVoteTimeLengthHardProposal,
            initialMinimumTotalSupplyShareRequiredForSoftProposal,
            initialMinimumTotalSupplyShareRequiredForHardProposal,
            initialMinimumVoterShareRequiredForSoftProposal,
            initialMinimumVoterShareRequiredForHardProposal,
            initalBoostedRewardBonusValue
        )
    {
        fairnessDAOFairVesting = initialFairnessDAOFairVesting;
    }

    function submitProposal(
        uint256 startTime,
        string memory proposalURI,
        uint256 proposalTotalDepth,
        ProposalLevel proposalLevel
    )
        external
    {
        /// @dev We verify if the given voting start time is not below current time.
        if (startTime < block.timestamp) {
            revert
                FairnessDAOProposalRegistry__CannotSetStartTimeBelowCurrentTime();
        }

        uint256 amountRequiredForSubmittingProposals =
            _amountRequiredForSubmittingProposals();
        /// @dev If there is not enough vesting token minted yet, we block the submission process.
        if (amountRequiredForSubmittingProposals == 0) {
            revert
                FairnessDAOProposalRegistry__NotEnoughVestingTokensCirculating();
        }

        /// @dev We verify if the user holds the proper amount of vesting tokens to submit a vote.
        if (
            IFairnessDAOFairVesting(fairnessDAOFairVesting).balanceOf(msg.sender)
                < amountRequiredForSubmittingProposals
        ) {
            revert
                FairnessDAOProposalRegistry__CallerDoesNotHaveEnoughVestingTokens();
        }

        /// @dev We verify if the given proposal URI is not empty.
        if (bytes(proposalURI).length == 0) {
            revert FairnessDAOProposalRegistry__CannotSetEmptyProposalURI();
        }

        /// @dev We verify if the given proposal has at least two possible choices.
        if (proposalTotalDepth < 2) {
            revert FairnessDAOProposalRegistry__CannotSetProposalDepthToBelowTwo();
        }

        /// @dev We burn the user vesting tokens before proceding to the proposal storage.
        IFairnessDAOFairVesting(fairnessDAOFairVesting).transferFrom(
            msg.sender, address(this), amountRequiredForSubmittingProposals
        );
        IFairnessDAOFairVesting(fairnessDAOFairVesting).burn(
            amountRequiredForSubmittingProposals
        );

        unchecked {
            /// @dev Should be safu, we cannot burn more than the total supply of the token.
            totalAmountOfVestingTokensBurned +=
                amountRequiredForSubmittingProposals;
        }

        /// @dev We add the proposal Id to the active queue.
        /// @TODO This array serves no purpose right now.
        proposalQueue.push(proposalCount);

        unchecked {
            proposalIdToProposalDetails[proposalCount] = Proposal(
                msg.sender, // proposerAddress
                startTime, // startTime
                proposalLevel == ProposalLevel.HP
                    /// @dev We check wether the proposal given is a Soft or Hard proposal.
                    ? startTime + voteTimeLengthHardProposal
                    /// @dev Unless the voting time length is improperly set at deployment, the addition should never overflow.
                    : startTime + voteTimeLengthSoftProposal, // endTime
                proposalTotalDepth, // proposalLength
                proposalURI, // proposalURI
                VotingStatus.NotStarted, // votingStatus
                proposalLevel, // proposalLevel
                amountRequiredForSubmittingProposals // amountOfVestingTokensBurnt
            );
            /// @dev Should never overflow unless someone spams an insane amount of proposals
            /// which should not be possible since vesting tokens are required and burned after each submission.
            ++proposalCount;
        }
    }

    function voteOnProposal(uint256 proposalId, uint256 chosenProposalDepth)
        external
    {
        Proposal storage proposal = proposalIdToProposalDetails[proposalId];

        // @TODO Can use proposalCount instead.
        /// @dev If the given proposal Id stores 0 as startTime, it means it does not exist.
        if (proposal.startTime == 0) {
            revert FairnessDAOProposalRegistry__ProposalDoesNotExist();
        }

        /// @dev If the given voter choice does not exist in the proposal depth, it means it does not exist.
        if (chosenProposalDepth >= proposal.proposalTotalDepth) {
            revert
                FairnessDAOProposalRegistry__VotingDepthDoesNotExistInProposalDepth();
        }

        /// @dev The user shall not be able to start voting before the official voting period.
        if (block.timestamp < proposal.startTime) {
            revert FairnessDAOProposalRegistry__VotingPeriodHasNotStartedYet();
        }

        /// @dev The user shall not be able to voting once the voting period has expired.
        if (block.timestamp > proposal.endTime) {
            revert FairnessDAOProposalRegistry__VotingPeriodHasAlreadyEnded();
        }

        /// @dev We store the Vote pointer of the caller.
        // Vote storage userVote =
        //     proposalIdToVotingStatus[proposalId].addressToUserVote[msg.sender];
        Vote storage userVote =
            proposalIdToVoterAddressToUserVote[proposalId][msg.sender];

        /// @dev The user shall not have already voted for this proposal.
        if (userVote.votedAtTimestamp != 0) {
            revert FairnessDAOProposalRegistry__CannotVoteTwiceOnTheSameProposal();
        }

        /// @dev Update of the Voting Status.
        /// If the caller is the first voter, he has to set the proper status.
        if (proposal.votingStatus == VotingStatus.NotStarted) {
            proposal.votingStatus = VotingStatus.InProgress;
        }

        /// @dev We update the user voting power before voting to avoid wasted lost weight.
        IFairnessDAOFairVesting(fairnessDAOFairVesting).updateFairVesting(
            msg.sender
        );

        /// @dev We store in memory the vesting token balance of the voter.
        uint256 voterVestingTokenBalance =
            IFairnessDAOFairVesting(fairnessDAOFairVesting).balanceOf(msg.sender);

        /// @dev The user shall not be able to vote with zero voting power.
        /// This condition seems to never happen since this check is already done in `updateFairVesting()` above.
        /// @TODO Let's see if we keep this line or not after a few battle-test.
        if (voterVestingTokenBalance == 0) {
            revert FairnessDAOProposalRegistry__CannotVoteWithZeroWeight();
        }

        /// @dev We update the user vote first.
        userVote.chosenProposalDepth = chosenProposalDepth;
        userVote.votedAtTimestamp = block.timestamp;
        userVote.votingPower = voterVestingTokenBalance;

        /// @dev Finally, we update the proposal storage.
        Voting storage proposalVoting = proposalIdToVotingStatus[proposalId];
        unchecked {
            /// @dev Did you know there are approximately 7.5*1e+18 grains of sand on Earth, which is about 2^76. Sounds like a lot, right?
            ++proposalVoting.totalAmountOfUniqueVoters;
            /// @dev Should be safe, we cannot overflow the global balance of the vesting token.
            proposalVoting.totalAmountOfVotingTokensUsed +=
                voterVestingTokenBalance;
            /// @dev Same as above, it should be safe since we cannot overflow the global balance of the vesting token.
            proposalVoting.proposalDepthToTotalAmountOfVote[chosenProposalDepth]
            += voterVestingTokenBalance;
        }
    }

    /// @notice Anyone, even someone outside of the DAO can finalize a vote.
    function finalizeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposalIdToProposalDetails[proposalId];

        // @TODO Can use proposalCount instead.
        /// @dev If the given proposal Id stores 0 as startTime, it means it does not exist.
        if (proposal.startTime == 0) {
            revert FairnessDAOProposalRegistry__ProposalDoesNotExist();
        }

        /// @dev The proposal voting time should be over for finalization.
        if (block.timestamp < proposal.endTime) {
            revert FairnessDAOProposalRegistry__VotingPeriodHasNotEndedYet();
        }

        /// @dev We store the address of the original ERC-20 token used for vesting.
        // address ERC20FairTokenTargetAddress = IFairnessDAOFairVesting(fairnessDAOFairVesting).fairTokenTarget();
        // uint256 ERC20FairTokenTargetTotalSupply = IERC20(ERC20FairTokenTargetAddress).totalSupply();

        /// @dev We store the total supply of the vesting token.
        uint256 vestingTotalSupply =
            IFairnessDAOFairVesting(fairnessDAOFairVesting).totalSupply();
        /// @dev We store the total amount of unique hodlers of the vesting token.
        uint256 vestingTotalOwners =
            IFairnessDAOFairVesting(fairnessDAOFairVesting).totalOwners();

        uint256 minSupplyAmountFromShare;
        uint256 minUniqueVoterAmountFromShare;
        if (proposal.proposalLevel == ProposalLevel.HP) {
            minSupplyAmountFromShare = vestingTotalSupply.mulWadDown(
                minimumTotalSupplyShareRequiredForHardProposal
            );
            minUniqueVoterAmountFromShare = vestingTotalOwners.mulWadDown(
                minimumVoterShareRequiredForHardProposal
            );
        } else {
            /// @notice If not HP level, it is SP level by default.
            minSupplyAmountFromShare = vestingTotalSupply.mulWadDown(
                minimumTotalSupplyShareRequiredForSoftProposal
            );
            minUniqueVoterAmountFromShare = vestingTotalOwners.mulWadDown(
                minimumVoterShareRequiredForSoftProposal
            );
        }

        Voting storage proposalVoting = proposalIdToVotingStatus[proposalId];

        if (minUniqueVoterAmountFromShare == 0) {
            proposal.votingStatus = VotingStatus.NotPassed;
        }
        /// @dev We verify the quorum for both QT and QA is met.
        else if (
            proposalVoting.totalAmountOfUniqueVoters > minUniqueVoterAmountFromShare
                && proposalVoting.totalAmountOfVotingTokensUsed > minSupplyAmountFromShare
        ) {
            uint256 maxAmountOfVoteDepth;
            /// @dev We first retrieve the highest amount of vote amount.
            for (
                uint256 i; i < proposal.proposalTotalDepth; i = unchecked_inc(i)
            ) {
                uint256 proposalDepthToTotalAmountOfVote =
                    proposalVoting.proposalDepthToTotalAmountOfVote[i];
                if (maxAmountOfVoteDepth < proposalDepthToTotalAmountOfVote) {
                    maxAmountOfVoteDepth = proposalDepthToTotalAmountOfVote;
                }
            }
            /// @dev Once we retrieved the highest amount of vote amount, we can find the index corresponding to it and check if a tie is there.
            uint256 counterOfmaxAmountOfVoteDepthAppearance; // 0 by default.
            uint256 depthIndex;
            for (
                uint256 j; j < proposal.proposalTotalDepth; j = unchecked_inc(j)
            ) {
                if (
                    maxAmountOfVoteDepth
                        == proposalVoting.proposalDepthToTotalAmountOfVote[j]
                ) {
                    depthIndex = j;
                    unchecked {
                        /// @dev Should be safu, trust me bro.
                        ++counterOfmaxAmountOfVoteDepthAppearance;
                    }
                }
            }
            /// @dev if the counter is above one, it means a tie was found inside the mapping.
            if (counterOfmaxAmountOfVoteDepthAppearance != 1) {
                proposal.votingStatus = VotingStatus.Tie;
            } else {
                proposal.votingStatus = VotingStatus.Passed;
            }
        }
        /// @dev If the quorum was not met, the vote is set to `Not Passed` by default.
        else {
            proposal.votingStatus = VotingStatus.NotPassed;
        }
    }

    function claimRewards(uint256 proposalId) external {
        /// @dev We store the proposal in memory.
        Proposal memory proposal = proposalIdToProposalDetails[proposalId];

        // @TODO Can use proposalCount instead.
        /// @dev If the given proposal Id stores 0 as startTime, it means it does not exist.
        if (proposal.startTime == 0) {
            revert FairnessDAOProposalRegistry__ProposalDoesNotExist();
        }

        /// @dev The proposal voting should be passed to allow the reward distribution.
        if (proposal.votingStatus != VotingStatus.Passed) {
            revert
                FairnessDAOProposalRegistry__CannotClaimRewardsForNotPassedProposal();
        }

        /// @dev We check if the caller has already claimed rewards for this finalized vote.
        if (proposalIdToVoterAddressToHasClaimedStatus[proposalId][msg.sender])
        {
            revert FairnessDAOProposalRegistry__CannotClaimRewardsTwice();
        }

        /// @dev We store the caller vote in memory.
        Vote memory callerVote =
            proposalIdToVoterAddressToUserVote[proposalId][msg.sender];
        /// @dev We store the Proposal voting details in memory.
        Voting storage proposalVoting = proposalIdToVotingStatus[proposalId];
        uint256 claimableAmount;
        /// @dev If the caller is the original submitter of the proposal, he gets a boosted reward.
        /// @TODO Optimize this scope.
        if (proposal.proposerAddress == msg.sender) {
            uint256 totalAmountOfVotingTokensUsed =
                proposalVoting.totalAmountOfVotingTokensUsed;
            uint256 totalAmountOfUniqueVoters =
                proposalVoting.totalAmountOfUniqueVoters;
            /// @dev This will return 0 instead of reverting if the result is zero.
            assembly {
                claimableAmount :=
                    div(totalAmountOfVotingTokensUsed, totalAmountOfUniqueVoters)
            }
            uint256 boostedReward = proposal
                .amountOfVestingTokensBurnt
                .mulWadDown(boostedRewardBonusValue);
            claimableAmount += boostedReward;
        }
        /// @dev Else, if the caller has properly voted on the proposal, we compute simple voting rewards.
        else if (callerVote.votingPower != 0) {
            uint256 totalAmountOfVotingTokensUsed =
                proposalVoting.totalAmountOfVotingTokensUsed;
            uint256 totalAmountOfUniqueVoters =
                proposalVoting.totalAmountOfUniqueVoters;
            /// @dev This will return 0 instead of reverting if the result is zero.
            assembly {
                claimableAmount :=
                    div(totalAmountOfVotingTokensUsed, totalAmountOfUniqueVoters)
            }
        }
        /// @dev Else, the caller has not voted on this passed proposal.
        else {
            revert
                FairnessDAOProposalRegistry__CannotClaimRewardsForProposalWhereCallerHasNotVoted();
        }
        proposalIdToVoterAddressToHasClaimedStatus[proposalId][msg.sender] =
            true;
        IFairnessDAOFairVesting(fairnessDAOFairVesting).mintRewards(
            msg.sender, claimableAmount
        );
    }

    function viewProposal(uint256 proposalId)
        external
        view
        returns (Proposal memory proposal)
    {
        /// @TODO Can use proposalCount instead.
        if (proposalIdToProposalDetails[proposalId].startTime == 0) {
            revert FairnessDAOProposalRegistry__ProposalDoesNotExist();
        }

        proposal = proposalIdToProposalDetails[proposalId];
        proposal.votingStatus = getCurrentVotingStatusOfProposal(proposal);
    }

    function viewMultipleProposals(uint256 fromIndex, uint256 endIndex)
        external
        view
        returns (Proposal[] memory proposals)
    {
        if (fromIndex > endIndex) {
            revert FairnessDAOProposalRegistry__IncorrectBoundIndex();
        }

        /// @TODO Can use proposalCount instead.
        if (proposalIdToProposalDetails[endIndex].startTime == 0) {
            revert FairnessDAOProposalRegistry__ProposalDoesNotExist();
        }

        /// @dev We can start at index 0, so we need to add 1.
        proposals = new Proposal[](endIndex - fromIndex + 1);

        for (uint256 i = fromIndex; i <= endIndex; i = unchecked_inc(i)) {
            proposals[i] = proposalIdToProposalDetails[i];
            proposals[i].votingStatus =
                getCurrentVotingStatusOfProposal(proposals[i]);
        }
    }

    /// @dev TODO
    // function canSubmitWithProposalLevel() public view returns (bool) {
    //     return true;
    // }

    function getCurrentVotingStatusOfProposal(Proposal memory proposal)
        internal
        view
        returns (VotingStatus)
    {
        /// @dev We check if the proposal vote is still in progress.
        if (
            (block.timestamp > proposal.startTime)
                && (block.timestamp < proposal.endTime)
        ) {
            return VotingStatus.InProgress;
        }
        /// @dev Else we check if the proposal voting time has expired but still has not finalized.
        else if (
            (block.timestamp > proposal.endTime)
                && (
                    (proposal.votingStatus == VotingStatus.InProgress)
                        || (proposal.votingStatus == VotingStatus.NotStarted)
                )
        ) {
            return VotingStatus.WaitingForFinalized;
        }
        /// @dev Othewise it must mean the vote has been finalized and properly tagged.
        else {
            return proposal.votingStatus;
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

    /// @dev Increment value through unchecked arithmetic for saving gas
    /// @param i - value to increment
    function unchecked_inc(uint256 i) internal pure returns (uint256) {
        unchecked {
            return ++i;
        }
    }
}
