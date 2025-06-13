"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id as string;
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetch(`/api/students/${studentId}`)
        .then((res) => res.json())
        .then((data) => setStudent(data))
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><b>Name:</b> {student.name}</div>
          <div><b>NIC:</b> {student.nic}</div>
          <div><b>Email:</b> {student.email}</div>
          <div><b>WhatsApp:</b> {student.whatsappNumber}</div>
          <div><b>Status:</b> {student.status}</div>
          <Button variant="outline" onClick={() => router.push("/dashboard/student-management")}>Cancel</Button>
        </CardContent>
      </Card>
    </div>
  );
} 