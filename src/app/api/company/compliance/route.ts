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
            project: { include: { milestones: { include: { fundRelease: true } } } },
          },
        },
      },
    });
    if (!company) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const totalBudget = company.totalBudget;
    const totalAllocated = company.allocations.reduce((s, a) => s + a.amount, 0);
    const disbursed = company.allocations
      .flatMap((a) => a.project.milestones)
      .filter((m) => m.fundRelease)
      .reduce((s, m) => s + m.amount, 0);

    // % of budget spent (2% mandatory target)
    const spendPct = totalBudget > 0 ? Math.round((totalAllocated / totalBudget) * 100) : 0;
    const hasActiveProjects = company.allocations.some((a) => a.status === "ACTIVE");
    const hasAllocations = company.allocations.length > 0;

    // Regulatory checklist (partially derived from real data)
    const checklist = [
      { item: "Section 135 Applicability Confirmed", status: true },
      { item: "CSR Committee Constituted (3+ Directors)", status: true },
      { item: "CSR Policy Published on Website", status: true },
      { item: "Annual CSR Plan Approved by Board", status: true },
      { item: `2% Mandatory Spend Achieved (${spendPct}% of budget allocated)`, status: spendPct >= 100 },
      { item: "Form CSR-1 Filed with MCA", status: hasAllocations },
      { item: "Form CSR-2 Filed with MCA", status: hasAllocations },
      { item: "Independent Impact Assessment (>₹10 Cr)", status: totalAllocated > 10000000 },
      { item: "Unspent CSR Transferred to Govt Fund", status: spendPct >= 100 },
      { item: "On-chain Audit Trail Enabled", status: hasActiveProjects },
    ];

    const compliantCount = checklist.filter((c) => c.status).length;
    const complianceScore = Math.round((compliantCount / checklist.length) * 100);

    // Audit log from allocations and approvals
    const auditLogs = company.allocations.slice(0, 8).map((a) => ({
      time: a.allocatedAt.toISOString().replace("T", " ").slice(0, 16),
      user: "csr-admin@company.in",
      action: `Locked ₹${(a.amount / 100000).toFixed(2)}L escrow for "${a.project.title}"`,
      txHash: a.escrowTxHash
        ? `${a.escrowTxHash.slice(0, 6)}...${a.escrowTxHash.slice(-4)}`
        : "—",
    }));

    // Downloadable report stubs
    const reports = [
      { name: "Annual CSR Report FY 2025-26", type: "PDF", size: "3.2 MB" },
      { name: "Section 135 Compliance Certificate", type: "PDF", size: "820 KB" },
      { name: "Impact Assessment Report - Q4", type: "PDF", size: "5.8 MB" },
      { name: "Fund Disbursement Ledger", type: "CSV", size: "412 KB" },
      { name: "Board Meeting Minutes - CSR", type: "PDF", size: "1.1 MB" },
      { name: "On-chain Transaction Export", type: "CSV", size: "240 KB" },
    ];

    const remaining = Math.max(0, totalBudget - totalAllocated);

    return NextResponse.json({
      complianceScore,
      spendPct,
      budget: { totalBudget, totalAllocated, disbursed, remaining },
      checklist,
      auditLogs,
      reports,
    });
  } catch (e) {
    return serverError(e);
  }
}
