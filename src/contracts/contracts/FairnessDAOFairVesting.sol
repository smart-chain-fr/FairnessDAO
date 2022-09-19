// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from
    "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {FixedPointMathLib} from
    "@rari-capital/solmate/src/utils/FixedPointMathLib.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FairnessDAOFairVesting
/// @dev Vesting manager for the voting token.
/// @author Smart-Chain Team

/// @dev TODO: Evolve contract to FairnessDAOFairVestingEscrow later.
/// @dev TODO: Remove ERC20 inheritance and simply keep the standard interface.
/// @dev TODO: Add automated zInflationDelta after each update between epochs.
/// @dev TODO: Add snapshot mechanism.
contract FairnessDAOFairVesting is ERC20 {
    using SafeERC20 for IERC20;
    using FixedPointMathLib for uint256;

    /// @dev Error when zero amount of token is given.
    error FairnessDAOFairVesting__CannotSetZeroAmount();

    /// @dev Error when user is not vesting tokens.
    error FairnessDAOFairVesting__UserIsNotVesting();

    /// @dev Error when caller is trying to increase the vesting of a non vested user.
    error FairnessDAOFairVesting__CannotIncreaseVestingForNonVestedUser();

    /// @dev Error when user tries to initiate a vesting contract twice.
    error FairnessDAOFairVesting__UserAlreadyHasActiveVesting();

    /// @dev Error when caller is trying to transfer vesting tokens.
    error FairnessDAOFairVesting__VestingTokenIsNonTransferable();

    /// @dev Error when user withdrawal amount is too low.
    error FairnessDAOFairVesting__WithdrawalAmountIsTooLow();

    /// @dev Error when user tries to withdraw more than he actually owns.
    error FairnessDAOFairVesting__CannotWithdrawMoreThanYouOwn();

    /// @dev Error when caller tries to mint rewards without being allowed to.
    error FairnessDAOFairVesting__CallerIsNotAllowedToMintRewards();

    struct Vesting {
        uint256 amountVested;
        uint256 startTimestamp;
        uint256 lastClaimedTimestamp;
    }

    mapping(address => Vesting) public addressToVestingInfo;
    address public fairTokenTarget;
    uint256 public zInflationDelta;
    uint256 public totalOwners;

    address public whitelistedProposalRegistry;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        address initFairTokenTarget,
        uint256 initZInflationDelta
    )
        ERC20(tokenName, tokenSymbol)
    {
        fairTokenTarget = initFairTokenTarget;
        zInflationDelta = initZInflationDelta;
    }

    /// @dev WARNING, This function is purposely lacking security.
    /// DO NOT USE THIS IN PRODUCTION.
    function whitelistProposalRegistryAddress(
        address setWhitelistedProposalRegistry
    )
        external
    {
        whitelistedProposalRegistry = setWhitelistedProposalRegistry;
    }

    function mintRewards(address recipientAddress, uint256 amountToMint)
        external
    {
        if (msg.sender != whitelistedProposalRegistry) {
            revert FairnessDAOFairVesting__CallerIsNotAllowedToMintRewards();
        }
        updateFairVesting(recipientAddress);
        _mint(recipientAddress, amountToMint);
    }

    /// @dev Allow the user to initiate vesting.
    /// @param amountToVest Amount to send for vesting.
    function initiateVesting(uint256 amountToVest) external {
        if (amountToVest == 0) {
            revert FairnessDAOFairVesting__CannotSetZeroAmount();
        }
        if (addressToVestingInfo[msg.sender].amountVested != 0) {
            revert FairnessDAOFairVesting__UserAlreadyHasActiveVesting();
        }

        depositTokensForVesting(msg.sender, amountToVest);
        unchecked {
            /// @dev There is around 1.386 billion km³ of water volume on earth.
            ++totalOwners;
        }
    }

    /// @dev Increase the vesting amount of token.
    /// @notice It is mandatory to have initiated a vesting before calling this method.
    /// @param amountToVest Amount to send for increasing an active vesting.
    function increaseVesting(uint256 amountToVest) external {
        if (amountToVest == 0) {
            revert FairnessDAOFairVesting__CannotSetZeroAmount();
        }
        if (addressToVestingInfo[msg.sender].amountVested == 0) {
            revert FairnessDAOFairVesting__CannotIncreaseVestingForNonVestedUser();
        }

        updateFairVesting(msg.sender);

        depositTokensForVesting(msg.sender, amountToVest);
    }

    /// @dev Allow user to withdraw his locked vested tokens by burning his vesting tokens.
    /// @notice The user cannot dictate the exact amount of locked vested tokens he wants to withdraw.
    /// The withdrawal is based instead on a ratio of burned vesting tokens compared to his total balance.
    /// @param amountToWithdraw Amount of vesting tokens to burn.
    function withdrawVesting(uint256 amountToWithdraw) external {
        if (amountToWithdraw == 0) {
            revert FairnessDAOFairVesting__CannotSetZeroAmount();
        }

        Vesting storage userVestingInfo = addressToVestingInfo[msg.sender];
        if (userVestingInfo.amountVested == 0) {
            revert FairnessDAOFairVesting__UserIsNotVesting();
        }

        /// @dev TODO Check if this can replace the `UserIsNotVesting` condition.
        if (amountToWithdraw > balanceOf(msg.sender)) {
            revert FairnessDAOFairVesting__CannotWithdrawMoreThanYouOwn();
        }

        uint256 unvestedAmountToTransfer;
        uint256 userVestedBalance = balanceOf(msg.sender);
        /// @dev If the user unstakes completely his vesting, we clear the storage.
        if (amountToWithdraw == userVestedBalance) {
            unvestedAmountToTransfer = userVestingInfo.amountVested;
            // delete userVestingInfo;
            delete addressToVestingInfo[msg.sender];
            unchecked {
                /// @dev Safu since a hodler has to be registered in the `totalOwners` variable in the first place before being able to reach this statement.
                ++totalOwners;
            }
        }
        /// @dev We return to the caller a share of his initial vesting.
        else {
            uint256 userAmountVested = userVestingInfo.amountVested;
            assembly {
                /// @dev This will return 0 instead of reverting if the result is zero.
                unvestedAmountToTransfer :=
                    div(
                        mul(
                            div(mul(amountToWithdraw, exp(10, 18)), userVestedBalance),
                            userAmountVested
                        ),
                        exp(10, 18)
                    )
            }

            if (unvestedAmountToTransfer == 0) {
                revert FairnessDAOFairVesting__WithdrawalAmountIsTooLow();
            }
            /// @dev We update the amount of vested token before the transfer.
            unchecked {
                /// @dev Should be safe since the `unvestedAmountToTransfer` value has been reduced above.
                userVestingInfo.amountVested -= unvestedAmountToTransfer;
            }
        }

        /// @dev We burn the caller vTokens.
        burn(amountToWithdraw);

        /// @dev If the user unstakes completely his vesting, he shouldn't have a vesting available on storage.
        if (amountToWithdraw != userVestedBalance) {
            /// @dev We update the user vested balance after the share computation to avoid issues on the integration part.
            updateFairVesting(msg.sender);
        }

        /// @dev We execute the vested token transfer back to its owner.
        /// We do not use the `transferERC20()` internal method to avoid allowance management issues.
        IERC20(fairTokenTarget).safeTransfer(
            msg.sender, unvestedAmountToTransfer
        );
    }

    /// @dev Allow anyone to update and distribute the vesting rewards of a specific active vester.
    /// @param vestedAddress Address of the target vester to update.
    function updateFairVesting(address vestedAddress) public {
        uint256 amountToMint = getClaimableFairVesting(vestedAddress);

        /// @dev We update the last claimed timestamp to avoid reetrancy.
        addressToVestingInfo[msg.sender].lastClaimedTimestamp = block.timestamp;

        if (amountToMint != 0) {
            /// @dev We mint the vTokens to the user.
            _mint(vestedAddress, amountToMint);
        }
    }

    /// @dev Allow anyone to burn vesting tokens.
    /// @param amount Amount of vesting tokens to burn.
    /// @notice If a user burns all of its token by mistake, he won't be able to redeem his vested assets.
    /// He will need to claim vesting tokens first before calling the withdrawal method.
    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    /// @dev Allow anyone to get the amount of vesting rewards for a specific active vester.
    /// @param vestedAddress Address of the target vester to preview.
    function getClaimableFairVesting(address vestedAddress)
        public
        view
        returns (uint256 amountToMint)
    {
        Vesting memory userVestingTarget = addressToVestingInfo[vestedAddress];
        if (userVestingTarget.amountVested == 0) {
            revert FairnessDAOFairVesting__UserIsNotVesting();
        }

        /// @dev Vesting computation formula: X x Y x Z
        ///      With X:    Amount of locked tokens from the vesting.
        ///      With Y:    Time between now and the last claim timestamp.
        ///      With Z:    Reward delta, updated each p period.
        uint256 yTime = block.timestamp - userVestingTarget.lastClaimedTimestamp;
        amountToMint =
            (userVestingTarget.amountVested * yTime).mulWadDown(zInflationDelta);
    }

    /// @dev Internal method to lock tokens for vesting and start earning vesting tokens.
    /// @param depositTarget Address of the target vester to update.
    /// @param amountToVest Amount of tokens to lock for vesting.
    function depositTokensForVesting(
        address depositTarget,
        uint256 amountToVest
    )
        internal
    {
        Vesting storage userVestingTarget = addressToVestingInfo[depositTarget];
        transferERC20(
            fairTokenTarget, depositTarget, address(this), amountToVest
        );
        unchecked {
            /// @dev amountVested added cannot be greater than the total supply of the targeted collection, should be safu.
            userVestingTarget.amountVested += amountToVest;

            /// @dev If this is the first vesting deposit, we initialize the base start timestamp.
            if (userVestingTarget.startTimestamp == 0) {
                userVestingTarget.startTimestamp = block.timestamp;
                userVestingTarget.lastClaimedTimestamp = block.timestamp;
            }
        }
    }

    /// @dev Transfer ERC-20 tokens from two accounts in a safely manner.
    /// @param tokenAddress ERC-20 token address to transfer.
    /// @param from Address of the ERC-20 token spender.
    /// @param to Recipient address of the ERC-20 token.
    /// @param amount Amount of ERC-20 tokens to transfer.
    function transferERC20(
        address tokenAddress,
        address from,
        address to,
        uint256 amount
    )
        internal
    {
        IERC20(tokenAddress).safeTransferFrom(from, to, amount);
    }

    /// @dev Token transfer override to make the vesting token non-transferable between users.
    /// @param from Address of the sender.
    /// @param to Address of the recipient.
    /// @param amount Amount of vesting tokens to transfer.
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        virtual
        override (ERC20)
    {
        super._beforeTokenTransfer(from, to, amount);
        if (from == address(0) || from == address(this) || to == address(0)) {
            return;
        } else {
            revert FairnessDAOFairVesting__VestingTokenIsNonTransferable();
        }
    }
}
