import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

/** GET /api/company/projects — proposals queue + company's allocated projects */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "COMPANY") return unauthorized();

  try {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!company) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    // All NGO proposals pending review (UNDER_REVIEW from any NGO)
    const pendingProposals = await prisma.project.findMany({
      where: { status: "UNDER_REVIEW" },
      include: {
        ngo: { include: { user: true } },
        milestones: { orderBy: { deadline: "asc" } },
        allocations: { where: { companyId: company.id } },
      },
      orderBy: { submittedAt: "desc" },
    });

    // All projects this company has allocated funds to
    const myAllocations = await prisma.cSRAllocation.findMany({
      where: { companyId: company.id },
      include: {
        project: {
          include: {
            ngo: { include: { user: true } },
            milestones: { orderBy: { deadline: "asc" } },
          },
        },
      },
      orderBy: { allocatedAt: "desc" },
    });

    const shapeProject = (
      p: typeof pendingProposals[0],
      status: string,
      escrowTx: string | null,
      hasAlloc: boolean,
    ) => ({
      id: p.id,
      proposalRef: p.proposalRef,
      ngo: p.ngo.user.name,
      project: p.title,
      budget: p.budget,
      sector: p.sector,
      location: p.location,
      beneficiaries: p.beneficiaries,
      description: p.description,
      submitted: p.submittedAt?.toISOString().split("T")[0] ?? p.createdAt.toISOString().split("T")[0],
      status,
      escrowTx,
      milestones: p.milestones.map((m) => ({
        title: m.title,
        amount: m.amount,
        deadline: m.deadline.toISOString().split("T")[0],
      })),
      hasMyAllocation: hasAlloc,
    });

    const proposals = pendingProposals.map((p) => {
      const alloc = p.allocations[0];
      return shapeProject(p, "Pending", alloc?.escrowTxHash ?? null, !!alloc);
    });

    const allocated = myAllocations.map((a) => {
      const p = a.project;
      const status =
        p.status === "ACTIVE" ? "Approved" :
        p.status === "COMPLETED" ? "Approved" :
        p.status === "REJECTED" ? "Rejected" : "Pending";
      return {
        id: p.id,
        proposalRef: p.proposalRef,
        ngo: p.ngo.user.name,
        project: p.title,
        budget: p.budget,
        sector: p.sector,
        location: p.location,
        beneficiaries: p.beneficiaries,
        description: p.description,
        submitted: a.allocatedAt.toISOString().split("T")[0],
        status,
        escrowTx: a.escrowTxHash,
        milestones: p.milestones.map((m) => ({
          title: m.title,
          amount: m.amount,
          deadline: m.deadline.toISOString().split("T")[0],
        })),
        hasMyAllocation: true,
      };
    });

    // Merge: proposals first, then already-approved but not in pending
    const allProjectIds = new Set(proposals.map((p) => p.id));
    const extra = allocated.filter((a) => !allProjectIds.has(a.id));
    const all = [...proposals, ...extra];

    const counts = {
      total: all.length,
      pending: all.filter((p) => p.status === "Pending").length,
      approved: all.filter((p) => p.status === "Approved").length,
      rejected: all.filter((p) => p.status === "Rejected").length,
    };

    return NextResponse.json({ proposals: all, counts });
  } catch (e) {
    return serverError(e);
  }
}
