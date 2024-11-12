// app/api/jobs/[id]/applicants/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth';

interface Applicant {
  id: number;
  name: string;
  email: string;
  profileImage: string;
  matchingScore: number;
  keySkills: string[];
  experience: number; // in years
  certifications: string[];
  bio: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = await params;
  const jobId = parseInt(id, 10);

  if (isNaN(jobId)) {
    return NextResponse.json({ message: 'Invalid job ID' }, { status: 400 });
  }

  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
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
            profilePictureUrl: true,
            yearsOfExperience: true,
            skills: {
              select: {
                name: true,
              },
            },
            certifications: true,
            bio: true,
          },
        },
      },
    });

    const applicants: Applicant[] = applications.map((app) => ({
      id: app.user.id,
      name: `${app.user.firstName} ${app.user.lastName}`,
      email: app.user.email,
      profileImage: app.user.profilePictureUrl || "/default-avatar.png",
      matchingScore: app.matchingScore,
      keySkills: app.user.skills.map(skill => skill.name),
      experience: app.user.yearsOfExperience || 0,
      certifications: app.user.certifications,
      bio: app.user.bio || "",
    }));

    return NextResponse.json(applicants, { status: 200 });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}