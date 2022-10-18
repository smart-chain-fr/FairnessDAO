// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

interface IFairnessDAOFactory {
    function deployFairGovernanceForERC20Token(
        string memory tokenName,
        string memory tokenSymbol,
        address initFairTokenTarget,
        uint256 initZInflationDelta,
        uint256 initMinimumSupplyShareRequiredForSubmittingProposals,
        uint256 initialVoteTimeLengthSoftProposal,
        uint256 initialVoteTimeLengthHardProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForSoftProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForHardProposal,
        uint256 initialMinimumVoterShareRequiredForSoftProposal,
        uint256 initialMinimumVoterShareRequiredForHardProposal,
        uint256 initalBoostedRewardBonusValue
    ) external returns (address, address);
    function fairnessDAOProposalRegistryAddressToOwnerAddress(address)
        external
        view
        returns (address);
}
