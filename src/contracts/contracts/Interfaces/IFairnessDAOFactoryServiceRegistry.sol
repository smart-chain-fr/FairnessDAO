// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

interface IFairnessDAOFactoryServiceRegistry {
    event OwnershipTransferred(
        address indexed previousOwner, address indexed newOwner
    );
    event SubdomainCreated(
        address indexed creator,
        address indexed owner,
        string subdomain,
        string domain
    );

    function ensRegistryWithFallbackAddress() external view returns (address);
    function newSubdomain(
        string memory _subdomain,
        string memory _domain,
        address _owner,
        address _target
    ) external;
    function owner() external view returns (address);
    function publicResolverAddress() external view returns (address);
    function renounceOwnership() external;
    function topdomainNamehash() external view returns (bytes32);
    function transferOwnership(address newOwner) external;
}
