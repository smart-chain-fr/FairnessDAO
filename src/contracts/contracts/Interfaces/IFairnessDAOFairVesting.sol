// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

interface IFairnessDAOFairVesting {
    event Approval(
        address indexed owner, address indexed spender, uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    function addressToVestingInfo(address)
        external
        view
        returns (
            uint256 amountVested,
            uint256 startTimestamp,
            uint256 lastClaimedTimestamp
        );
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function burn(uint256 amount) external;
    function decimals() external view returns (uint8);
    function decreaseAllowance(address spender, uint256 subtractedValue)
        external
        returns (bool);
    function fairTokenTarget() external view returns (address);
    function getClaimableFairVesting(address vestedAddress)
        external
        view
        returns (uint256 amountToMint);
    function increaseAllowance(address spender, uint256 addedValue)
        external
        returns (bool);
    function increaseVesting(uint256 amountToVest) external;
    function initiateVesting(uint256 amountToVest) external;
    function mintRewards(address recipientAddress, uint256 amountToMint)
        external;
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function totalOwners() external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount)
        external
        returns (bool);
    function updateFairVesting(address vestedAddress) external;
    function whitelistProposalRegistryAddress(
        address setWhitelistedProposalRegistry
    )
        external;
    function whitelistedProposalRegistry() external view returns (address);
    function withdrawVesting(uint256 amountToWithdraw) external;
    function zInflationDelta() external view returns (uint256);
}
