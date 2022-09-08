// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev This contract is only used for testing purposes
contract MockERC20 is ERC20 {
    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 initialSupply
    )
        ERC20(tokenName, tokenSymbol)
    {
        _mint(msg.sender, initialSupply);
    }

    function faucet(uint256 amount_) public {
        _mint(msg.sender, amount_);
    }
}
