// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {FairnessDAOFairERC721Vesting} from "./FairnessDAOFairERC721Vesting.sol";
import {FairnessDAOProposalRegistry} from "./FairnessDAOProposalRegistry.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

/// @title FairnessDAOFactory
/// @dev First draft of FairnessDAO protocol.
/// @author Smart-Chain Team

contract FairnessDAOFactoryERC721 is Ownable {
    using Counters for Counters.Counter;

    mapping(address => address) public
        fairnessDAOProposalRegistryAddressToOwnerAddress;
    mapping(uint256 => address) public indexToFairnessDAOProposalRegistryAddress;
    mapping(uint256 => address) public indexToFairnessDAOVestingAddress;

    Counters.Counter public fairnessDAOVestingERC721Id;
    Counters.Counter public fairnessDAOProposalRegistryId;

    address vestingLibraryAddress;
    address proposalLibraryAddress;

    event NewFairVesting(
        address indexed instance, uint256 indexed fairnessDAOVestingERC721Id
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
    }

    function deployFairVestingForERC20TokenClone(
        string memory tokenName,
        string memory tokenSymbol,
        address initFairTokenTarget,
        uint256 initZInflationDelta,
        uint256 fairnessDAOFairProposalRegistryIndex
    ) external returns (address, address) {
        FairnessDAOFairERC721Vesting fairnessDAOFairERC721Vesting =
            FairnessDAOFairERC721Vesting(Clones.clone(vestingLibraryAddress));

        fairnessDAOFairERC721Vesting.initialize(
            tokenName,
            tokenSymbol,
            initFairTokenTarget,
            initZInflationDelta,
            indexToFairnessDAOProposalRegistryAddress[fairnessDAOFairProposalRegistryIndex]
        );

        fairnessDAOVestingERC721Id.increment();
        uint256 _fairnessDAOVestingERC721Id =
            fairnessDAOVestingERC721Id.current();

        indexToFairnessDAOVestingAddress[_fairnessDAOVestingERC721Id] =
            address(fairnessDAOFairERC721Vesting);

        emit NewFairVesting(
            address(fairnessDAOFairERC721Vesting), _fairnessDAOVestingERC721Id
            );
    }

    function deployFairGovernanceForERC721TokenClone(
        uint256 fairnessDAOFairERC721VestingIndex,
        uint256 initMinimumSupplyShareRequiredForSubmittingProposals,
        uint256 initialVoteTimeLengthSoftProposal,
        uint256 initialVoteTimeLengthHardProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForSoftProposal,
        uint256 initialMinimumTotalSupplyShareRequiredForHardProposal,
        uint256 initialMinimumVoterShareRequiredForSoftProposal,
        uint256 initialMinimumVoterShareRequiredForHardProposal,
        uint256 initalBoostedRewardBonusValue
    ) external returns (address, address) {
        FairnessDAOProposalRegistry fairnessDAOProposalRegistry =
            FairnessDAOProposalRegistry(Clones.clone(proposalLibraryAddress));

        fairnessDAOProposalRegistry.initialize(
            indexToFairnessDAOVestingAddress[fairnessDAOFairERC721VestingIndex],
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
    }
}
