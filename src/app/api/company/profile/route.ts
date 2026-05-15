import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

/** GET /api/company/profile */
export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "COMPANY") return unauthorized();

  try {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: user.userId },
      include: {
        user: true,
        allocations: {
          include: { project: { include: { ngo: { include: { user: true } } } } },
        },
      },
    });

    if (!company) return NextResponse.json({ profile: null }, { status: 404 });

    const totalAllocated = company.allocations.reduce((s, a) => s + a.amount, 0);
    const activeProjects = company.allocations.filter((a) => a.status === "ACTIVE").length;

    return NextResponse.json({
      profile: {
        id: company.id,
        name: company.user.name,
        email: company.user.email,
        companyName: company.companyName,
        csrRegNo: company.csrRegNo,
        totalBudget: company.totalBudget,
        walletAddress: company.walletAddress,
        industry: company.industry ?? "",
        phone: company.phone ?? "",
        address: company.address ?? "",
        // computed
        totalAllocated,
        activeProjects,
        utilizationPct:
          company.totalBudget > 0
            ? Math.round((totalAllocated / company.totalBudget) * 100)
            : 0,
      },
    });
  } catch (e) {
    return serverError(e);
  }
}

/** PUT /api/company/profile */
export async function PUT(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "COMPANY") return unauthorized();

  try {
    const body = await req.json();
    const { companyName, csrRegNo, totalBudget, walletAddress, industry, phone, address, name } = body;

    if (name) {
      await prisma.user.update({ where: { id: user.userId }, data: { name } });
    }

    const company = await prisma.companyProfile.update({
      where: { userId: user.userId },
      data: {
        companyName: companyName ?? undefined,
        csrRegNo: csrRegNo ?? undefined,
        totalBudget: totalBudget !== undefined ? Number(totalBudget) : undefined,
        walletAddress: walletAddress ?? undefined,
        industry: industry ?? undefined,
        phone: phone ?? undefined,
        address: address ?? undefined,
      },
      include: { user: true },
    });

    return NextResponse.json({
      profile: {
        id: company.id,
        name: company.user.name,
        email: company.user.email,
        companyName: company.companyName,
        csrRegNo: company.csrRegNo,
        totalBudget: company.totalBudget,
        walletAddress: company.walletAddress,
        industry: company.industry ?? "",
        phone: company.phone ?? "",
        address: company.address ?? "",
      },
    });
  } catch (e) {
    return serverError(e);
  }
}
