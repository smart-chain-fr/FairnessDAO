// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import {MockERC721} from "../../contracts/Mocks/MockERC721.sol";

abstract contract InitMockERC721 {
    MockERC721 public mockERC721;

    function setUpERC721() public virtual {
        /// @dev We should use the `faucet()` method to initialize the balance.
        mockERC721 = new MockERC721("MockERC721", "MOCK");
    }
}
