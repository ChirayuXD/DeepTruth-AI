// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ContentAuthenticity {
    struct Verification {
        string ipfsHash;
        uint256 authenticityScore; 
        bool isAuthentic;
        address verifier;
        uint256 timestamp;
    }

    mapping(bytes32 => Verification) public verifications;

    event ContentVerified(
        bytes32 indexed contentHash,
        string ipfsHash,
        uint256 authenticityScore,
        bool isAuthentic,
        address verifier,
        uint256 timestamp
    );

    function registerContent(
        bytes32 contentHash,
        string memory ipfsHash,
        uint256 authenticityScore,
        bool isAuthentic
    ) public {
        verifications[contentHash] = Verification(
            ipfsHash,
            authenticityScore,
            isAuthentic,
            msg.sender,
            block.timestamp
        );

        emit ContentVerified(
            contentHash,
            ipfsHash,
            authenticityScore,
            isAuthentic,
            msg.sender,
            block.timestamp
        );
    }

    function verifyContent(bytes32 contentHash)
        public
        view
        returns (
            string memory,
            uint256,
            bool,
            address,
            uint256
        )
    {
        Verification memory v = verifications[contentHash];
        return (
            v.ipfsHash,
            v.authenticityScore,
            v.isAuthentic,
            v.verifier,
            v.timestamp
        );
    }
}
