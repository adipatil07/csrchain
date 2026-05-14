import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, badRequest, notFound, serverError } from '@/lib/api-helpers';

// PUT /api/milestones/[id]/submit — NGO submits proof for a milestone
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();
  if (user.role !== 'NGO') return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const { proofDesc, geoLocation, proofIpfsHash, proofPhotoHash } = body;

    if (!proofDesc) return badRequest('Proof description is required');

    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (!milestone) return notFound('Milestone not found');

    if (milestone.status !== 'PENDING') {
      return badRequest('Only PENDING milestones can be submitted');
    }

    // Generate mock IPFS hash if not provided (will be replaced by real Pinata in Day 6)
    const ipfsHash = proofIpfsHash || `Qm${Math.random().toString(36).substring(2, 10).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
