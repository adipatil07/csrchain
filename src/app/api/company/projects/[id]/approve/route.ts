import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError } from "@/lib/api-helpers";
import { lockFundsOnChain } from "@/lib/blockchain";

/** PUT /api/company/projects/[id]/approve  — approve proposal & create escrow allocation */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = getAuthUser(req);
  if (!user || user.role !== "COMPANY") return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { amount } = body; // optional override; falls back to project.budget

    const company = await prisma.companyProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!company) return notFound("Company profile not found");

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return notFound("Project not found");

    const escrowTxHash = await lockFundsOnChain(id, company.id, 0.001);

    const allocationAmount = amount ?? project.budget;

    // Upsert CSRAllocation
    const existing = await prisma.cSRAllocation.findFirst({
      where: { companyId: company.id, projectId: id },
    });
    let allocation;
    if (existing) {
      allocation = await prisma.cSRAllocation.update({
        where: { id: existing.id },
        data: { status: "ACTIVE", escrowTxHash, amount: allocationAmount },
      });
    } else {
      allocation = await prisma.cSRAllocation.create({
        data: {
          companyId: company.id,
          projectId: id,
          amount: allocationAmount,
          escrowTxHash,
          status: "ACTIVE",
        },
      });
    }

    // Activate the project
    await prisma.project.update({
      where: { id },
      data: {
        status: "ACTIVE",
        escrowTxHash,
        escrowBalance: allocationAmount,
      },
    });

    return NextResponse.json({ allocation, escrowTxHash });
  } catch (e) {
    return serverError(e);
  }
}
