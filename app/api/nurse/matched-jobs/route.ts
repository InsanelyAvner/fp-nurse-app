// app/api/nurse/matched-jobs/route.ts

import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Authenticate the user
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch applications with status 'ACCEPTED' for this user
    const acceptedApplications = await prisma.application.findMany({
      where: {
        userId: user.id,
        status: 'ACCEPTED', // Ensure this matches your ApplicationStatus enum
      },
      select: {
        jobId: true,
      },
    });

    const matchedJobIds = acceptedApplications.map(app => app.jobId);

    if (matchedJobIds.length === 0) {
      // If no matched jobs, return an empty array
      return NextResponse.json([], { status: 200 });
    }

    // Fetch jobs with these jobIds
    const matchedJobs = await prisma.job.findMany({
      where: {
        id: {
          in: matchedJobIds,
        },
      },
      include: {
        requiredSkills: true,
      },
    });

    // Map the jobs to the desired response format
    const response = matchedJobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      facility: job.facility,
      department: job.department,
      shiftType: job.shiftType,
      date: job.startDateTime.toISOString().split('T')[0], // "YYYY-MM-DD"
      time: `${job.startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${job.endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      payRate: job.payRate,
      urgent: job.urgent,
      status: job.status,
      requiredSkills: job.requiredSkills.map(skill => skill.name),
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching matched jobs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
