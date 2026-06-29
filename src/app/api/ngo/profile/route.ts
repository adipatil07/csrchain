import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

/** GET /api/ngo/profile */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const ngo = await prisma.nGOProfile.findUnique({
      where: { userId: user.userId },
      include: { user: true },
    });

    if (!ngo) return NextResponse.json({ profile: null }, { status: 404 });

    return NextResponse.json({
      profile: {
        id: ngo.id,
        name: ngo.user.name,
        email: ngo.user.email,
        organization: ngo.organization,
        registrationNo: ngo.registrationNo,
        walletAddress: ngo.walletAddress,
        phone: ngo.phone ?? "",
        address: ngo.address ?? "",
        focusAreas: ngo.focusAreas ?? [],
        description: ngo.description ?? "",
      },
    });
  } catch (e) {
    return serverError(e);
  }
}

/** PUT /api/ngo/profile */
export async function PUT(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const body = await req.json();
    const { organization, registrationNo, walletAddress, phone, address, focusAreas, description, name } = body;

    // Update user name if provided
    if (name) {
      await prisma.user.update({ where: { id: user.userId }, data: { name } });
    }

    const ngo = await prisma.nGOProfile.upsert({
      where: { userId: user.userId },
      create: {
        userId: user.userId,
        organization: organization ?? "",
        registrationNo: registrationNo ?? "",
        walletAddress: walletAddress ?? "",
        phone: phone ?? null,
        address: address ?? null,
        focusAreas: focusAreas ?? [],
        description: description ?? null,
      },
      update: {
        organization: organization ?? undefined,
        registrationNo: registrationNo ?? undefined,
        walletAddress: walletAddress ?? undefined,
        phone: phone ?? undefined,
        address: address ?? undefined,
        focusAreas: focusAreas ?? undefined,
        description: description ?? undefined,
      },
      include: { user: true },
    });

    return NextResponse.json({
      profile: {
        id: ngo.id,
        name: ngo.user.name,
        email: ngo.user.email,
        organization: ngo.organization,
        registrationNo: ngo.registrationNo,
        walletAddress: ngo.walletAddress,
        phone: ngo.phone ?? "",
        address: ngo.address ?? "",
        focusAreas: ngo.focusAreas ?? [],
        description: ngo.description ?? "",
      },
    });
  } catch (e) {
    return serverError(e);
  }
}
