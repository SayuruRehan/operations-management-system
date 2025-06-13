"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { EmployeeRole } from "@prisma/client";

const roleBasedAccess: Record<EmployeeRole, string[]> = {
  ADMIN: [
    "Admin Dashboard",
    "Marketing",
    "Sales",
    "Registrations",
    "Student Management",
    "Certificates",
    "Users",
    "Settings",
  ],
  COURSE_COORDINATOR: [
    "Marketing",
    "Sales",
    "Registrations",
    "Student Management",
    "Settings",
  ],
  VISITING_LECTURER: [
    "Student Management",
    "Settings",
  ],
  IN_HOUSE_LECTURER: [
    "Student Management",
    "Settings",
  ],
  STUDENT_COUNSELOR: [
    "Marketing",
    "Sales",
    "Registrations",
    "Student Management",
    "Settings",
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role;
  const accessibleSections = roleBasedAccess[userRole] || [];

  return (
    <div className="flex h-screen">
      <Sidebar sections={accessibleSections} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
} 