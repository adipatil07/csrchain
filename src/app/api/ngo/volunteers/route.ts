import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorized, serverError } from '@/lib/api-helpers';

// GET /api/ngo/volunteers — volunteers working on this NGO's projects
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) return unauthorized();

  try {
    const ngo = await prisma.nGOProfile.findUnique({ where: { userId: user.userId } });
    if (!ngo) return NextResponse.json({ volunteers: [], stats: null });

    // Get accepted volunteer applications on this NGO's projects
    const applications = await prisma.volunteerApplication.findMany({
      where: {
        project: { ngoId: ngo.id },
        status: 'ACCEPTED',
      },
      include: {
        volunteer: { include: { user: true } },
        project: true,
      },
    });

    // Aggregate per volunteer
    const volunteerMap = new Map<string, {
      id: string; name: string; initials: string; skills: string[];
      hours: number; projects: number; location: string | null; userId: string;
    }>();

    for (const app of applications) {
      const v = app.volunteer;
      const existing = volunteerMap.get(v.id);
      if (existing) {
        existing.projects += 1;
        existing.hours += v.totalHours;
      } else {
        const name = v.user.name;
        const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        volunteerMap.set(v.id, {
          id: v.id,
          name,
          initials,
          skills: v.skills,
          hours: v.totalHours,
          projects: 1,
          location: v.location,
          userId: v.userId,
        });
      }
    }

    // Get attestation counts from attendance
    const attendances = await prisma.attendance.findMany({
      where: { project: { ngoId: ngo.id } },
      select: { volunteerId: true },
    });

    const attestationCount = new Map<string, number>();
    for (const a of attendances) {
      attestationCount.set(a.volunteerId, (attestationCount.get(a.volunteerId) || 0) + 1);
    }

    const volunteers = Array.from(volunteerMap.values()).map(v => ({
      ...v,
      attestations: attestationCount.get(v.id) || 0,
    }));

    // Stats
    const totalHours = volunteers.reduce((s, v) => s + v.hours, 0);
    const totalAttestations = volunteers.reduce((s, v) => s + v.attestations, 0);

    return NextResponse.json({
      volunteers,
      stats: {
        total: volunteers.length,
        activeThisMonth: volunteers.filter(v => v.hours > 0).length,
        totalHours: totalHours.toLocaleString('en-IN'),
        totalAttestations,
      },
    });
  } catch (e) {
    return serverError(e);
  }
}
