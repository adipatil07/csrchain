import { ethers } from "ethers";

const ESCROW_ABI = [
  "function lockFunds(string calldata projectId, address company) external payable",
  "function releaseFunds(string calldata projectId, string calldata milestoneId, address payable recipient, uint256 amount) external",
  "function getEscrow(string calldata projectId) external view returns (address company, uint256 totalAmount, uint256 releasedAmount, bool active)",
  "event FundsLocked(string projectId, address company, uint256 amount)",
  "event FundsReleased(string projectId, uint256 amount, string milestoneId)",
];

const ATTENDANCE_ABI = [
  "function recordAttendance(string calldata attendanceId, string calldata volunteerId, string calldata projectId, uint256 checkInTime, uint256 checkOutTime, uint256 hoursLogged) external",
  "function getRecord(string calldata attendanceId) external view returns (string volunteerId, string projectId, uint256 checkInTime, uint256 checkOutTime, uint256 hoursLogged, bool recorded)",
  "event AttendanceRecorded(string attendanceId, string volunteerId, string projectId, uint256 checkInTime, uint256 checkOutTime, uint256 hoursLogged)",
];

const CERTIFICATE_ABI = [
  "function issueCertificate(string calldata volunteerId, string calldata projectId, string calldata ipfsHash) external returns (uint256 tokenId)",
  "function getCertificate(uint256 tokenId) external view returns (string volunteerId, string projectId, string ipfsHash, uint256 issuedAt)",
  "function getVolunteerCertificates(string calldata volunteerId) external view returns (uint256[] memory)",
  "event CertificateIssued(uint256 indexed tokenId, string volunteerId, string projectId, string ipfsHash, uint256 issuedAt)",
];

function getWallet() {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL!);
  return new ethers.Wallet(process.env.BACKEND_WALLET_PRIVATE_KEY!, provider);
}

function getEscrowContract() {
  return new ethers.Contract(process.env.ESCROW_CONTRACT_ADDRESS!, ESCROW_ABI, getWallet());
}

function getAttendanceContract() {
  return new ethers.Contract(process.env.ATTENDANCE_CONTRACT_ADDRESS!, ATTENDANCE_ABI, getWallet());
}

function getCertificateContract() {
  return new ethers.Contract(process.env.CERTIFICATE_CONTRACT_ADDRESS!, CERTIFICATE_ABI, getWallet());
}

export async function lockFundsOnChain(
  projectId: string,
  companyAddress: string,
  amountInEth: number
): Promise<string> {
  const contract = getEscrowContract();
  const tx = await contract.lockFunds(projectId, companyAddress, {
    value: ethers.parseEther(amountInEth.toString()),
  });
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function releaseFundsOnChain(
  projectId: string,
  milestoneId: string,
  recipientAddress: string,
  amountInEth: number
): Promise<string> {
  const contract = getEscrowContract();
  const tx = await contract.releaseFunds(
    projectId,
    milestoneId,
    recipientAddress,
    ethers.parseEther(amountInEth.toString())
  );
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function recordAttendanceOnChain(
  attendanceId: string,
  volunteerId: string,
  projectId: string,
  checkInTime: Date,
  checkOutTime: Date,
  hoursLogged: number
): Promise<string> {
  const contract = getAttendanceContract();
  const tx = await contract.recordAttendance(
    attendanceId,
    volunteerId,
    projectId,
    Math.floor(checkInTime.getTime() / 1000),
    Math.floor(checkOutTime.getTime() / 1000),
    Math.round(hoursLogged)
  );
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function issueCertificateOnChain(
  volunteerId: string,
  projectId: string,
  ipfsHash: string
): Promise<{ txHash: string; tokenId: string }> {
  const contract = getCertificateContract();
  const tx = await contract.issueCertificate(volunteerId, projectId, ipfsHash);
  const receipt = await tx.wait();
  return { txHash: receipt.hash, tokenId: receipt.hash };
}
