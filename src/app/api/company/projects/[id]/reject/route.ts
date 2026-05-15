import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError } from "@/lib/api-helpers";

/** PUT /api/company/projects/[id]/reject */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = getAuthUser(req);
  if (!user || user.role !== "COMPANY") return unauthorized();

  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return notFound();

    await prisma.project.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    return NextResponse.json({ message: "Project rejected" });
  } catch (e) {
    return serverError(e);
  }
}
