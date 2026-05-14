import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthUser,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/api-helpers";

export async function POST(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "VOLUNTEER") return unauthorized();

  try {
    const { projectId } = await req.json();
    if (!projectId) return badRequest("projectId is required");

    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

    // Check if already applied
    const existing = await prisma.volunteerApplication.findFirst({
      where: { volunteerId: profile.id, projectId },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Already applied", application: existing },
        { status: 200 },
      );
    }

    // Check project is ACTIVE
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.status !== "ACTIVE") {
      return badRequest("Project is not accepting applications");
    }

    const application = await prisma.volunteerApplication.create({
      data: {
        volunteerId: profile.id,
        projectId,
        status: "APPLIED",
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}
