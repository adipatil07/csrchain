import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

/** GET /api/ngo/reports — full impact analytics for NGO */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const ngo = await prisma.nGOProfile.findUnique({
      where: { userId: user.userId },
      include: { user: true },
    });
    if (!ngo) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const [projects, milestones, allocations, volunteers, fundReleases] = await Promise.all([
      prisma.project.findMany({
        where: { ngoId: ngo.id },
        include: { milestones: true, allocations: true },
      }),
      prisma.milestone.findMany({ where: { project: { ngoId: ngo.id } } }),
      prisma.cSRAllocation.findMany({ where: { project: { ngoId: ngo.id } } }),
      prisma.volunteerApplication.findMany({
        where: { project: { ngoId: ngo.id }, status: "ACCEPTED" },
        include: { volunteer: { include: { user: true } } },
      }),
      prisma.fundRelease.findMany({
        where: { milestone: { project: { ngoId: ngo.id } } },
        include: { milestone: true },
        orderBy: { releasedAt: "asc" },
      }),
    ]);

    // ── KPI Summary ──────────────────────────────────────────────────────────
    const totalFunds = allocations.reduce((s, a) => s + a.amount, 0);
    const totalDisbursed = fundReleases.reduce((s, r) => s + r.milestone.amount, 0);
    const totalBeneficiaries = projects.reduce((s, p) => s + p.beneficiaries, 0);
    const completedMilestones = milestones.filter((m) => m.status === "APPROVED").length;
    const totalMilestones = milestones.length;
    const milestoneSuccessRate =
      totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
    const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;
    const volunteerCount = new Set(volunteers.map((v) => v.volunteerId)).size;

    // ── Sector Breakdown ─────────────────────────────────────────────────────
    const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
    const sectorMap: Record<string, { funds: number; projects: number }> = {};
    projects.forEach((p) => {
      if (!sectorMap[p.sector]) sectorMap[p.sector] = { funds: 0, projects: 0 };
      sectorMap[p.sector].funds += p.allocations.reduce((s, a) => s + a.amount, 0);
      sectorMap[p.sector].projects += 1;
    });
    const sectorData = Object.entries(sectorMap).map(([name, v], i) => ({
      name,
      funds: Math.round(v.funds / 100000),
      projects: v.projects,
      color: COLORS[i % COLORS.length],
    }));

    // ── Monthly Fund Flow (last 6 months) ────────────────────────────────────
    const now = new Date();
    const monthlyFlow = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const label = d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
      const received = allocations
        .filter((a) => {
          const ad = new Date(a.allocatedAt);
          return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth();
        })
        .reduce((s, a) => s + a.amount, 0);
      const released = fundReleases
        .filter((r) => {
          const rd = new Date(r.releasedAt);
          return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth();
        })
        .reduce((s, r) => s + r.milestone.amount, 0);
      return { month: label, received: Math.round(received / 100000), released: Math.round(released / 100000) };
    });

    // ── Milestone Status Breakdown ────────────────────────────────────────────
    const milestoneStatus = [
      { name: "Approved", value: milestones.filter((m) => m.status === "APPROVED").length, color: "#10b981" },
      { name: "Pending", value: milestones.filter((m) => m.status === "PENDING").length, color: "#f59e0b" },
      { name: "Submitted", value: milestones.filter((m) => m.status === "SUBMITTED").length, color: "#3b82f6" },
      { name: "Rejected", value: milestones.filter((m) => m.status === "REJECTED").length, color: "#ef4444" },
    ].filter((s) => s.value > 0);

    // ── Project Progress Bars ─────────────────────────────────────────────────
    const projectProgress = projects
      .filter((p) => ["ACTIVE", "COMPLETED"].includes(p.status))
      .map((p) => ({
        id: p.id,
        name: p.title.length > 30 ? p.title.slice(0, 30) + "…" : p.title,
        sector: p.sector,
        progress: p.progress,
        budget: p.budget,
        disbursed: p.milestones
          .filter((m) => m.status === "APPROVED")
          .reduce((s, m) => s + m.amount, 0),
        beneficiaries: p.beneficiaries,
        status: p.status,
      }));

    // ── Volunteer Engagement ──────────────────────────────────────────────────
    const volunteerHours = volunteers.reduce((s, v) => s + (v.volunteer?.totalHours ?? 0), 0);

    // ── Cumulative beneficiaries trend ───────────────────────────────────────
    // Cumulative count of beneficiaries from ACTIVE/COMPLETED projects created up to each month
    const benefTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - 5 + i + 1, 1);
      const label = d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
      const cumulative = projects
        .filter(
          (p) =>
            p.createdAt < endOfMonth &&
            ["ACTIVE", "COMPLETED"].includes(p.status),
        )
        .reduce((s, p) => s + p.beneficiaries, 0);
      return { month: label, beneficiaries: cumulative };
    });

    // ── Report Stubs ─────────────────────────────────────────────────────────
    const year = now.getFullYear();
    const reports = [
      { name: `Annual CSR Impact Report ${year}`, type: "PDF", size: "2.4 MB", generated: true },
      { name: `Fund Utilization Statement Q${Math.ceil((now.getMonth() + 1) / 3)} ${year}`, type: "PDF", size: "1.1 MB", generated: true },
      { name: `Milestone Verification Log ${year}`, type: "XLSX", size: "840 KB", generated: true },
      { name: `Beneficiary Reach Report ${year}`, type: "PDF", size: "1.8 MB", generated: totalBeneficiaries > 0 },
      { name: `Volunteer Hours Summary ${year}`, type: "XLSX", size: "560 KB", generated: volunteerCount > 0 },
      { name: `Section 135 Compliance Certificate ${year}`, type: "PDF", size: "320 KB", generated: totalFunds > 0 },
    ];

    return NextResponse.json({
      kpi: {
        totalFunds,
        totalFundsFormatted:
          totalFunds >= 10000000
            ? `₹${(totalFunds / 10000000).toFixed(2)} Cr`
            : `₹${(totalFunds / 100000).toFixed(2)} L`,
        totalDisbursed,
        totalDisbursedFormatted:
          totalDisbursed >= 10000000
            ? `₹${(totalDisbursed / 10000000).toFixed(2)} Cr`
            : `₹${(totalDisbursed / 100000).toFixed(2)} L`,
        totalBeneficiaries,
        milestoneSuccessRate,
        activeProjects,
        completedProjects,
        volunteerCount,
        volunteerHours: Math.round(volunteerHours),
        totalProjects: projects.length,
      },
      sectorData,
      monthlyFlow,
      milestoneStatus,
      projectProgress,
      benefTrend,
      reports,
      ngoName: ngo.organization,
      generatedAt: now.toISOString(),
    });
  } catch (e) {
    return serverError(e);
  }
}
