// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VolunteerAttendance {
    address public owner;

    struct AttendanceRecord {
        string volunteerId;
        string projectId;
        uint256 checkInTime;
        uint256 checkOutTime;
        uint256 hoursLogged;
        bool recorded;
    }

    mapping(string => AttendanceRecord) public records; // attendanceId => record

    event AttendanceRecorded(
        string attendanceId,
        string volunteerId,
        string projectId,
        uint256 checkInTime,
        uint256 checkOutTime,
        uint256 hoursLogged
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function recordAttendance(
        string calldata attendanceId,
        string calldata volunteerId,
        string calldata projectId,
        uint256 checkInTime,
        uint256 checkOutTime,
        uint256 hoursLogged
    ) external onlyOwner {
        require(!records[attendanceId].recorded, "Already recorded");

        records[attendanceId] = AttendanceRecord({
            volunteerId: volunteerId,
            projectId: projectId,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            hoursLogged: hoursLogged,
            recorded: true
        });

        emit AttendanceRecorded(attendanceId, volunteerId, projectId, checkInTime, checkOutTime, hoursLogged);
    }

    function getRecord(string calldata attendanceId)
        external
        view
        returns (
            string memory volunteerId,
            string memory projectId,
            uint256 checkInTime,
            uint256 checkOutTime,
            uint256 hoursLogged,
            bool recorded
        )
    {
        AttendanceRecord storage r = records[attendanceId];
        return (r.volunteerId, r.projectId, r.checkInTime, r.checkOutTime, r.hoursLogged, r.recorded);
    }
}
