// /pages/api/jobs/[id].ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
    const { id } = await params
  const jobId = parseInt(id, 10);

  if (isNaN(jobId)) {
    return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        requiredSkills: {
          select: { name: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const formattedJob = {
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
    };

    return NextResponse.json(formattedJob, { status: 200 });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}