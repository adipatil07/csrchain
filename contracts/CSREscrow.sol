// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CSREscrow {
    address public owner;

    struct Escrow {
        address company;
        uint256 totalAmount;
        uint256 releasedAmount;
        bool active;
    }

    mapping(string => Escrow) public escrows; // projectId => Escrow

    event FundsLocked(string projectId, address company, uint256 amount);
    event FundsReleased(string projectId, uint256 amount, string milestoneId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function lockFunds(string calldata projectId, address company) external payable onlyOwner {
        require(msg.value > 0, "Must send ETH");
        require(!escrows[projectId].active, "Escrow already exists");

        escrows[projectId] = Escrow({
            company: company,
            totalAmount: msg.value,
            releasedAmount: 0,
            active: true
        });

        emit FundsLocked(projectId, company, msg.value);
    }

    function releaseFunds(
        string calldata projectId,
        string calldata milestoneId,
        address payable recipient,
        uint256 amount
    ) external onlyOwner {
        Escrow storage e = escrows[projectId];
        require(e.active, "No active escrow");
        require(e.releasedAmount + amount <= e.totalAmount, "Exceeds escrow balance");

        e.releasedAmount += amount;
        recipient.transfer(amount);

        emit FundsReleased(projectId, amount, milestoneId);
    }

    function getEscrow(string calldata projectId)
        external
        view
        returns (address company, uint256 totalAmount, uint256 releasedAmount, bool active)
    {
        Escrow storage e = escrows[projectId];
        return (e.company, e.totalAmount, e.releasedAmount, e.active);
    }
}
