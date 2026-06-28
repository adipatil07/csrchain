import { network } from "hardhat";

const { ethers } = await network.connect();

const [deployer] = await ethers.getSigners();
console.log("Deploying contracts with:", deployer.address);

const CSREscrow = await ethers.getContractFactory("CSREscrow");
const escrow = await CSREscrow.deploy();
await escrow.waitForDeployment();
console.log("CSREscrow deployed to:", await escrow.getAddress());

const VolunteerAttendance = await ethers.getContractFactory("VolunteerAttendance");
const attendance = await VolunteerAttendance.deploy();
await attendance.waitForDeployment();
console.log("VolunteerAttendance deployed to:", await attendance.getAddress());

const VolunteerCertificate = await ethers.getContractFactory("VolunteerCertificate");
const certificate = await VolunteerCertificate.deploy();
await certificate.waitForDeployment();
console.log("VolunteerCertificate deployed to:", await certificate.getAddress());

console.log("\nAdd these to your .env.local:");
console.log(`ESCROW_CONTRACT_ADDRESS=${await escrow.getAddress()}`);
console.log(`ATTENDANCE_CONTRACT_ADDRESS=${await attendance.getAddress()}`);
console.log(`CERTIFICATE_CONTRACT_ADDRESS=${await certificate.getAddress()}`);
