// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Initializable} from
    "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {FixedPointMathLib} from
    "@rari-capital/solmate/src/utils/FixedPointMathLib.sol";
import {ERC721Holder} from
    "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {ERC20Upgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

/// @title FairnessDAOFairERC721Vesting
/// @dev Vesting manager for the voting token.
/// @author Smart-Chain Team

/// @dev TODO: Evolve contract to FairnessDAOFairERC721VestingEscrow later.
/// @dev TODO: Remove ERC20 inheritance and simply keep the standard interface.
/// @dev TODO: Add automated zInflationDelta after each update between epochs.
/// @dev TODO: Add snapshot mechanism.
/// @dev TODO: Add initializer.
contract FairnessDAOFairERC721Vesting is
    Initializable,
    ERC20Upgradeable,
    ERC721Holder
{
    using FixedPointMathLib for uint256;

    /// @dev Error when zero amount of token is given.
    error FairnessDAOFairERC721Vesting__CannotSetZeroAmount();

    /// @dev Error when user is not vesting tokens.
    error FairnessDAOFairERC721Vesting__UserIsNotVesting();

    /// @dev Error when caller is trying to increase the vesting of a non vested user.
    error FairnessDAOFairERC721Vesting__CannotIncreaseVestingForNonVestedUser();

    /// @dev Error when user tries to initiate a vesting contract twice.
    error FairnessDAOFairERC721Vesting__UserAlreadyHasActiveVesting();

    /// @dev Error when caller is trying to transfer vesting tokens.
    error FairnessDAOFairERC721Vesting__VestingTokenIsNonTransferable();

    /// @dev Error when user withdrawal amount is too low.
    error FairnessDAOFairERC721Vesting__WithdrawalAmountIsTooLow();

    /// @dev Error when user tries to withdraw more than he actually owns.
    error FairnessDAOFairERC721Vesting__CannotWithdrawMoreThanYouOwn();

    /// @dev Error when caller tries to mint rewards without being allowed to.
    error FairnessDAOFairERC721Vesting__CallerIsNotAllowedToMintRewards();

    struct Vesting {
        uint256 startTimestamp;
        uint256 lastClaimedTimestamp;
    }

    mapping(address => Vesting) public addressToVestingInfo;
    mapping(address => uint256[]) public addressToTokenIdsVested;
    mapping(uint256 => uint256) public tokenIdToIndexOfTokenIdsVested;
    /// @dev All token Ids get 0 as default value.
    address public fairTokenTarget;
    uint256 public zInflationDelta;
    uint256 public totalOwners;
    address public whitelistedProposalRegistry;

    function initialize(
        string memory tokenName,
        string memory tokenSymbol,
        address initFairTokenTarget,
        uint256 initZInflationDelta,
        address initFairDAOProposalRegisteryAddress
    ) public initializer {
        __ERC20_init(tokenName, tokenSymbol);
        fairTokenTarget = initFairTokenTarget;
        zInflationDelta = initZInflationDelta;
        whitelistedProposalRegistry = initFairDAOProposalRegisteryAddress;
    }

    /// @dev Allow the whitelisted Proposal Registry to mint rewards for voters.
    /// The method will also update and claim pending vesting token rewards.
    /// @param recipientAddress Recipient address of the minted rewards.
    /// @param amountToMint Amount of rewards to mint.
    function mintRewards(address recipientAddress, uint256 amountToMint)
        external
    {
        if (msg.sender != whitelistedProposalRegistry) {
            revert FairnessDAOFairERC721Vesting__CallerIsNotAllowedToMintRewards(
            );
        }
        updateFairVesting(recipientAddress);
        _mint(recipientAddress, amountToMint);
    }

    /// @dev Allow the user to initiate vesting.
    /// @param tokenIds Array of ERC-721 tokens Ids to send for vesting.
    function initiateVesting(uint256[] memory tokenIds) external {
        if (tokenIds.length == 0) {
            revert FairnessDAOFairERC721Vesting__CannotSetZeroAmount();
        }
        if (addressToTokenIdsVested[msg.sender].length != 0) {
            revert FairnessDAOFairERC721Vesting__UserAlreadyHasActiveVesting();
        }

        depositTokensForVesting(msg.sender, tokenIds);
        unchecked {
            /// @dev There is around 1.386 billion km³ of water volume on earth.
            ++totalOwners;
        }
    }

    /// @dev Increase the vesting amount of token.
    /// @notice It is mandatory to have initiated a vesting before calling this method.
    /// @param tokenIds Array of ERC-721 tokens Ids to send for increasing an active vesting.
    function increaseVesting(uint256[] memory tokenIds) external {
        if (tokenIds.length == 0) {
            revert FairnessDAOFairERC721Vesting__CannotSetZeroAmount();
        }
        if (addressToTokenIdsVested[msg.sender].length == 0) {
            revert
                FairnessDAOFairERC721Vesting__CannotIncreaseVestingForNonVestedUser(
            );
        }

        updateFairVesting(msg.sender);

        depositTokensForVesting(msg.sender, tokenIds);
    }

    /// @dev Allow user to withdraw his locked vested tokens by burning his vesting tokens.
    /// @notice The user cannot dictate the exact amount of locked vested tokens he wants to withdraw.
    /// The withdrawal is based instead on a ratio of burned vesting tokens compared to his total balance.
    /// @param tokenIdsToWithdraw Array of tokenIds index picked from `tokenIdsVested` array \\ `tokenIdsVestedIndex`
    function withdrawVesting(uint256[] memory tokenIdsToWithdraw) external {
        uint256 amountToWithdraw = tokenIdsToWithdraw.length;
        if (amountToWithdraw == 0) {
            revert FairnessDAOFairERC721Vesting__CannotSetZeroAmount();
        }

        uint256[] storage userVestedTokenIds =
            addressToTokenIdsVested[msg.sender];
        uint256 amountVested = userVestedTokenIds.length;
        if (amountVested == 0) {
            revert FairnessDAOFairERC721Vesting__UserIsNotVesting();
        }

        /// @dev TODO Check if this can replace the `UserIsNotVesting` condition.
        if (amountToWithdraw > amountVested) {
            revert FairnessDAOFairERC721Vesting__CannotWithdrawMoreThanYouOwn();
        }

        uint256 userVestedAmountToBurn;
        uint256 userVestedBalance = balanceOf(msg.sender);
        /// @dev If the user unstakes completely his vesting, we clear the storage.
        if (amountToWithdraw == amountVested) {
            userVestedAmountToBurn = userVestedBalance;
            /// @dev delete userVestedTokenIds and timestamps;
            delete addressToVestingInfo[msg.sender];
            delete addressToTokenIdsVested[msg.sender];

            unchecked {
                /// @dev Safu since a hodler has to be registered in the `totalOwners` variable in the first place before being able to reach this statement.
                --totalOwners;
            }
        }
        /// @dev We return to the caller a share of his initial vesting.
        else {
            assembly {
                /// @dev This will return 0 instead of reverting if the result is zero.
                userVestedAmountToBurn :=
                    div(
                        mul(
                            div(mul(amountToWithdraw, exp(10, 18)), amountVested),
                            userVestedBalance
                        ),
                        exp(10, 18)
                    )
            }

            // if (userVestedAmountToBurn == 0) {
            //     revert FairnessDAOFairERC721Vesting__WithdrawalAmountIsTooLow();
            // }

            for (uint256 i; i < amountToWithdraw; i = unchecked_inc(i)) {
                uint256 indexOfTokenIdToWithdraw =
                    tokenIdToIndexOfTokenIdsVested[tokenIdsToWithdraw[i]];
                require(
                    userVestedTokenIds[indexOfTokenIdToWithdraw]
                        == tokenIdsToWithdraw[i],
                    "You do not own the asset you want to withdraw."
                );
                userVestedTokenIds[indexOfTokenIdToWithdraw] =
                    userVestedTokenIds[amountVested - 1];
                /// @dev amountVested == userVestedTokenIds.length
                tokenIdToIndexOfTokenIdsVested[userVestedTokenIds[indexOfTokenIdToWithdraw]]
                = indexOfTokenIdToWithdraw;

                userVestedTokenIds.pop();
                delete tokenIdToIndexOfTokenIdsVested[tokenIdsToWithdraw[i]];

                unchecked {
                    /// @dev Safu since `amountVested` < `amountToWithdraw`
                    --amountVested;
                }
            }
        }

        /// @dev We burn the caller vTokens.
        burn(userVestedAmountToBurn);

        /// @dev If the user unstakes completely his vesting, he shouldn't have a vesting available on storage.
        if (amountToWithdraw != amountVested) {
            /// @dev We update the user vested balance after the share computation to avoid issues on the integration part.
            updateFairVesting(msg.sender);
        }

        /// @dev We execute the vested token transfer back to its owner.
        /// We do not use the `transferERC721()` internal method to avoid allowance management issues.
        for (uint256 i; i < amountToWithdraw; i = unchecked_inc(i)) {
            IERC721(fairTokenTarget).safeTransferFrom(
                address(this), msg.sender, tokenIdsToWithdraw[i]
            );
        }
    }

    function getTokenIdsVestedByUserAddress(address vesterAddress)
        external
        view
        returns (uint256[] memory)
    {
        return addressToTokenIdsVested[vesterAddress];
    }

    /// @dev Allow anyone to update and distribute the vesting rewards of a specific active vester.
    /// @param vestedAddress Address of the target vester to update.
    function updateFairVesting(address vestedAddress) public {
        uint256 amountToMint = getClaimableFairVesting(vestedAddress);

        /// @dev We update the last claimed timestamp to avoid reetrancy.
        addressToVestingInfo[vestedAddress].lastClaimedTimestamp =
            block.timestamp;

        if (amountToMint != 0) {
            /// @dev We mint the vTokens to the user.
            _mint(vestedAddress, amountToMint);
        }
    }

    /// @dev Allow anyone to burn vesting tokens.
    /// @param amount Amount of vesting tokens to burn.
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
        uint256 amountVested = addressToTokenIdsVested[msg.sender].length;
        if (amountVested == 0) {
            revert FairnessDAOFairERC721Vesting__UserIsNotVesting();
        }

        /// @dev Vesting computation formula: X x Y x Z
        ///      With X:    Amount of locked tokens from the vesting.
        ///      With Y:    Time between now and the last claim timestamp.
        ///      With Z:    Reward delta, updated each p period.
        uint256 yTime = block.timestamp - userVestingTarget.lastClaimedTimestamp;
        amountToMint = (amountVested * yTime).mulWadDown(zInflationDelta);
    }

    /// @dev Internal method to lock tokens for vesting and start earning vesting tokens.
    /// @param depositTarget Address of the target vester to update.
    /// @param tokenIds Array of ERC-721 tokens Ids to vest.
    function depositTokensForVesting(
        address depositTarget,
        uint256[] memory tokenIds
    ) internal {
        Vesting storage userVestingTarget = addressToVestingInfo[depositTarget];
        transferERC721(fairTokenTarget, depositTarget, address(this), tokenIds);

        for (uint256 i; i < tokenIds.length; i = unchecked_inc(i)) {
            tokenIdToIndexOfTokenIdsVested[tokenIds[i]] =
                addressToTokenIdsVested[msg.sender].length;
            addressToTokenIdsVested[msg.sender].push(tokenIds[i]);
        }

        /// @dev If this is the first vesting deposit, we initialize the base start timestamp.
        if (userVestingTarget.startTimestamp == 0) {
            userVestingTarget.startTimestamp = block.timestamp;
            userVestingTarget.lastClaimedTimestamp = block.timestamp;
        }
    }

    /// @dev Transfer ERC-721 tokens from two accounts in a safely manner.
    /// @param tokenAddress ERC-721 token address to transfer.
    /// @param from Address of the ERC-721 token spender.
    /// @param to Recipient address of the ERC-721 token.
    /// @param tokenIds Array of ERC-721 tokens Ids to transfer.
    function transferERC721(
        address tokenAddress,
        address from,
        address to,
        uint256[] memory tokenIds
    ) internal {
        for (uint256 i; i < tokenIds.length; i = unchecked_inc(i)) {
            IERC721(tokenAddress).safeTransferFrom(from, to, tokenIds[i]);
        }
    }

    /// @dev Token transfer override to make the vesting token non-transferable between users.
    /// @param from Address of the sender.
    /// @param to Address of the recipient.
    /// @param amount Amount of vesting tokens to transfer.
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        virtual
        override (ERC20Upgradeable)
    {
        super._beforeTokenTransfer(from, to, amount);
        if (
            from == address(0) || from == address(this) || to == address(0)
                || to == address(whitelistedProposalRegistry)
        ) {
            return;
        } else {
            revert FairnessDAOFairERC721Vesting__VestingTokenIsNonTransferable();
        }
    }

    function unchecked_inc(uint256 i) internal pure virtual returns (uint256) {
        unchecked {
            return ++i;
        }
    }
}
