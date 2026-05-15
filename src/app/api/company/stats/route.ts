import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

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
                milestones: true,
                _count: { select: { milestones: true } },
              },
            },
          },
          orderBy: { allocatedAt: "desc" },
        },
      },
    });
    if (!company) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const allocations = company.allocations;
    const totalBudget = company.totalBudget;
    const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
    const activeProjects = allocations.filter((a) => a.status === "ACTIVE").length;

    // Disbursed = sum of all RELEASED milestone amounts in our projects
    const projectIds = allocations.map((a) => a.projectId);
    const releasedFunds = await prisma.fundRelease.findMany({
      where: { milestone: { projectId: { in: projectIds } } },
      include: { milestone: true },
    });
    const totalDisbursed = releasedFunds.reduce((s, r) => s + r.milestone.amount, 0);

    const utilization =
      totalAllocated > 0 ? Math.round((totalDisbursed / totalAllocated) * 100) : 0;

    // Pending milestones = SUBMITTED (awaiting company verification)
    const pendingMilestones = await prisma.milestone.count({
      where: { projectId: { in: projectIds }, status: "SUBMITTED" },
    });

    // Recent projects (last 4 allocations)
    const recentProjects = allocations.slice(0, 4).map((a) => ({
      id: a.id,
      projectId: a.projectId,
      name: a.project.title,
      ngo: a.project.ngo.user.name,
      amount: a.amount,
      status: a.status === "ACTIVE" ? "Active" : a.status === "RELEASED" ? "Completed" : "Review",
      progress: a.project.progress,
      tx: a.escrowTxHash || "—",
    }));

    // Fund flow last 6 months: group allocations + releases by month
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const flowMap: Record<string, { allocated: number; utilized: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      flowMap[monthNames[d.getMonth()]] = { allocated: 0, utilized: 0 };
    }
    allocations.forEach((a) => {
      const key = monthNames[a.allocatedAt.getMonth()];
      if (flowMap[key]) flowMap[key].allocated += a.amount / 100000; // in lakh
    });
    releasedFunds.forEach((r) => {
      const key = monthNames[r.releasedAt.getMonth()];
      if (flowMap[key]) flowMap[key].utilized += r.milestone.amount / 100000;
    });
    const fundFlowData = Object.entries(flowMap).map(([month, v]) => ({
      month,
      allocated: Math.round(v.allocated),
      utilized: Math.round(v.utilized),
    }));

    // Sector breakdown: sum allocation amounts per sector
    const sectorTotals: Record<string, number> = {};
    allocations.forEach((a) => {
      const sector = a.project.sector;
      sectorTotals[sector] = (sectorTotals[sector] ?? 0) + a.amount;
    });
    const sectorColors: Record<string, string> = {
      Education: "#2563eb", Healthcare: "#06b6d4", Environment: "#10b981",
      "Rural Dev": "#8b5cf6", Livelihood: "#f59e0b", Others: "#94a3b8",
    };
    const total = Object.values(sectorTotals).reduce((s, v) => s + v, 0) || 1;
    const sectorData = Object.entries(sectorTotals).map(([name, val]) => ({
      name,
      value: Math.round((val / total) * 100),
      color: sectorColors[name] ?? "#94a3b8",
    }));

    return NextResponse.json({
      companyName: company.companyName,
      stats: {
        totalBudget,
        totalAllocated,
        activeProjects,
        utilization,
        pendingMilestones,
        totalDisbursed,
      },
      recentProjects,
      fundFlowData,
      sectorData,
    });
  } catch (e) {
    return serverError(e);
  }
}
