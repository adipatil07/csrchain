import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthUser,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/api-helpers";

/** GET  /api/volunteer/attendance — history + stats */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const attendances = await prisma.attendance.findMany({
      where: { volunteerId: profile.id },
      include: { project: { include: { ngo: { include: { user: true } } } } },
      orderBy: { checkInTime: "desc" },
    });

    const history = attendances.map((a) => ({
      id: a.id,
      event: a.project.title,
      ngo: a.project.ngo.user.name,
      date: a.checkInTime.toISOString().split("T")[0],
      checkIn: a.checkInTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      checkOut: a.checkOutTime
        ? a.checkOutTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      hours: a.hours,
      geo: a.geoHash || "—",
      tx: a.blockchainTx || null,
      isActive: !a.checkOutTime,
    }));

    const totalHours = attendances.reduce((s, a) => s + a.hours, 0);
    const eventsAttended = attendances.filter((a) => a.checkOutTime).length;
    const attestationRate =
      attendances.length > 0
        ? Math.round(
            (attendances.filter((a) => a.blockchainTx).length / attendances.length) * 100,
          )
        : 0;

    // Active check-in (no checkout yet)
    const active = attendances.find((a) => !a.checkOutTime);

    return NextResponse.json({
      history,
      stats: {
        totalHours: Math.round(totalHours * 10) / 10,
        eventsAttended,
        attestationRate,
      },
      activeCheckIn: active
        ? {
            id: active.id,
            event: active.project.title,
            ngo: active.project.ngo.user.name,
            location: active.project.location,
            checkIn: active.checkInTime.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            geo: active.geoHash,
          }
        : null,
    });
  } catch (e) {
    return serverError(e);
  }
}

/** POST /api/volunteer/attendance — check-in */
export async function POST(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const { projectId, geoHash } = await req.json();
    if (!projectId) return badRequest("projectId is required");

    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    // Ensure volunteer is accepted on this project
    const application = await prisma.volunteerApplication.findFirst({
      where: { volunteerId: profile.id, projectId, status: "ACCEPTED" },
    });
    if (!application) return badRequest("You must be accepted to check in");

    // Ensure no active check-in exists
    const existing = await prisma.attendance.findFirst({
      where: { volunteerId: profile.id, projectId, checkOutTime: null },
    });
    if (existing) {
      return NextResponse.json({ message: "Already checked in", attendance: existing }, { status: 200 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        volunteerId: profile.id,
        projectId,
        checkInTime: new Date(),
        geoHash: geoHash ?? "",
      },
    });

    return NextResponse.json({ attendance }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
