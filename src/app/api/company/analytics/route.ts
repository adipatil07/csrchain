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
                milestones: { include: { fundRelease: true } },
                ngo: { include: { user: true } },
              },
            },
          },
        },
      },
    });
    if (!company) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const projects = company.allocations.map((a) => a.project);

    // Sector-wise spend (in lakhs)
    const sectorMap: Record<string, number> = {};
    company.allocations.forEach((a) => {
      const s = a.project.sector;
      sectorMap[s] = (sectorMap[s] ?? 0) + a.amount / 100000;
    });
    const sectorSpend = Object.entries(sectorMap).map(([sector, spend]) => ({
      sector,
      spend: Math.round(spend),
    }));

    // Geographical impact (beneficiaries by city/region extracted from location)
    const geoMap: Record<string, number> = {};
    projects.forEach((p) => {
      const region = p.location.split(",").pop()?.trim() ?? p.location;
      geoMap[region] = (geoMap[region] ?? 0) + p.beneficiaries;
    });
    const geoImpact = Object.entries(geoMap)
      .map(([state, beneficiaries]) => ({ state, beneficiaries }))
      .sort((a, b) => b.beneficiaries - a.beneficiaries)
      .slice(0, 6);

    // Milestone trend last 6 months
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const trendMap: Record<string, { completed: number; delayed: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trendMap[monthNames[d.getMonth()]] = { completed: 0, delayed: 0 };
    }
    projects.forEach((p) => {
      p.milestones.forEach((m) => {
        const key = monthNames[m.deadline.getMonth()];
        if (!trendMap[key]) return;
        if (m.status === "APPROVED") trendMap[key].completed++;
        else if (m.deadline < now && m.status === "PENDING") trendMap[key].delayed++;
      });
    });
    const milestoneTrend = Object.entries(trendMap).map(([month, v]) => ({
      month,
      completed: v.completed,
      delayed: v.delayed,
    }));

    // Beneficiaries cumulative trend (running sum by allocation month)
    const benefMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      benefMap[monthNames[d.getMonth()]] = 0;
    }
    company.allocations.forEach((a) => {
      const key = monthNames[a.allocatedAt.getMonth()];
      if (benefMap[key] !== undefined) benefMap[key] += a.project.beneficiaries;
    });
    let running = 0;
    const beneficiariesTrend = Object.entries(benefMap).map(([month, people]) => {
      running += people;
      return { month, people: running };
    });

    // Top NGO performance (radar-style scores)
    const ngoScores = projects.reduce(
      (acc, p) => {
        const name = p.ngo.user.name.split(" ")[0];
        if (!acc[name]) acc[name] = { name, milestones: 0, approved: 0 };
        acc[name].milestones += p.milestones.length;
        acc[name].approved += p.milestones.filter((m) => m.status === "APPROVED").length;
        return acc;
      },
      {} as Record<string, { name: string; milestones: number; approved: number }>,
    );
    const ngoList = Object.values(ngoScores).slice(0, 3);

    // KPIs
    const totalBeneficiaries = projects.reduce((s, p) => s + p.beneficiaries, 0);
    const allMilestones = projects.flatMap((p) => p.milestones);
    const approvedMs = allMilestones.filter((m) => m.status === "APPROVED").length;
    const milestoneSuccess =
      allMilestones.length > 0 ? Math.round((approvedMs / allMilestones.length) * 100) : 0;
    const totalSpend = company.allocations.reduce((s, a) => s + a.amount, 0);
    const costPerBeneficiary =
      totalBeneficiaries > 0 ? Math.round(totalSpend / totalBeneficiaries) : 0;

    return NextResponse.json({
      kpis: { totalBeneficiaries, milestoneSuccess, costPerBeneficiary },
      sectorSpend,
      geoImpact,
      milestoneTrend,
      beneficiariesTrend,
      ngoList,
    });
  } catch (e) {
    return serverError(e);
  }
}
