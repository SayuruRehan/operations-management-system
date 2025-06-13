import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/auth.config";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { empName, email, password, role, contactNumber } = body;

    if (!empName || !email || !password || !role || !contactNumber) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingUser = await prisma.employee.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.employee.create({
      data: {
        empName,
        email,
        password: hashedPassword,
        role,
        contactNumber,
        dateJoined: new Date(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 