// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

library EventsUtils {
    /// @dev Add all the events you want to test here

    /// @dev FairnessDAOProposalRegistry
    event RewardsClaimed(
        uint256 indexed proposalId,
        address indexed redeemerAddress,
        uint256 amountRedeemed
    );
}
