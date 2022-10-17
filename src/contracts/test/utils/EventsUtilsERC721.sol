// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

library EventsUtilsERC721 {
    /// @dev Add all the events you want to test here

    /// @dev MockERC721
    event Transfer(
        address indexed from, address indexed to, uint256 indexed tokenId
    );
    event Approval(
        address indexed from, address indexed to, uint256 indexed tokenId
    );
}
