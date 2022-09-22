// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import {IPublicResolver} from "./Interfaces/IPublicResolver.sol";
import {IENSRegistryWithFallback} from
    "./Interfaces/IENSRegistryWithFallback.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FairnessDAOFactoryServiceRegistry
/// @dev First draft of FairnessDAO protocol.
/// @author Smart-Chain Team

contract FairnessDAOFactoryServiceRegistry is Ownable {
    /// @dev
    /// ENS registry is deployed at:
    /// 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
    /// Key entrypoints:
    /// `function register(bytes32 label, address owner) public;`
    /// `function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external;`

    /// @dev Error when the contract does not own the ENS domain.
    error FairnessDAOFactoryServiceRegistry__ContractDoesNotOwnTheDomain();

    /// @dev Error when the ENS subdomain is already allocated.
    error FairnessDAOFactoryServiceRegistry__SubdomainAlreadyAllocated();

    /// @dev Error when the caller is not the FairnessDAOFactory.
    error FairnessDAOFactoryServiceRegistry__CallerIsNotAllowed();

    address public ensRegistryWithFallbackAddress;
    address public publicResolverAddress;
    address public fairnessDAOFactoryAddress;
    bytes32 emptyNamehash = 0x00;
    bytes32 public topdomainNamehash;

    event SubdomainCreated(
        address indexed owner, string subdomain, string domain
    );

    constructor(
        address initialENSRegistryWithFallbackAddress,
        address initialPublicResolverAddress,
        string memory topdomain
    ) {
        ensRegistryWithFallbackAddress = initialENSRegistryWithFallbackAddress;
        publicResolverAddress = initialPublicResolverAddress;
        /// @dev We create a namehash for the topdomain.
        topdomainNamehash = keccak256(
            abi.encodePacked(emptyNamehash, keccak256(abi.encodePacked(topdomain)))
        );
    }

    function setFairnessDAOFactoryAddress(address newFairnessDAOFactoryAddress)
        external
        onlyOwner
    {
        fairnessDAOFactoryAddress = newFairnessDAOFactoryAddress;
    }

    /// @dev Allows to create a subdomain (e.g. "fairnessdao.mycustomsubfairdao.eth"),
    /// set its resolver and set its target address.
    /// @param _subdomain - sub domain name only e.g. "mycustomsubfairdao"
    /// @param _domain - domain name e.g. "fairnessdao"
    /// @param _owner - address that will become owner of this new subdomain
    /// @param _target - address that this new domain will resolve to
    function newSubdomain(
        string memory _subdomain,
        string memory _domain,
        address _owner,
        address _target
    )
        external
    {
        if (msg.sender != fairnessDAOFactoryAddress) {
            revert FairnessDAOFactoryServiceRegistry__CallerIsNotAllowed();
        }

        /// @dev We create a namehash for the domain.
        bytes32 domainNamehash = keccak256(
            abi.encodePacked(topdomainNamehash, keccak256(abi.encodePacked(_domain)))
        );
        /// @dev Verify this contract owns the original main domain.
        if (
            IENSRegistryWithFallback(ensRegistryWithFallbackAddress).owner(
                domainNamehash
            ) != address(this)
        ) {
            revert
                FairnessDAOFactoryServiceRegistry__ContractDoesNotOwnTheDomain();
        }

        /// @dev Create labelhash for the sub domain.
        bytes32 subdomainLabelhash = keccak256(abi.encodePacked(_subdomain));
        /// @dev Create namehash for the sub domain.
        bytes32 subdomainNamehash =
            keccak256(abi.encodePacked(domainNamehash, subdomainLabelhash));

        /// @dev We verify if the subdomain is not already owned.
        require(
            IENSRegistryWithFallback(ensRegistryWithFallbackAddress).owner(
                subdomainNamehash
            ) == address(0)
                || IENSRegistryWithFallback(ensRegistryWithFallbackAddress).owner(
                    subdomainNamehash
                ) == msg.sender,
            "This sub domain is already owned."
        );
        /// @dev We create a new subdomain, temporarily this smart-contract is the owner.
        IENSRegistryWithFallback(ensRegistryWithFallbackAddress).setSubnodeOwner(
            domainNamehash, subdomainLabelhash, address(this)
        );
        /// @dev Setting public resolver for this domain.
        IENSRegistryWithFallback(ensRegistryWithFallbackAddress).setResolver(
            subdomainNamehash, publicResolverAddress
        );
        /// @dev Setting the destination address.
        IPublicResolver(publicResolverAddress).setAddr(
            subdomainNamehash, _target
        );
        /// @dev Changing the ownership back to requested owner.
        IENSRegistryWithFallback(ensRegistryWithFallbackAddress).setOwner(
            subdomainNamehash, _owner
        );

        emit SubdomainCreated(_owner, _subdomain, _domain);
    }
}
