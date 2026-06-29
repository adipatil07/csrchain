import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError } from "@/lib/api-helpers";
import { recordAttendanceOnChain } from "@/lib/blockchain";

/** PUT /api/volunteer/attendance/[id]/checkout */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const { id } = await params;

    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) return notFound("Profile not found");

    const attendance = await prisma.attendance.findUnique({ where: { id } });
    if (!attendance || attendance.volunteerId !== profile.id) return notFound();
    if (attendance.checkOutTime) {
      return NextResponse.json({ message: "Already checked out", attendance }, { status: 200 });
    }

    const checkOutTime = new Date();
    const diffMs = checkOutTime.getTime() - attendance.checkInTime.getTime();
    const hours = Math.round((diffMs / 3_600_000) * 10) / 10;

    const blockchainTx = await recordAttendanceOnChain(
      id,
      profile.id,
      attendance.projectId,
      attendance.checkInTime,
      checkOutTime,
      hours
    );

    const updated = await prisma.attendance.update({
      where: { id },
      data: { checkOutTime, hours, blockchainTx },
    });

    // Update totalHours on volunteer profile
    await prisma.volunteerProfile.update({
      where: { id: profile.id },
      data: { totalHours: { increment: hours } },
    });

    return NextResponse.json({ attendance: updated });
  } catch (e) {
    return serverError(e);
  }
}
