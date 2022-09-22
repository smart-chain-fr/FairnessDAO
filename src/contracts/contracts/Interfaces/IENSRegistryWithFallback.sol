// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

interface IENSRegistryWithFallback {
    event ApprovalForAll(
        address indexed _owner, address indexed operator, bool approved
    );
    event NewOwner(bytes32 indexed node, bytes32 indexed label, address _owner);
    event NewResolver(bytes32 indexed node, address _resolver);
    event NewTTL(bytes32 indexed node, uint64 _ttl);
    event Transfer(bytes32 indexed node, address _owner);

    function isApprovedForAll(address _owner, address operator)
        external
        view
        returns (bool);
    function old() external view returns (address);
    function owner(bytes32 node) external view returns (address);
    function recordExists(bytes32 node) external view returns (bool);
    function resolver(bytes32 node) external view returns (address);
    function setApprovalForAll(address operator, bool approved) external;
    function setOwner(bytes32 node, address _owner) external;
    function setRecord(
        bytes32 node,
        address _owner,
        address _resolver,
        uint64 _ttl
    )
        external;
    function setResolver(bytes32 node, address _resolver) external;
    function setSubnodeOwner(bytes32 node, bytes32 label, address _owner)
        external
        returns (bytes32);
    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address _owner,
        address _resolver,
        uint64 _ttl
    )
        external;
    function setTTL(bytes32 node, uint64 _ttl) external;
    function ttl(bytes32 node) external view returns (uint64);
}
