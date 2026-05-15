import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "COMPANY") return unauthorized();

  try {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!company) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const allocations = await prisma.cSRAllocation.findMany({
      where: { companyId: company.id, status: "ACTIVE" },
      include: {
        project: {
          include: {
            ngo: { include: { user: true } },
            milestones: { orderBy: { deadline: "asc" } },
          },
        },
      },
    });

    const now = new Date();

    const liveProjects = allocations.map((a) => {
      const p = a.project;
      const pending = p.milestones.find(
        (m) => m.status === "PENDING" || m.status === "SUBMITTED",
      );
      const latestSubmitted = p.milestones
        .filter((m) => m.submittedAt)
        .sort((x, y) => (x.submittedAt! > y.submittedAt! ? -1 : 1))[0];

      const lastUpdateDate = latestSubmitted?.submittedAt ?? p.createdAt;
      const daysSince = Math.floor(
        (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const lastUpdate =
        daysSince === 0 ? "Today" :
        daysSince === 1 ? "1 day ago" :
        `${daysSince} days ago`;

      // Health: delayed if any PENDING milestone has passed its deadline
      const overdue = p.milestones.some(
        (m) => m.status === "PENDING" && m.deadline < now,
      );
      const submitted = p.milestones.some((m) => m.status === "SUBMITTED");

      const health = overdue ? "Delayed" : "On Track";

      return {
        id: p.id,
        name: p.title,
        ngo: p.ngo.user.name,
        location: p.location,
        progress: p.progress,
        currentMilestone: pending?.title ?? "All milestones complete",
        lastUpdate,
        health,
        tx: a.escrowTxHash ? `${a.escrowTxHash.slice(0, 6)}...${a.escrowTxHash.slice(-4)}` : "—",
        hasSubmitted: submitted,
        sector: p.sector,
      };
    });

    // Alerts
    const alerts: { level: "high" | "medium" | "low"; project: string; message: string }[] = [];
    liveProjects.forEach((p) => {
      if (p.health === "Delayed") {
        alerts.push({
          level: "high",
          project: p.name,
          message: `No recent update. Milestone deadline may have passed.`,
        });
      }
      if (p.hasSubmitted) {
        alerts.push({
          level: "medium",
          project: p.name,
          message: `A milestone has been submitted and is awaiting your verification.`,
        });
      }
    });

    const onTrack = liveProjects.filter((p) => p.health === "On Track").length;
    const delayed = liveProjects.filter((p) => p.health === "Delayed").length;
    const criticalAlerts = alerts.filter((a) => a.level === "high").length;

    // Geo photos: derive from project locations
    const geoPhotos = liveProjects.slice(0, 4).map((p) => ({
      label: `${p.location} — ${p.sector}`,
      coords: "GPS data pending",
    }));

    return NextResponse.json({
      liveProjects,
      alerts,
      summary: {
        activeProjects: liveProjects.length,
        onTrack,
        delayed,
        criticalAlerts,
      },
      geoPhotos,
    });
  } catch (e) {
    return serverError(e);
  }
}
