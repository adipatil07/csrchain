// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VolunteerCertificate {
    address public owner;
    uint256 private _tokenIdCounter;

    struct Certificate {
        uint256 tokenId;
        string volunteerId;
        string projectId;
        string ipfsHash;    // IPFS CID for certificate metadata
        uint256 issuedAt;
        bool exists;
    }

    mapping(uint256 => Certificate) public certificates;            // tokenId => Certificate
    mapping(string => uint256[]) public volunteerCertificates;     // volunteerId => tokenIds

    event CertificateIssued(
        uint256 indexed tokenId,
        string volunteerId,
        string projectId,
        string ipfsHash,
        uint256 issuedAt
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        _tokenIdCounter = 1;
    }

    function issueCertificate(
        string calldata volunteerId,
        string calldata projectId,
        string calldata ipfsHash
    ) external onlyOwner returns (uint256 tokenId) {
        tokenId = _tokenIdCounter++;

        certificates[tokenId] = Certificate({
            tokenId: tokenId,
            volunteerId: volunteerId,
            projectId: projectId,
            ipfsHash: ipfsHash,
            issuedAt: block.timestamp,
            exists: true
        });

        volunteerCertificates[volunteerId].push(tokenId);

        emit CertificateIssued(tokenId, volunteerId, projectId, ipfsHash, block.timestamp);

        return tokenId;
    }

    function getCertificate(uint256 tokenId)
        external
        view
        returns (
            string memory volunteerId,
            string memory projectId,
            string memory ipfsHash,
            uint256 issuedAt
        )
    {
        require(certificates[tokenId].exists, "Certificate does not exist");
        Certificate storage c = certificates[tokenId];
        return (c.volunteerId, c.projectId, c.ipfsHash, c.issuedAt);
    }

    function getVolunteerCertificates(string calldata volunteerId)
        external
        view
        returns (uint256[] memory)
    {
        return volunteerCertificates[volunteerId];
    }
}
