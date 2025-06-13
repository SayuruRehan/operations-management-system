import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, nic, email, address, whatsappNumber, status } = body;

    if (!name || !nic || !email || !address || !whatsappNumber) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if student with same NIC or email already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { nic },
          { email }
        ]
      }
    });

    if (existingStudent) {
      return new NextResponse("Student with this NIC or email already exists", { status: 400 });
    }

    const student = await prisma.student.create({
      data: {
        name,
        nic,
        email,
        address,
        whatsappNumber,
        status: status || "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where = {
      ...(status && status !== "all" ? { status } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { nic: { contains: search, mode: "insensitive" } },
        ],
      } : {}),
    };

    const students = await prisma.student.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("[STUDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 