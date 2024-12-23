import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth';
import { ApplicationStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const hideApplied = searchParams.get('hideApplied') === 'true';

    let appliedJobIds: number[] = [];
    if (hideApplied) {
      const applications = await prisma.application.findMany({
        where: {
          userId: user.id,
        },
        select: {
          jobId: true,
        },
      });
      appliedJobIds = applications.map((app) => app.jobId);
    }

    const jobs = await prisma.job.findMany({
      where: {
        status: 'ACTIVE',
        ...(hideApplied && {
          id: {
            notIn: appliedJobIds,
          },
        }),
      },
      include: {
        requiredSkills: true,
      },
    });

    const jobMatches = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      facility: job.facility,
      department: job.department,
      shiftType: job.shiftType,
      date: job.startDateTime.toISOString().split('T')[0],
      time: `${job.startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${job.endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      payRate: job.payRate,
      urgent: job.urgent,
      status: job.status,
      requiredSkills: job.requiredSkills.map((skill) => skill.name),
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    }));

    return NextResponse.json(jobMatches, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}