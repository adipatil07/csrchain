import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    // Parse filter params
    const url = new URL(req.url);
    const search = url.searchParams.get("search") ?? "";
    const sector = url.searchParams.get("sector") ?? "";
    const location = url.searchParams.get("location") ?? "";

    const projects = await prisma.project.findMany({
      where: {
        status: "ACTIVE",
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { ngo: { user: { name: { contains: search, mode: "insensitive" } } } },
              ],
            }
          : {}),
        ...(sector ? { sector: { contains: sector, mode: "insensitive" } } : {}),
        ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      },
      include: {
        ngo: { include: { user: true } },
        applications: {
          where: { volunteerId: profile.id },
          select: { id: true, status: true },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = projects.map((p) => ({
      id: p.id,
      title: p.title,
      ngo: p.ngo.user.name,
      ngoInitials: p.ngo.user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      location: p.location,
      sector: p.sector,
      description: p.description,
      budget: p.budget,
      startDate: p.startDate?.toISOString().split("T")[0] ?? null,
      endDate: p.endDate?.toISOString().split("T")[0] ?? null,
      volunteerCount: p._count.applications,
      myApplication: p.applications[0] ?? null,
    }));

    return NextResponse.json({ projects: data });
  } catch (e) {
    return serverError(e);
  }
}
