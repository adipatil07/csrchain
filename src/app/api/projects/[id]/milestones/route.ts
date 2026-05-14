import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, badRequest, serverError } from '@/lib/api-helpers';

// GET /api/projects/[id]/milestones
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const { id } = await params;
    const milestones = await prisma.milestone.findMany({
      where: { projectId: id },
      include: { fundRelease: true },
      orderBy: { deadline: 'asc' },
    });

    return NextResponse.json({ milestones });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/projects/[id]/milestones — add milestone to project
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, amount, deadline } = body;

    if (!title || !deadline) return badRequest('title and deadline are required');

    // Generate unique milestoneRef
    let milestoneRef = `M-${Math.floor(Math.random() * 900) + 100}`;
    let exists = await prisma.milestone.findUnique({ where: { milestoneRef } });
    while (exists) {
      milestoneRef = `M-${Math.floor(Math.random() * 900) + 100}`;
      exists = await prisma.milestone.findUnique({ where: { milestoneRef } });
    }

    const milestone = await prisma.milestone.create({
      data: {
        milestoneRef,
        projectId: id,
        title,
        description: description || null,
        amount: Number(amount) || 0,
        deadline: new Date(deadline),
      },
    });

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
