import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

/** GET /api/volunteer/profile */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        volunteer: {
          include: {
            certificates: { select: { id: true } },
            applications: {
              where: { status: "ACCEPTED" },
              select: { id: true },
            },
          },
        },
      },
    });
    if (!dbUser || !dbUser.volunteer) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    const profile = dbUser.volunteer;

    return NextResponse.json({
      id: profile.id,
      name: dbUser.name,
      email: dbUser.email,
      skills: profile.skills,
      totalHours: profile.totalHours,
      location: profile.location,
      availability: profile.availability ? JSON.parse(profile.availability) : null,
      walletAddress: dbUser.walletAddress,
      certificatesCount: profile.certificates.length,
      projectsCompleted: profile.applications.length,
    });
  } catch (e) {
    return serverError(e);
  }
}

/** PUT /api/volunteer/profile */
export async function PUT(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const body = await req.json();
    const { name, skills, location, availability } = body;

    // Update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: user.userId },
        data: { name },
      });
    }

    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const updated = await prisma.volunteerProfile.update({
      where: { id: profile.id },
      data: {
        ...(skills !== undefined ? { skills } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(availability !== undefined
          ? { availability: JSON.stringify(availability) }
          : {}),
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (e) {
    return serverError(e);
  }
}
