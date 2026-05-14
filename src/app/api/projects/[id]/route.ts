import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, notFound, serverError } from '@/lib/api-helpers';

// GET /api/projects/[id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        ngo: true,
        milestones: { orderBy: { createdAt: 'asc' } },
        allocations: { include: { company: true } },
        documents: true,
        _count: { select: { applications: true, attendances: true } },
      },
    });

    if (!project) return notFound('Project not found');
    return NextResponse.json({ project });
  } catch (e) {
    return serverError(e);
  }
}

// PUT /api/projects/[id] — update project (lane, progress, status)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(body.lane ? { lane: body.lane } : {}),
        ...(body.progress !== undefined ? { progress: Number(body.progress) } : {}),
        ...(body.status ? { status: body.status } : {}),
        ...(body.escrowTxHash ? { escrowTxHash: body.escrowTxHash } : {}),
        ...(body.escrowBalance !== undefined ? { escrowBalance: Number(body.escrowBalance) } : {}),
      },
    });

    return NextResponse.json({ project });
  } catch (e) {
    return serverError(e);
  }
}
