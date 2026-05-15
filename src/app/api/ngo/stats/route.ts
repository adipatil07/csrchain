import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, serverError } from '@/lib/api-helpers';

// GET /api/ngo/stats — dashboard overview stats for NGO
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const ngo = await prisma.nGOProfile.findUnique({
      where: { userId: user.userId },
      include: { user: true },
    });
    if (!ngo) return NextResponse.json({ stats: null });

    const [projects, milestones, allocations, fundReleases] = await Promise.all([
      prisma.project.findMany({
        where: { ngoId: ngo.id },
        include: { milestones: true, allocations: { include: { company: true } } },
      }),
      prisma.milestone.findMany({
        where: { project: { ngoId: ngo.id } },
        include: { project: { include: { allocations: { include: { company: true } } } } },
      }),
      prisma.cSRAllocation.findMany({
        where: { project: { ngoId: ngo.id } },
        include: { company: true },
        orderBy: { allocatedAt: 'asc' },
      }),
      prisma.fundRelease.findMany({
        where: { milestone: { project: { ngoId: ngo.id } } },
        include: { milestone: true },
        orderBy: { releasedAt: 'asc' },
      }),
    ]);

    const totalReceived = allocations.reduce((sum, a) => sum + a.amount, 0);
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const pendingReview = projects.filter(p => p.status === 'UNDER_REVIEW').length;
    const pendingMilestonesCount = milestones.filter(m => m.status === 'PENDING').length;

    const approvedMilestones = milestones.filter(m => m.status === 'APPROVED');
    const totalUtilized = approvedMilestones.reduce((sum, m) => sum + m.amount, 0);
    const utilization = totalReceived > 0 ? ((totalUtilized / totalReceived) * 100).toFixed(1) : '0.0';

    // Recent activity — last 5 milestone/project events
    const recentMilestones = await prisma.milestone.findMany({
      where: { project: { ngoId: ngo.id }, status: { in: ['SUBMITTED', 'APPROVED', 'REJECTED'] } },
      include: { project: true },
      orderBy: { submittedAt: 'desc' },
      take: 5,
    });

    const recentActivities = recentMilestones.map(m => ({
      id: m.id,
      type: m.status === 'APPROVED' ? 'fund' : m.status === 'SUBMITTED' ? 'milestone' : 'alert',
      message:
        m.status === 'APPROVED'
          ? `Escrow released for ${m.title} — ${m.project.title}`
          : m.status === 'SUBMITTED'
          ? `IPFS proof submitted for ${m.title}`
          : `Milestone rejected: ${m.title}`,
      time: m.submittedAt
        ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
            Math.round((m.submittedAt.getTime() - Date.now()) / (1000 * 60 * 60)),
            'hour',
          )
        : '',
    }));

    // Active projects list
    const activeProjectsList = projects
      .filter(p => ['ACTIVE', 'UNDER_REVIEW'].includes(p.status))
      .map(p => {
        const totalFunds = p.allocations.reduce((s, a) => s + a.amount, 0);
        return {
          id: p.id,
          proposalRef: p.proposalRef,
          name: p.title,
          partner: p.allocations?.[0]?.company?.companyName || 'Seeking Funding',
          progress: p.progress,
          funds: `₹${(totalFunds / 100000).toFixed(2)} L`,
          status:
            p.progress > 80 ? 'Near Complete' : p.progress > 50 ? 'In Progress' : p.progress > 0 ? 'Starting' : 'On Track',
          lane: p.lane,
        };
      });

    // Pending milestones list
    const pendingMilestonesList = milestones
      .filter(m => m.status === 'PENDING')
      .slice(0, 5)
      .map(m => ({
        id: m.id,
        project: m.project.title,
        milestone: m.title,
        deadline: m.deadline.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: `₹${(m.amount / 100000).toFixed(2)} L`,
      }));

    // ── Fund Flow (last 6 months) ─────────────────────────────────────────────
    const now = new Date();
    const fundFlowData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const label = d.toLocaleString('en-IN', { month: 'short' });
      const received = allocations
        .filter(a => {
          const ad = new Date(a.allocatedAt);
          return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth();
        })
        .reduce((s, a) => s + a.amount, 0);
      const utilized = fundReleases
        .filter(r => {
          const rd = new Date(r.releasedAt);
          return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth();
        })
        .reduce((s, r) => s + r.milestone.amount, 0);
      return { month: label, received, utilized };
    });

    // ── Sector / Project Distribution ─────────────────────────────────────────
    const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    const sectorMap: Record<string, number> = {};
    projects.forEach(p => {
      sectorMap[p.sector] = (sectorMap[p.sector] || 0) + 1;
    });
    const sectorData = Object.entries(sectorMap).map(([name, value], i) => ({
      name,
      value,
      color: COLORS[i % COLORS.length],
    }));

    // ── Blockchain Banner ──────────────────────────────────────────────────────
    const escrowBalance = projects.reduce((s, p) => s + p.escrowBalance, 0);
    const verifiedMilestones = milestones.filter(m => m.status === 'APPROVED').length;
    const latestAlloc = allocations.slice(-1)[0];
    const latestRelease = fundReleases.slice(-1)[0];
    const blockchainBanner = {
      escrowContract: latestAlloc?.escrowTxHash
        ? `${latestAlloc.escrowTxHash.slice(0, 6)}…${latestAlloc.escrowTxHash.slice(-4)}`
        : '—',
      escrowBalance,
      escrowBalanceFormatted:
        escrowBalance >= 100000
          ? `₹${(escrowBalance / 100000).toFixed(2)} L`
          : `₹${escrowBalance.toLocaleString('en-IN')}`,
      verifiedMilestones,
      totalMilestones: milestones.length,
      lastTx: latestRelease?.releaseTxHash
        ? `${latestRelease.releaseTxHash.slice(0, 6)}…${latestRelease.releaseTxHash.slice(-4)}`
        : latestAlloc?.escrowTxHash
        ? `${latestAlloc.escrowTxHash.slice(0, 6)}…${latestAlloc.escrowTxHash.slice(-4)}`
        : '—',
    };

    return NextResponse.json({
      stats: {
        totalReceived,
        totalReceivedFormatted: `₹${(totalReceived / 10000000).toFixed(2)} Cr`,
        activeProjects,
        pendingReview,
        utilization: `${utilization}%`,
        totalUtilized,
        pendingMilestones: pendingMilestonesCount,
        ngoName: ngo.organization,
        userName: ngo.user.name,
        userEmail: ngo.user.email,
      },
      recentActivities,
      activeProjects: activeProjectsList,
      pendingMilestones: pendingMilestonesList,
      fundFlowData,
      sectorData,
      blockchainBanner,
    });
  } catch (e) {
    return serverError(e);
  }
}
