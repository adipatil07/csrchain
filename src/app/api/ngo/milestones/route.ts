import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, serverError } from '@/lib/api-helpers';

// GET /api/ngo/milestones — all milestones for the NGO's projects
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter'); // 'upcoming' | 'history'

    const ngo = await prisma.nGOProfile.findUnique({ where: { userId: user.userId } });
    if (!ngo) return NextResponse.json({ milestones: [] });

    const whereStatus = filter === 'upcoming'
      ? { status: 'PENDING' as const }
      : filter === 'history'
      ? { status: { in: ['SUBMITTED', 'APPROVED', 'REJECTED'] as never[] } }
      : {};

    const milestones = await prisma.milestone.findMany({
      where: {
        project: { ngoId: ngo.id },
        ...whereStatus,
      },
      include: {
        project: {
          include: { allocations: { include: { company: true } } },
        },
        fundRelease: true,
      },
      orderBy: { deadline: 'asc' },
    });

    const mapped = milestones.map(m => ({
      id: m.id,
      milestoneRef: m.milestoneRef,
      project: m.project.title,
      projectId: m.projectId,
      milestone: m.title,
      deadline: m.deadline.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: `₹${(m.amount / 100000).toFixed(2)} L`,
      amountRaw: m.amount,
      partner: m.project.allocations?.[0]?.company?.companyName || 'Not Assigned',
      status: m.status,
      ipfs: m.proofIpfsHash || '',
      tx: m.approvalTx || m.fundRelease?.releaseTxHash || '',
      submittedAt: m.submittedAt,
    }));

    // Stats
    const allMilestones = await prisma.milestone.findMany({
      where: { project: { ngoId: ngo.id } },
    });

    const stats = {
      upcoming: allMilestones.filter(m => m.status === 'PENDING').length,
      pendingVerification: allMilestones.filter(m => m.status === 'SUBMITTED').length,
      verified: allMilestones.filter(m => m.status === 'APPROVED').length,
      totalUnlocked: allMilestones
        .filter(m => m.status === 'APPROVED')
        .reduce((sum, m) => sum + m.amount, 0),
    };

    return NextResponse.json({ milestones: mapped, stats });
  } catch (e) {
    return serverError(e);
  }
}
