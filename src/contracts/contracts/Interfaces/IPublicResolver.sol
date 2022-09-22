// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

interface IPublicResolver {
    event ABIChanged(bytes32 indexed node, uint256 indexed contentType);
    event AddrChanged(bytes32 indexed node, address a);
    event AddressChanged(
        bytes32 indexed node, uint256 coinType, bytes newAddress
    );
    event AuthorisationChanged(
        bytes32 indexed node,
        address indexed owner,
        address indexed target,
        bool isAuthorised
    );
    event ContenthashChanged(bytes32 indexed node, bytes hash);
    event DNSRecordChanged(
        bytes32 indexed node, bytes _name, uint16 resource, bytes record
    );
    event DNSRecordDeleted(bytes32 indexed node, bytes _name, uint16 resource);
    event DNSZoneCleared(bytes32 indexed node);
    event InterfaceChanged(
        bytes32 indexed node, bytes4 indexed interfaceID, address implementer
    );
    event NameChanged(bytes32 indexed node, string _name);
    event PubkeyChanged(bytes32 indexed node, bytes32 x, bytes32 y);
    event TextChanged(
        bytes32 indexed node, string indexed indexedKey, string key
    );

    function ABI(bytes32 node, uint256 contentTypes)
        external
        view
        returns (uint256, bytes memory);
    function addr(bytes32 node) external view returns (address);
    function addr(bytes32 node, uint256 coinType)
        external
        view
        returns (bytes memory);
    function authorisations(bytes32, address, address)
        external
        view
        returns (bool);
    function clearDNSZone(bytes32 node) external;
    function contenthash(bytes32 node) external view returns (bytes memory);
    function dnsRecord(bytes32 node, bytes32 _name, uint16 resource)
        external
        view
        returns (bytes memory);
    function hasDNSRecords(bytes32 node, bytes32 _name)
        external
        view
        returns (bool);
    function interfaceImplementer(bytes32 node, bytes4 interfaceID)
        external
        view
        returns (address);
    function multicall(bytes[] memory data)
        external
        returns (bytes[] memory results);
    function name(bytes32 node) external view returns (string memory);
    function pubkey(bytes32 node)
        external
        view
        returns (bytes32 x, bytes32 y);
    function setABI(bytes32 node, uint256 contentType, bytes memory data)
        external;
    function setAddr(bytes32 node, uint256 coinType, bytes memory a) external;
    function setAddr(bytes32 node, address a) external;
    function setAuthorisation(bytes32 node, address target, bool isAuthorised)
        external;
    function setContenthash(bytes32 node, bytes memory hash) external;
    function setDNSRecords(bytes32 node, bytes memory data) external;
    function setInterface(bytes32 node, bytes4 interfaceID, address implementer)
        external;
    function setName(bytes32 node, string memory _name) external;
    function setPubkey(bytes32 node, bytes32 x, bytes32 y) external;
    function setText(bytes32 node, string memory key, string memory value)
        external;
    function supportsInterface(bytes4 interfaceID)
        external
        pure
        returns (bool);
    function text(bytes32 node, string memory key)
        external
        view
        returns (string memory);
}
