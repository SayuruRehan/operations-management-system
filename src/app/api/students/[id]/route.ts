import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const student = await prisma.student.findUnique({
      where: { id: params.id },
    });
    if (!student) {
      return new NextResponse("Student not found", { status: 404 });
    }
    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name, nic, email, address, whatsappNumber, status } = body;
    if (!name || !nic || !email || !address || !whatsappNumber || !status) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    const student = await prisma.student.update({
      where: { id: params.id },
      data: { name, nic, email, address, whatsappNumber, status },
    });
    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await prisma.student.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STUDENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 