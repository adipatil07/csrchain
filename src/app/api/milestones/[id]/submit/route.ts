import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, badRequest, notFound, serverError } from '@/lib/api-helpers';
import { uploadMilestoneProof } from '@/lib/ipfs';

// PUT /api/milestones/[id]/submit — NGO submits proof for a milestone
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  if (user.role !== 'NGO') return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const { proofDesc, geoLocation, proofPhotoHash } = body;

    if (!proofDesc) return badRequest('Proof description is required');

    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (!milestone) return notFound('Milestone not found');

    if (milestone.status !== 'PENDING') {
      return badRequest('Only PENDING milestones can be submitted');
    }

    const ipfsHash = await uploadMilestoneProof({
      milestoneId: id,
      projectId: milestone.projectId,
      description: proofDesc,
      geoLocation: geoLocation ?? undefined,
      submittedAt: new Date().toISOString(),
    });

    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        proofDesc,
        geoLocation: geoLocation || null,
        proofIpfsHash: ipfsHash,
        proofPhotoHash: proofPhotoHash || null,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({
      milestone: updated,
      ipfsHash,
      message: 'Proof submitted. Awaiting company verification.',
    });
  } catch (e) {
    return serverError(e);
  }
}
