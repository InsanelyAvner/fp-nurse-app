// File: /app/api/jobs/[jobId]/applicants/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromToken } from "@/lib/utils/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
): Promise<NextResponse> {
  const { jobId } = params;
  const jobIdNum = parseInt(jobId, 10);

  if (isNaN(jobIdNum)) {
    return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
  }

  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const applicants = await prisma.application.findMany({
      where: { jobId: jobIdNum, status: "APPLIED" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
            bio: true,
          },
        },
      },
    });

    const formattedApplicants = applicants.map((app) => ({
      id: app.id,
      name: app.user.name,
      email: app.user.email,
      profileImage: app.user.profileImageUrl || null,
      matchingScore: app.matchingScore,
      keySkills: [], // Assuming you have a way to get skills
      experience: 0, // Assuming you have a way to get experience
      certifications: [], // Assuming you have a way to get certifications
      bio: app.user.bio || null,
    }));

    return NextResponse.json({ applicants: formattedApplicants }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
