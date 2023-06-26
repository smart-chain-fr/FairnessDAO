// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TreviStaking {
    error UserNotAccruing();
    error ERC20_TransferToZeroAddress();

    event Transfer(address indexed from, address indexed to, uint256 amount);

    event Approval(
        address indexed owner, address indexed spender, uint256 amount
    );

    string public name;
    string public symbol;
    uint8 public immutable decimals;

    mapping(address => mapping(address => uint256)) public allowance;

    struct Accruer {
        uint256 balance;
        uint128 accrualStartTimestamp;
        uint128 multiplier;
    }

    uint256 public emissionRatePerSecond;

    mapping(address => Accruer) private _accruers;

    uint256 private _currAccrued;
    uint128 private _currEmissionTimestamp;
    uint128 private _currEmissionMultiple;

    address public mockToken;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _emissionRatePerSecond
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        emissionRatePerSecond = _emissionRatePerSecond;
    }

    function approve(address spender, uint256 amount)
        public
        virtual
        returns (bool)
    {
        allowance[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);

        return true;
    }

    function transfer(address to, uint256 amount)
        public
        virtual
        returns (bool)
    {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount)
        public
        virtual
        returns (bool)
    {
        uint256 allowed = allowance[from][msg.sender];

        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - amount;
        }

        _transfer(from, to, amount);

        return true;
    }

    function balanceOf(address addr) public view returns (uint256) {
        Accruer memory accruer = _accruers[addr];

        if (accruer.accrualStartTimestamp == 0) {
            return accruer.balance;
        }

        return (
            (block.timestamp - accruer.accrualStartTimestamp)
                * emissionRatePerSecond
        ) * accruer.multiplier + accruer.balance;
    }

    function totalSupply() public view returns (uint256) {
        return _currAccrued
            + (block.timestamp - _currEmissionTimestamp) * emissionRatePerSecond
                * _currEmissionMultiple;
    }

    function _transfer(address from, address to, uint256 amount)
        internal
        virtual
    {
        if (to == address(0)) revert ERC20_TransferToZeroAddress();

        Accruer storage fromAccruer = _accruers[from];
        Accruer storage toAccruer = _accruers[to];

        fromAccruer.balance = balanceOf(from) - amount;

        unchecked {
            toAccruer.balance += amount;
        }

        if (fromAccruer.accrualStartTimestamp != 0) {
            fromAccruer.accrualStartTimestamp = uint128(block.timestamp);
        }

        emit Transfer(from, to, amount);
    }

    function _startStaking(address addr, uint128 multiplier) internal virtual {
        Accruer storage accruer = _accruers[addr];

        if (accruer.accrualStartTimestamp != 0) {
            accruer.balance = balanceOf(addr);
        } else {
            emit Transfer(address(0), addr, 0);
        }

        IERC20(mockToken).transferFrom(msg.sender, address(this), multiplier);

        _currAccrued = totalSupply();
        _currEmissionTimestamp = uint128(block.timestamp);
        accruer.accrualStartTimestamp = uint128(block.timestamp);

        unchecked {
            _currEmissionMultiple += multiplier;
            accruer.multiplier += multiplier;
        }
    }

    function _stopStaking(address addr, uint128 multiplier) internal virtual {
        Accruer storage accruer = _accruers[addr];

        if (accruer.accrualStartTimestamp == 0) revert UserNotAccruing();

        IERC20(mockToken).transfer(msg.sender, multiplier);

        accruer.balance = balanceOf(addr);
        _currAccrued = totalSupply();
        _currEmissionTimestamp = uint128(block.timestamp);

        _currEmissionMultiple -= multiplier;
        accruer.multiplier -= multiplier;

        if (accruer.multiplier == 0) {
            accruer.accrualStartTimestamp = 0;
        } else {
            accruer.accrualStartTimestamp = uint128(block.timestamp);
        }
    }

    function _mint(address to, uint256 amount) internal virtual {
        Accruer storage accruer = _accruers[to];

        unchecked {
            _currAccrued += amount;
            accruer.balance += amount;
        }

        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal virtual {
        Accruer storage accruer = _accruers[from];

        _currAccrued = totalSupply();
        _currEmissionTimestamp = uint128(block.timestamp);

        accruer.balance = balanceOf(from) - amount;

        unchecked {
            _currAccrued -= amount;
        }

        if (accruer.accrualStartTimestamp != 0) {
            accruer.accrualStartTimestamp = uint128(block.timestamp);
        }

        emit Transfer(from, address(0), amount);
    }

    /// @dev For testing purposes only

    function setToken(address _token) external {
        mockToken = _token;
    }

    function setEmissionRatePerSecond(uint256 _emissionRatePerSecond)
        external
    {
        emissionRatePerSecond = _emissionRatePerSecond;
    }
}
