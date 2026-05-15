import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest, serverError } from "@/lib/api-helpers";

/** GET /api/company/funds */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "COMPANY") return unauthorized();

  try {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: user.userId },
      include: {
        allocations: {
          include: {
            project: {
              include: {
                ngo: { include: { user: true } },
                milestones: { include: { fundRelease: true } },
              },
            },
          },
          orderBy: { allocatedAt: "desc" },
        },
      },
    });
    if (!company) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const totalBudget = company.totalBudget;
    const totalAllocated = company.allocations.reduce((s, a) => s + a.amount, 0);

    // Escrow cards
    const escrows = company.allocations
      .filter((a) => a.status === "ACTIVE" || a.status === "RELEASED")
      .map((a) => {
        const released = a.project.milestones
          .filter((m) => m.fundRelease)
          .reduce((s, m) => s + m.amount, 0);
        return {
          id: a.id,
          project: a.project.title,
          ngo: a.project.ngo.user.name,
          locked: a.amount,
          released,
          tx: a.escrowTxHash,
          status: a.status === "RELEASED" ? "Completed" : "Active",
        };
      });

    // All on-chain transactions: escrow locks + milestone releases
    const allMilestoneIds = company.allocations.flatMap((a) =>
      a.project.milestones.map((m) => m.id),
    );
    const fundReleases = await prisma.fundRelease.findMany({
      where: { milestoneId: { in: allMilestoneIds } },
      include: { milestone: { include: { project: true } } },
      orderBy: { releasedAt: "desc" },
    });

    const transactions = [
      // Escrow locks
      ...company.allocations.map((a) => ({
        hash: a.escrowTxHash || "—",
        type: "Escrow Lock",
        project: a.project.title,
        amount: -a.amount,
        amountLabel: `−₹${(a.amount / 100000).toFixed(2)}L`,
        time: a.allocatedAt.toISOString().split("T")[0],
        status: "Confirmed",
      })),
      // Milestone releases
      ...fundReleases.map((r) => ({
        hash: r.releaseTxHash,
        type: "Milestone Release",
        project: r.milestone.project.title,
        amount: r.milestone.amount,
        amountLabel: `+₹${(r.milestone.amount / 100000).toFixed(2)}L`,
        time: r.releasedAt.toISOString().split("T")[0],
        status: "Confirmed",
      })),
    ].sort((a, b) => (a.time > b.time ? -1 : 1));

    const totalDisbursed = fundReleases.reduce((s, r) => s + r.milestone.amount, 0);
    const inEscrow = totalAllocated - totalDisbursed;
    const available = totalBudget - totalAllocated;

    // Budget allocation pie
    const allocationPie = [
      { name: "Disbursed", value: Math.round(totalDisbursed / 100000), color: "#06b6d4" },
      { name: "In Escrow", value: Math.round(inEscrow / 100000), color: "#0ea5e9" },
      { name: "Available", value: Math.round(available / 100000), color: "#e2e8f0" },
    ].filter((e) => e.value > 0);

    // List of active projects for the "Allocate Funds" form
    const activeProjects = await prisma.project.findMany({
      where: { status: "ACTIVE" },
      include: { ngo: { include: { user: true } } },
    });

    return NextResponse.json({
      budget: { totalBudget, totalAllocated, totalDisbursed, inEscrow, available },
      escrows,
      transactions,
      allocationPie,
      activeProjects: activeProjects.map((p) => ({
        id: p.id,
        title: p.title,
        ngo: p.ngo.user.name,
      })),
    });
  } catch (e) {
    return serverError(e);
  }
}

/** POST /api/company/funds — allocate funds to an active project */
export async function POST(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "COMPANY") return unauthorized();

  try {
    const { projectId, amount } = await req.json();
    if (!projectId || !amount) return badRequest("projectId and amount are required");

    const company = await prisma.companyProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!company) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.status !== "ACTIVE") return badRequest("Project is not active");

    const escrowTxHash =
      "0x" +
      Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const allocation = await prisma.cSRAllocation.create({
      data: {
        companyId: company.id,
        projectId,
        amount: Number(amount),
        escrowTxHash,
        status: "ACTIVE",
      },
    });

    // Update project escrow balance
    await prisma.project.update({
      where: { id: projectId },
      data: { escrowBalance: { increment: Number(amount) } },
    });

    return NextResponse.json({ allocation, escrowTxHash }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
