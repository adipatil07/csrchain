import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.userId },
      include: {
        user: true,
        applications: {
          include: { project: { include: { ngo: { include: { user: true } } } } },
          orderBy: { appliedAt: "desc" },
        },
        attendances: {
          include: { project: true },
          orderBy: { checkInTime: "desc" },
        },
        certificates: {
          orderBy: { issuedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    // Stats
    const totalHours = profile.totalHours;
    const projectsJoined = profile.applications.filter((a) => a.status === "ACCEPTED").length;
    const certificatesCount = profile.certificates.length;

    // Upcoming events = accepted applications with future projects
    const upcomingEvents = profile.applications
      .filter((a) => a.status === "ACCEPTED" || a.status === "APPLIED")
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        title: a.project.title,
        ngo: a.project.ngo.user.name,
        date: a.project.startDate?.toISOString().split("T")[0] ?? "TBD",
        location: a.project.location,
        status: a.status === "ACCEPTED" ? "Accepted" : "Applied",
        hours: 4, // default estimated hours
      }));

    // Hours trend: last 6 months of attendance grouped by month
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentAttendances = profile.attendances.filter(
      (a) => a.checkInTime >= sixMonthsAgo,
    );
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendMap: Record<string, number> = {};
    recentAttendances.forEach((a) => {
      const key = monthNames[a.checkInTime.getMonth()];
      trendMap[key] = (trendMap[key] ?? 0) + a.hours;
    });
    // Build last 6 months in order
    const now = new Date();
    const hoursTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = monthNames[d.getMonth()];
      return { month: key, hours: Math.round(trendMap[key] ?? 0) };
    });

    // Cause breakdown from attended projects (grouped by sector)
    const sectorColors: Record<string, string> = {
      Education: "#2563eb",
      Environment: "#06b6d4",
      Healthcare: "#8b5cf6",
      "Food Relief": "#f59e0b",
      Livelihood: "#10b981",
      "Rural Dev": "#f97316",
    };
    const sectorHours: Record<string, number> = {};
    profile.attendances.forEach((a) => {
      const sector = a.project.sector;
      sectorHours[sector] = (sectorHours[sector] ?? 0) + a.hours;
    });
    const causeBreakdown = Object.entries(sectorHours).map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: sectorColors[name] ?? "#94a3b8",
    }));

    // Recent activity (last 3 combined: attendances + certificates)
    const recentActivity = [
      ...profile.attendances.slice(0, 3).map((a) => ({
        action: a.checkOutTime ? "Completed" : "Checked In",
        project: a.project.title,
        date: a.checkInTime.toISOString().split("T")[0],
        tx: a.blockchainTx ?? "0x" + Math.random().toString(16).slice(2, 10) + "...",
        type: "attendance",
      })),
      ...profile.certificates.slice(0, 2).map((c) => ({
        action: "Certificate Issued",
        project: c.title,
        date: c.issuedAt.toISOString().split("T")[0],
        tx: c.blockchainTx || "0x" + Math.random().toString(16).slice(2, 10) + "...",
        type: "certificate",
      })),
    ]
      .sort((a, b) => (a.date > b.date ? -1 : 1))
      .slice(0, 4);

    return NextResponse.json({
      name: profile.user.name,
      stats: {
        totalHours: Math.round(totalHours),
        projectsJoined,
        certificatesCount,
        upcomingCount: upcomingEvents.length,
      },
      upcomingEvents,
      hoursTrend,
      causeBreakdown,
      recentActivity,
    });
  } catch (e) {
    return serverError(e);
  }
}
