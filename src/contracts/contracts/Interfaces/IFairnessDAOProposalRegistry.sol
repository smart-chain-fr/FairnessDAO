// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

interface IFairnessDAOProposalRegistry {
    event RewardsClaimed(
        uint256 indexed proposalId,
        address indexed redeemerAddress,
        uint256 amountRedeemed
    );

    struct Proposal {
        address a;
        uint256 b;
        uint256 c;
        uint256 d;
        string e;
        uint8 f;
        uint8 g;
        uint256 h;
    }

    function boostedRewardBonusValue() external view returns (uint256);
    function claimRewards(uint256 proposalId) external;
    function fairnessDAOFairVesting() external view returns (address);
    function finalizeProposal(uint256 proposalId) external;
    function minimumSupplyShareRequiredForSubmittingProposals()
        external
        view
        returns (uint256);
    function minimumTotalSupplyShareRequiredForHardProposal()
        external
        view
        returns (uint256);
    function minimumTotalSupplyShareRequiredForSoftProposal()
        external
        view
        returns (uint256);
    function minimumVoterShareRequiredForHardProposal()
        external
        view
        returns (uint256);
    function minimumVoterShareRequiredForSoftProposal()
        external
        view
        returns (uint256);
    function proposalCount() external view returns (uint256);
    function proposalIdToProposalDetails(uint256)
        external
        view
        returns (
            address proposerAddress,
            uint256 startTime,
            uint256 endTime,
            uint256 proposalTotalDepth,
            string memory proposalURI,
            uint8 votingStatus,
            uint8 proposalLevel,
            uint256 amountOfVestingTokensBurnt
        );
    function proposalIdToVoterAddressToHasClaimedStatus(uint256, address)
        external
        view
        returns (bool);
    function proposalIdToVoterAddressToUserVote(uint256, address)
        external
        view
        returns (
            uint256 chosenProposalDepth,
            uint256 votingPower,
            uint256 votedAtTimestamp
        );
    function proposalIdToVotingStatus(uint256)
        external
        view
        returns (
            uint256 totalAmountOfVotingTokensUsed,
            uint256 totalAmountOfUniqueVoters
        );
    function proposalLengthHardcap() external view returns (uint256);
    function proposalQueue(uint256) external view returns (uint256);
    function submitProposal(
        uint256 startTime,
        string memory proposalURI,
        uint256 proposalTotalDepth,
        uint8 proposalLevel
    )
        external;
    function totalAmountOfVestingTokensBurned()
        external
        view
        returns (uint256);
    // function viewMultipleProposals(uint256 fromIndex, uint256 endIndex)
    //     external
    //     view
    //     returns (
    //         (address, uint256, uint256, uint256, string, uint8, uint8, uint256)[] memory
    //             proposals
    //     );
    function viewProposal(uint256 proposalId)
        external
        view
        returns (Proposal memory proposal);
    function voteOnProposal(uint256 proposalId, uint256 chosenProposalDepth)
        external;
    function voteTimeLengthHardProposal() external view returns (uint256);
    function voteTimeLengthSoftProposal() external view returns (uint256);
}
