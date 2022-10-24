// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {FairnessDAOFairVesting} from "./FairnessDAOFairVesting.sol";
import {FairnessDAOProposalRegistry} from "./FairnessDAOProposalRegistry.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

/// @title FairnessDAOFactory
/// @dev First draft of FairnessDAO protocol.
/// @author Smart-Chain Team

contract FairnessDAOFactory is Ownable {
    using Counters for Counters.Counter;

    mapping(address => address) public
        fairnessDAOProposalRegistryAddressToOwnerAddress;
    mapping(uint256 => address) public indexToFairnessDAOProposalRegistryAddress;
    mapping(uint256 => address) public indexToFairnessDAOVestingAddress;

    Counters.Counter private fairnessDAOVestingId;
    Counters.Counter private fairnessDAOProposalRegistryId;

    address public vestingLibraryAddress;
    address public proposalLibraryAddress;

    event NewFairVesting(
        address indexed instance, uint256 indexed fairnessDAOVestingId
    );
    event NewFairGovernance(
        address indexed owner,
        address indexed instance,
        uint256 indexed fairnessDAOProposalRegistryId
    );

    /// @dev Update the base contract to clone
    /// @param _vestingLibraryAddress - new vesting base contract address
    /// @param _proposalLibraryAddress - new proposal registry base contract address
    function setLibraryAddress(
        address _vestingLibraryAddress,
        address _proposalLibraryAddress
    ) external onlyOwner {
        vestingLibraryAddress = _vestingLibraryAddress;
        proposalLibraryAddress = _proposalLibraryAddress;
        fairnessDAOVestingId.increment();
        fairnessDAOProposalRegistryId.increment();
        indexToFairnessDAOVestingAddress[fairnessDAOVestingId.current()] =
            _vestingLibraryAddress;
        indexToFairnessDAOProposalRegistryAddress[fairnessDAOProposalRegistryId
            .current()] = _proposalLibraryAddress;
    }

    function deployFairVestingForERC20TokenClone(
        string memory tokenName,
        string memory tokenSymbol,
        address initFairTokenTarget,
        uint256 initZInflationDelta,
        uint256 fairnessDAOFairProposalRegistryIndex
    ) external returns (address) {
        FairnessDAOFairVesting fairnessDAOFairVesting =
            FairnessDAOFairVesting(Clones.clone(vestingLibraryAddress));

        fairnessDAOFairVesting.initialize(
            tokenName,
            tokenSymbol,
            initFairTokenTarget,
            initZInflationDelta,
            indexToFairnessDAOProposalRegistryAddress[fairnessDAOFairProposalRegistryIndex]
        );

        fairnessDAOVestingId.increment();
        uint256 _fairnessDAOVestingId = fairnessDAOVestingId.current();

        indexToFairnessDAOVestingAddress[_fairnessDAOVestingId] =
            address(fairnessDAOFairVesting);

        emit NewFairVesting(
            address(fairnessDAOFairVesting), _fairnessDAOVestingId
            );
        return address(fairnessDAOFairVesting);
    }

    function deployFairGovernanceForERC20TokenClone(
        uint256 fairnessDAOFairVestingIndex,
        uint256 initMinimumSupplyShareRequiredForSubmittingProposals,
        uint256 initialVoteTimeLengthSoftProposal,
        uint256 initialVoteTimeLengthHardProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForSoftProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForHardProposal,
        uint256 initialMinimumVoterShareRequiredForSoftProposal,
        uint256 initialMinimumVoterShareRequiredForHardProposal,
        uint256 initalBoostedRewardBonusValue
    ) external returns (address) {
        FairnessDAOProposalRegistry fairnessDAOProposalRegistry =
            FairnessDAOProposalRegistry(Clones.clone(proposalLibraryAddress));

        fairnessDAOProposalRegistry.initialize(
            indexToFairnessDAOVestingAddress[fairnessDAOFairVestingIndex],
            initMinimumSupplyShareRequiredForSubmittingProposals,
            initialVoteTimeLengthSoftProposal,
            initialVoteTimeLengthHardProposal,
            initialMinimumTotalSupplyShareRequiredForSoftProposal,
            initialMinimumTotalSupplyShareRequiredForHardProposal,
            initialMinimumVoterShareRequiredForSoftProposal,
            initialMinimumVoterShareRequiredForHardProposal,
            initalBoostedRewardBonusValue
        );

        fairnessDAOProposalRegistryId.increment();
        uint256 _fairnessDAOProposalRegistryId =
            fairnessDAOProposalRegistryId.current();

        indexToFairnessDAOProposalRegistryAddress[_fairnessDAOProposalRegistryId]
        = address(fairnessDAOProposalRegistry);

        fairnessDAOProposalRegistryAddressToOwnerAddress[address(
            fairnessDAOProposalRegistry
        )] = msg.sender;

        emit NewFairGovernance(
            msg.sender,
            address(fairnessDAOProposalRegistry),
            _fairnessDAOProposalRegistryId
            );
        return address(fairnessDAOProposalRegistry);
    }

    function getCountersId() external view returns (uint256, uint256) {
        return (
            fairnessDAOVestingId.current(),
            fairnessDAOProposalRegistryId.current()
        );
    }
}
