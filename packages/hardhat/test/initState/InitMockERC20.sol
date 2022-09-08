// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import {MockERC20} from "../../contracts/Mocks/MockERC20.sol";

abstract contract InitMockERC20 {
    MockERC20 public mockERC20;

    function setUpERC20() public virtual {
        /// @dev We should use the `faucet()` method to initialize the balance.
        mockERC20 = new MockERC20("MockERC20", "MOCK", 0);
    }
}
