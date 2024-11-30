// app/api/jobs/[id]/applicants/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromToken } from "@/lib/utils/auth";

interface Applicant {
  id: number;
  name: string;
  email: string;
  matchingScore: number;
  keySkills: string[];
  experience: number; // in years
}

function calculateTotalExperience(
  experiences: { startDate: Date | null; endDate: Date | null }[]
): number {
  let totalExperience = 0;
  const now = new Date();

  experiences.forEach((exp) => {
    const start = exp.startDate ? new Date(exp.startDate) : null;
    const end = exp.endDate ? new Date(exp.endDate) : now;

    if (start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffYears = diffTime / (1000 * 3600 * 24 * 365.25);
      totalExperience += diffYears;
    }
  });

  return Math.round(totalExperience);
}

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  const { id } = params;
  const jobId = parseInt(id, 10);

  if (isNaN(jobId)) {
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

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            skills: {
              select: {
                name: true,
              },
            },
            experiences: {
              select: {
                startDate: true,
                endDate: true,
              },
            },
          },
        },
      },
    });

    const applicants: Applicant[] = applications.map((app) => {
      const experience = calculateTotalExperience(app.user.experiences);
      return {
        id: app.user.id,
        name: `${app.user.firstName} ${app.user.lastName}`,
        email: app.user.email,
        matchingScore: app.matchingScore,
        keySkills: app.user.skills.map((skill) => skill.name),
        experience: experience,
      };
    });

    return NextResponse.json(applicants, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
