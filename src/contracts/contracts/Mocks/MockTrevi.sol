// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "../TreviStaking.sol";

/// @dev This contract is only used for testing purposes
contract MockTrevi is TreviStaking {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint128 _emissionRatePerSecond
    ) TreviStaking(_name, _symbol, _decimals, _emissionRatePerSecond) {}

    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }

    function startDripping(address addr, uint128 multiplier) external virtual {
        _startDripping(addr, multiplier);
    }

    function stopDripping(address addr, uint128 multiplier) external virtual {
        _stopDripping(addr, multiplier);
    }

    function burn(address from, uint256 value) external virtual {
        _burn(from, value);
    }
}
