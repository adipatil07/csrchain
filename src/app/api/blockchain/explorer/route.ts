import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL!);

    // Fetch network info from the blockchain node
    const [network, blockNumber] = await Promise.all([
      provider.getNetwork(),
      provider.getBlockNumber(),
    ]);

    const latestBlock = await provider.getBlock(blockNumber);

    // Pull all real transaction hashes stored in DB
    const [allocations, milestones, attendances, certificates, fundReleases] = await Promise.all([
      prisma.cSRAllocation.findMany({
        where: { escrowTxHash: { not: "" } },
        include: { project: true, company: true },
        orderBy: { allocatedAt: "desc" },
      }),
      prisma.milestone.findMany({
        where: { approvalTx: { not: null } },
        include: { project: true },
        orderBy: { submittedAt: "desc" },
      }),
      prisma.attendance.findMany({
        where: { blockchainTx: { not: null } },
        include: { project: true, volunteer: { include: { user: true } } },
        orderBy: { checkOutTime: "desc" },
        take: 10,
      }),
      prisma.certificate.findMany({
        where: { blockchainTx: { not: "" } },
        include: { volunteer: { include: { user: true } } },
        orderBy: { issuedAt: "desc" },
        take: 10,
      }),
      prisma.fundRelease.findMany({
        include: { milestone: { include: { project: true } } },
        orderBy: { releasedAt: "desc" },
        take: 10,
      }),
    ]);

    // Build unified transaction list
    const transactions = [
      ...allocations.map((a) => ({
        hash: a.escrowTxHash,
        type: "Escrow Lock",
        typeColor: "#0ea5e9",
        description: `Funds locked for "${a.project.title}"`,
        actor: a.company.companyName,
        amount: `₹${(a.amount / 100000).toFixed(2)}L`,
        timestamp: a.allocatedAt.toISOString(),
        contract: process.env.ESCROW_CONTRACT_ADDRESS ?? "",
      })),
      ...milestones.filter((m) => m.approvalTx).map((m) => ({
        hash: m.approvalTx!,
        type: "Fund Release",
        typeColor: "#10b981",
        description: `Milestone "${m.title}" approved — funds released`,
        actor: "CSR Company",
        amount: `₹${(m.amount / 100000).toFixed(2)}L`,
        timestamp: (m.submittedAt ?? m.createdAt).toISOString(),
        contract: process.env.ESCROW_CONTRACT_ADDRESS ?? "",
      })),
      ...fundReleases.map((r) => ({
        hash: r.releaseTxHash,
        type: "Fund Release",
        typeColor: "#10b981",
        description: `Escrow released for "${r.milestone.project.title}"`,
        actor: "CSR Company",
        amount: `₹${(r.milestone.amount / 100000).toFixed(2)}L`,
        timestamp: r.releasedAt.toISOString(),
        contract: process.env.ESCROW_CONTRACT_ADDRESS ?? "",
      })),
      ...attendances.filter((a) => a.blockchainTx).map((a) => ({
        hash: a.blockchainTx!,
        type: "Attendance",
        typeColor: "#f59e0b",
        description: `Volunteer check-out recorded for "${a.project.title}"`,
        actor: a.volunteer.user.name,
        amount: `${a.hours}h`,
        timestamp: (a.checkOutTime ?? a.checkInTime).toISOString(),
        contract: process.env.ATTENDANCE_CONTRACT_ADDRESS ?? "",
      })),
      ...certificates.filter((c) => c.blockchainTx).map((c) => ({
        hash: c.blockchainTx,
        type: "NFT Certificate",
        typeColor: "#8b5cf6",
        description: `Certificate minted: "${c.title}"`,
        actor: c.volunteer.user.name,
        amount: `${c.hours}h`,
        timestamp: c.issuedAt.toISOString(),
        contract: process.env.CERTIFICATE_CONTRACT_ADDRESS ?? "",
      })),
    ]
      .filter((t) => t.hash && t.hash.startsWith("0x"))
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
      .slice(0, 20);

    return NextResponse.json({
      network: {
        name: "CSRChain Local (Hardhat)",
        chainId: Number(network.chainId),
        rpcUrl: process.env.POLYGON_RPC_URL,
        blockNumber,
        blockTimestamp: latestBlock?.timestamp
          ? new Date(latestBlock.timestamp * 1000).toISOString()
          : null,
      },
      contracts: {
        escrow: process.env.ESCROW_CONTRACT_ADDRESS ?? "",
        attendance: process.env.ATTENDANCE_CONTRACT_ADDRESS ?? "",
        certificate: process.env.CERTIFICATE_CONTRACT_ADDRESS ?? "",
      },
      stats: {
        totalTx: transactions.length,
        escrowLocks: allocations.length,
        fundReleases: fundReleases.length,
        attendanceTx: attendances.filter((a) => a.blockchainTx).length,
        certificatesMinted: certificates.filter((c) => c.blockchainTx).length,
      },
      transactions,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Blockchain node not reachable. Start Hardhat node first." }, { status: 503 });
  }
}
