// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {FairnessDAOFairVesting} from "./FairnessDAOFairVesting.sol";
import {FairnessDAOProposalRegistry} from "./FairnessDAOProposalRegistry.sol";

/// @title FairnessDAOFactory
/// @dev First draft of FairnessDAO protocol.
/// @author Smart-Chain Team

contract FairnessDAOFactory {
    mapping(address => address) public
        fairnessDAOProposalRegistryAddressToOwnerAddress;

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
    ) external returns (address, address) {
        FairnessDAOFairVesting fairnessDAOFairVesting =
        new FairnessDAOFairVesting(tokenName,tokenSymbol,initFairTokenTarget,initZInflationDelta);
        FairnessDAOProposalRegistry fairnessDAOProposalRegistry =
        new FairnessDAOProposalRegistry(address(fairnessDAOFairVesting),initMinimumSupplyShareRequiredForSubmittingProposals,
            initialVoteTimeLengthSoftProposal,
            initialVoteTimeLengthHardProposal,
            initialMinimumTotalSupplyShareRequiredForSoftProposal,
            initialMinimumTotalSupplyShareRequiredForHardProposal,
            initialMinimumVoterShareRequiredForSoftProposal,
            initialMinimumVoterShareRequiredForHardProposal,
            initalBoostedRewardBonusValue);

        fairnessDAOFairVesting.whitelistProposalRegistryAddress(
            address(fairnessDAOProposalRegistry)
        );

        fairnessDAOProposalRegistryAddressToOwnerAddress[address(
            fairnessDAOProposalRegistry
        )] = msg.sender;

        return (
            address(fairnessDAOFairVesting),
            address(fairnessDAOProposalRegistry)
        );
    }
}
