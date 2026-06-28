import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, badRequest, serverError } from "@/lib/api-helpers";
import { releaseFundsOnChain } from "@/lib/blockchain";

// PUT /api/company/milestones/[id]/approve — company approves submitted milestone and releases funds
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(req);
  if (!user || user.role !== "COMPANY") return unauthorized();

  try {
    const { id } = await params;

    const company = await prisma.companyProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!company) return notFound("Company profile not found");

    const milestone = await prisma.milestone.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            ngo: true,
            milestones: true,
            allocations: { where: { companyId: company.id } },
          },
        },
        fundRelease: true,
      },
    });

    if (!milestone) return notFound("Milestone not found");
    if (milestone.status !== "SUBMITTED") return badRequest("Milestone must be SUBMITTED to approve");
    if (milestone.fundRelease) return badRequest("Funds already released for this milestone");
    if (milestone.project.allocations.length === 0) return badRequest("No allocation found for this company");
    if (milestone.project.escrowBalance < milestone.amount) return badRequest("Insufficient escrow balance");

    // Release funds on-chain — use NGO wallet address or deployer as fallback
    const recipient = milestone.project.ngo.walletAddress || process.env.BACKEND_WALLET_ADDRESS || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const amountInEth = 0.0001; // symbolic ETH for demo; real amount tracked in DB

    const releaseTxHash = await releaseFundsOnChain(
      milestone.projectId,
      id,
      recipient,
      amountInEth
    );

    // Update milestone and create FundRelease atomically
    await prisma.$transaction([
      prisma.milestone.update({
        where: { id },
        data: { status: "APPROVED", approvalTx: releaseTxHash },
      }),
      prisma.fundRelease.create({
        data: { milestoneId: id, releaseTxHash },
      }),
      prisma.project.update({
        where: { id: milestone.projectId },
        data: {
          escrowBalance: { decrement: milestone.amount },
          progress: computeProgress(milestone.project.milestones, id),
        },
      }),
    ]);

    return NextResponse.json({ releaseTxHash, milestoneId: id, status: "APPROVED" });
  } catch (e) {
    return serverError(e);
  }
}

function computeProgress(
  milestones: { id: string; status: string }[],
  justApprovedId: string
): number {
  const total = milestones.length;
  if (total === 0) return 0;
  const approved = milestones.filter(
    (m) => m.status === "APPROVED" || m.id === justApprovedId
  ).length;
  return Math.round((approved / total) * 100);
}
