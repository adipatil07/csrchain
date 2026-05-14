import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, serverError } from '@/lib/api-helpers';

// GET /api/ngo/stats — dashboard overview stats for NGO
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const ngo = await prisma.nGOProfile.findUnique({ where: { userId: user.userId } });
    if (!ngo) return NextResponse.json({ stats: null });

    const [projects, milestones, allocations] = await Promise.all([
      prisma.project.findMany({
        where: { ngoId: ngo.id },
        include: { milestones: true, allocations: true },
      }),
      prisma.milestone.findMany({
        where: { project: { ngoId: ngo.id } },
        include: { project: { include: { allocations: { include: { company: true } } } } },
      }),
      prisma.cSRAllocation.findMany({
        where: { project: { ngoId: ngo.id } },
      }),
    ]);

    const totalReceived = allocations.reduce((sum, a) => sum + a.amount, 0);
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const pendingReview = projects.filter(p => p.status === 'UNDER_REVIEW').length;
    const pendingMilestones = milestones.filter(m => m.status === 'PENDING').length;

    // Fund releases (approved milestones)
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
            'hour'
          )
        : '',
    }));

    // Active projects list
    const activeProjectsList = projects
      .filter(p => ['ACTIVE', 'UNDER_REVIEW'].includes(p.status))
      .map(p => {
        const company = p.allocations?.[0];
        const totalFunds = p.allocations.reduce((s, a) => s + a.amount, 0);
        return {
          id: p.id,
          proposalRef: p.proposalRef,
          name: p.title,
          partner: p.allocations?.[0] ? 'Funded' : 'Seeking Funding',
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

    return NextResponse.json({
      stats: {
        totalReceived,
        totalReceivedFormatted: `₹${(totalReceived / 10000000).toFixed(2)} Cr`,
        activeProjects,
        pendingReview,
        utilization: `${utilization}%`,
        totalUtilized,
        pendingMilestones,
      },
      recentActivities,
      activeProjects: activeProjectsList,
      pendingMilestones: pendingMilestonesList,
    });
  } catch (e) {
    return serverError(e);
  }
}
