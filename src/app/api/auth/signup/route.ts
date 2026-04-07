import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password, role } = body;

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create base user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name: body.fullName || body.ngoName || body.companyName,
      },
    });

    // NGO Profile
    if (role === "NGO") {
      await prisma.nGOProfile.create({
        data: {
          userId: user.id,
          organization: body.ngoName,
          registrationNo: body.registrationNumber,
          walletAddress: "",
        },
      });
    }

    // COMPANY Profile
    if (role === "COMPANY") {
      await prisma.companyProfile.create({
        data: {
          userId: user.id,
          companyName: body.companyName,
          csrRegNo: body.cinNumber,
          totalBudget: Number(body.csrBudget),
          walletAddress: "",
        },
      });
    }

    // VOLUNTEER Profile
    if (role === "VOLUNTEER") {
      await prisma.volunteerProfile.create({
        data: {
          userId: user.id,
          skills: body.skills || [],
        },
      });
    }

    return NextResponse.json({
      message: "Signup successful",
      userId: user.id,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}