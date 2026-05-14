import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, serverError } from '@/lib/api-helpers';

// GET /api/ngo/funds — fund flow and transactions for the NGO
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const ngo = await prisma.nGOProfile.findUnique({ where: { userId: user.userId } });
    if (!ngo) return NextResponse.json({ transactions: [], stats: null });

    const [allocations, fundReleases] = await Promise.all([
      prisma.cSRAllocation.findMany({
        where: { project: { ngoId: ngo.id } },
        include: { project: true, company: true },
        orderBy: { allocatedAt: 'desc' },
      }),
      prisma.fundRelease.findMany({
        where: { milestone: { project: { ngoId: ngo.id } } },
        include: { milestone: { include: { project: { include: { allocations: { include: { company: true } } } } } } },
        orderBy: { releasedAt: 'desc' },
      }),
    ]);

    // Build transaction list
    const depositTxs = allocations.map(a => ({
      id: `dep-${a.id}`,
      date: a.allocatedAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      project: a.project.title,
      partner: a.company.companyName,
      type: 'Deposit' as const,
      amount: `₹${(a.amount / 100000).toFixed(2)} L`,
      amountRaw: a.amount,
      tx: a.escrowTxHash || '—',
    }));

    const releaseTxs = fundReleases.map(r => ({
      id: `rel-${r.id}`,
      date: r.releasedAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      project: r.milestone.project.title,
      partner: r.milestone.project.allocations?.[0]?.company?.companyName || '—',
      type: 'Release' as const,
      amount: `₹${(r.milestone.amount / 100000).toFixed(2)} L`,
      amountRaw: r.milestone.amount,
      tx: r.releaseTxHash,
    }));

    const transactions = [...depositTxs, ...releaseTxs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Stats
    const totalReceived = allocations.reduce((s, a) => s + a.amount, 0);
    const totalUtilized = fundReleases.reduce((s, r) => s + r.milestone.amount, 0);
    const inEscrow = totalReceived - totalUtilized;
    const utilization = totalReceived > 0 ? ((totalUtilized / totalReceived) * 100).toFixed(1) : '0.0';

    // Per-project breakdown
    const projects = await prisma.project.findMany({
      where: { ngoId: ngo.id },
      include: { allocations: true, milestones: { where: { status: 'APPROVED' } } },
    });

    const perProject = projects.map(p => ({
      name: p.title.split(' ').slice(0, 2).join(' '),
      received: p.allocations.reduce((s, a) => s + a.amount, 0),
      utilized: p.milestones.reduce((s, m) => s + m.amount, 0),
    }));

    return NextResponse.json({
      transactions,
      stats: {
        totalReceived,
        totalReceivedFormatted: `₹${(totalReceived / 10000000).toFixed(2)} Cr`,
        totalUtilized,
        totalUtilizedFormatted: `₹${(totalUtilized / 10000000).toFixed(2)} Cr`,
        inEscrow,
        inEscrowFormatted: `₹${(inEscrow / 100000).toFixed(2)} L`,
        utilization: `${utilization}%`,
        releasedThisMonth: fundReleases
          .filter(r => {
            const now = new Date();
            return r.releasedAt.getMonth() === now.getMonth() && r.releasedAt.getFullYear() === now.getFullYear();
          })
          .reduce((s, r) => s + r.milestone.amount, 0),
      },
      perProject,
    });
  } catch (e) {
    return serverError(e);
  }
}
