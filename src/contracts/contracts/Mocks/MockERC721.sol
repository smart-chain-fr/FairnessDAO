// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

/// @dev This contract is only used for testing purposes
contract MockERC721 is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter public _tokenIds;

    string _tokenBaseURI;

    constructor(string memory tokenName, string memory tokenSymbol)
        ERC721(tokenName, tokenSymbol)
    {}

    function faucet(uint256 amount_) public returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](amount_);
        for (uint256 i; i < amount_;) {
            uint256 currentTokenId = _tokenIds.current();
            _mint(msg.sender, currentTokenId);
            _tokenIds.increment();
            tokenIds[i] = currentTokenId;
            unchecked {
                ++i;
            }
        }
        return tokenIds;
    }

    function setTokenBaseURI(string memory baseURI) external {
        _tokenBaseURI = baseURI;
    }

    function _baseURI()
        internal
        view
        virtual
        override
        returns (string memory)
    {
        return _tokenBaseURI;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }
}
