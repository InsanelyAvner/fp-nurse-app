// app/api/nurse/applications/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Adjust the import based on your project structure
import { getUserFromToken } from '@/lib/utils/auth';

const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (user.role !== Role.USER && user.role !== Role.ADMIN) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const userId = user.id;

  try {
    const applications = await prisma.application.findMany({
      where: {
        userId: userId,
      },
      include: {
        job: {
          include: {
            requiredSkills: true,
          },
        },
      },
    });

    const formattedApplications = applications.map(application => {
      const job = application.job;
      return {
        id: job.id,
        title: job.title,
        facility: job.facility,
        date: job.startDateTime.toISOString().split('T')[0],
        time: `${job.startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${job.endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        payRate: job.payRate,
        urgent: job.urgent,
        requiredSkills: job.requiredSkills.map(skill => skill.name),
        shiftType: job.shiftType,
        department: job.department,
        description: job.description,
        responsibilities: [], // Populate if available
        facilityInfo: {
          name: job.facility,
          address: '', // Populate if available
          image: '', // Populate if available
        },
        status: application.status, // Include application status
      };
    });

    return NextResponse.json(formattedApplications, { status: 200 });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}