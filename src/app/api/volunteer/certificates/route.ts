import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

/** Badge definitions based on volunteer stats */
function computeBadges(totalHours: number, projectsCompleted: number, certCount: number) {
  return [
    {
      name: "First Step",
      description: "Completed first project",
      color: "from-blue-500 to-cyan-500",
      earned: projectsCompleted >= 1,
    },
    {
      name: "Community Hero",
      description: "100+ hours volunteered",
      color: "from-yellow-500 to-orange-500",
      earned: totalHours >= 100,
    },
    {
      name: "Eco Warrior",
      description: "5 environmental projects",
      color: "from-green-500 to-emerald-500",
      earned: projectsCompleted >= 5,
    },
    {
      name: "Mentor",
      description: "10+ projects joined",
      color: "from-purple-500 to-pink-500",
      earned: projectsCompleted >= 10,
    },
    {
      name: "Dedication",
      description: "6 months active streak",
      color: "from-red-500 to-rose-500",
      earned: false, // requires streak tracking
    },
    {
      name: "Ambassador",
      description: "5+ certificates earned",
      color: "from-indigo-500 to-blue-500",
      earned: certCount >= 5,
    },
  ];
}

export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.userId },
      include: {
        certificates: {
          orderBy: { issuedAt: "desc" },
        },
        applications: {
          where: { status: "ACCEPTED" },
          select: { id: true },
        },
      },
    });
    if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    const certificates = profile.certificates.map((c, idx) => ({
      id: c.id,
      title: c.title,
      project: c.projectId, // we'll enrich below
      issueDate: c.issuedAt.toISOString().split("T")[0],
      hours: c.hours,
      hash: c.blockchainTx || "0x" + Math.random().toString(16).slice(2, 42),
      ipfsHash: c.ipfsHash,
      tokenId: `#${4000 + idx + 1}`,
      chain: "Polygon",
      verified: true,
    }));

    // Enrich project titles
    const projectIds = profile.certificates.map((c) => c.projectId);
    const projects = await prisma.project.findMany({
      where: { id: { in: projectIds } },
      include: { ngo: { include: { user: true } } },
    });
    const projectMap: Record<string, { title: string; ngoName: string }> = {};
    projects.forEach((p) => {
      projectMap[p.id] = { title: p.title, ngoName: p.ngo.user.name };
    });

    const enriched = certificates.map((c) => ({
      ...c,
      project: projectMap[c.project]?.title ?? "Unknown Project",
      ngo: projectMap[c.project]?.ngoName ?? "Unknown NGO",
    }));

    const totalHours = profile.certificates.reduce((s, c) => s + c.hours, 0);
    const badges = computeBadges(
      profile.totalHours,
      profile.applications.length,
      profile.certificates.length,
    );

    return NextResponse.json({
      certificates: enriched,
      totalHours,
      badges,
    });
  } catch (e) {
    return serverError(e);
  }
}
