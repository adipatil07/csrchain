import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest, notFound, serverError } from "@/lib/api-helpers";
import { issueCertificateOnChain } from "@/lib/blockchain";
import { uploadCertificateMetadata } from "@/lib/ipfs";

// GET /api/ngo/certificates — list all certificates issued by this NGO's projects
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "NGO") return unauthorized();

  try {
    const ngo = await prisma.nGOProfile.findUnique({ where: { userId: user.userId } });
    if (!ngo) return notFound("NGO profile not found");

    const projects = await prisma.project.findMany({
      where: { ngoId: ngo.id },
      select: { id: true },
    });
    const projectIds = projects.map((p) => p.id);

    const certificates = await prisma.certificate.findMany({
      where: { projectId: { in: projectIds } },
      include: { volunteer: { include: { user: true } } },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json({
      certificates: certificates.map((c) => ({
        id: c.id,
        title: c.title,
        volunteerName: c.volunteer.user.name,
        volunteerId: c.volunteerId,
        projectId: c.projectId,
        hours: c.hours,
        ipfsHash: c.ipfsHash,
        blockchainTx: c.blockchainTx,
        issuedAt: c.issuedAt,
      })),
    });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/ngo/certificates — issue a certificate to a volunteer
export async function POST(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "NGO") return unauthorized();

  try {
    const body = await req.json();
    const { volunteerId, projectId, title, hours } = body;

    if (!volunteerId || !projectId || !title || hours == null) {
      return badRequest("volunteerId, projectId, title, and hours are required");
    }

    const ngo = await prisma.nGOProfile.findUnique({ where: { userId: user.userId } });
    if (!ngo) return notFound("NGO profile not found");

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.ngoId !== ngo.id) return notFound("Project not found");

    const volunteer = await prisma.volunteerProfile.findUnique({
      where: { id: volunteerId },
      include: { user: true },
    });
    if (!volunteer) return notFound("Volunteer not found");

    // Upload certificate metadata to IPFS
    const ipfsHash = await uploadCertificateMetadata({
      volunteerId,
      volunteerName: volunteer.user.name,
      projectId,
      projectTitle: project.title,
      title,
      hours: Number(hours),
      issuedAt: new Date().toISOString(),
    });

    // Mint certificate on-chain
    const { txHash } = await issueCertificateOnChain(volunteerId, projectId, ipfsHash);

    // Save to DB
    const certificate = await prisma.certificate.create({
      data: {
        volunteerId,
        projectId,
        title,
        hours: Number(hours),
        ipfsHash,
        blockchainTx: txHash,
      },
    });

    return NextResponse.json({ certificate, txHash, ipfsHash }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
