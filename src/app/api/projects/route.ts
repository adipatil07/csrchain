import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, badRequest, serverError, generateProposalRef } from '@/lib/api-helpers';

// GET /api/projects — list projects for the logged-in NGO
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const ngo = await prisma.nGOProfile.findUnique({ where: { userId: user.userId } });
    if (!ngo) return NextResponse.json({ projects: [] });

    const projects = await prisma.project.findMany({
      where: {
        ngoId: ngo.id,
        ...(status ? { status: status as never } : {}),
      },
      include: {
        milestones: true,
        allocations: { include: { company: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/projects — create a new project proposal
export async function POST(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  if (user.role !== 'NGO') return unauthorized();

  try {
    const body = await req.json();
    const { title, description, sector, location, budget, beneficiaries, startDate, endDate, milestones, action } = body;

    if (!title || !sector || !location) return badRequest('title, sector, and location are required');

    const ngo = await prisma.nGOProfile.findUnique({ where: { userId: user.userId } });
    if (!ngo) return badRequest('NGO profile not found');

    // Generate unique proposalRef
    let proposalRef = generateProposalRef();
    let exists = await prisma.project.findUnique({ where: { proposalRef } });
    while (exists) {
      proposalRef = generateProposalRef();
      exists = await prisma.project.findUnique({ where: { proposalRef } });
    }

    const isDraft = action === 'draft';

    const project = await prisma.project.create({
      data: {
        proposalRef,
        title,
        description: description || '',
        sector,
        location,
        budget: Number(budget) || 0,
        beneficiaries: Number(beneficiaries) || 0,
        status: isDraft ? 'DRAFT' : 'UNDER_REVIEW',
        lane: 'PLANNING',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        ngoId: ngo.id,
        submittedAt: isDraft ? null : new Date(),
      },
    });

    // Create milestones if provided
    if (milestones && Array.isArray(milestones) && milestones.length > 0) {
      for (const m of milestones) {
        let milestoneRef = `M-${Math.floor(Math.random() * 900) + 100}`;
        let mExists = await prisma.milestone.findUnique({ where: { milestoneRef } });
        while (mExists) {
          milestoneRef = `M-${Math.floor(Math.random() * 900) + 100}`;
          mExists = await prisma.milestone.findUnique({ where: { milestoneRef } });
        }

        await prisma.milestone.create({
          data: {
            milestoneRef,
            projectId: project.id,
            title: typeof m === 'string' ? m : m.title,
            amount: typeof m === 'string' ? 0 : Number(m.amount) || 0,
            deadline: m.deadline ? new Date(m.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    return NextResponse.json({ project, message: isDraft ? 'Saved as draft' : 'Submitted for review' }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
