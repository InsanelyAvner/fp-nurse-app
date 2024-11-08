// File: /app/api/jobs/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth';
import { JobStatus } from '@prisma/client';

interface Skill {
  id: number;
  name: string;
}

interface Job {
  id: number;
  title: string;
  facility: string;
  department: string;
  shiftType: string;
  status: JobStatus;
  applicants: number;
  date: string; // ISO date string (e.g., "2025-09-16")
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[]; // Array of skill names
  description: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = await context.params;
  const jobId = parseInt(id, 10);

  if (isNaN(jobId)) {
    return NextResponse.json({ message: 'Invalid job ID' }, { status: 400 });
  }

  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Uncomment if only admins can access
    // if (user.role !== 'ADMIN') {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        requiredSkills: true, // Assuming a relation exists
        applications: true,
      },
    });

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    const formattedJob: Job = {
      id: job.id,
      title: job.title,
      facility: job.facility,
      department: job.department,
      shiftType: job.shiftType,
      status: job.status,
      applicants: job.applications.length,
      date: job.startDateTime.toISOString().split('T')[0],
      time: `${job.startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${job.endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      payRate: job.payRate,
      urgent: job.urgent,
      requiredSkills: job.requiredSkills.map((skill: Skill) => skill.name),
      description: job.description,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedJob, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = await context.params;
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

    const {
      title,
      facility,
      department,
      shiftType,
      payRate,
      urgent,
      requiredSkills,
      description,
      status,
      date,
      time,
    } = await req.json();

    // Parse date and time into startDateTime and endDateTime
    const [startTimeStr, endTimeStr] = time.split(' - ');

    function parseDateTime(dateStr: string, timeStr: string): Date {
      const dateTimeStr = `${dateStr} ${timeStr}`;
      const dateTime = new Date(dateTimeStr);
      if (isNaN(dateTime.getTime())) {
        throw new Error(`Invalid date/time format: ${dateTimeStr}`);
      }
      return dateTime;
    }

    const startDateTime = parseDateTime(date, startTimeStr);
    const endDateTime = parseDateTime(date, endTimeStr);

    // Fetch skill IDs based on skill names
    const skillsToConnect = await prisma.skill.findMany({
      where: {
        name: { in: requiredSkills },
      },
    });

    // Check if any skills are missing
    const foundSkillNames = skillsToConnect.map((skill) => skill.name);
    const missingSkills: string[] = requiredSkills.filter(
      (skill: any) => !foundSkillNames.includes(skill)
    );

    if (missingSkills.length > 0) {
      return NextResponse.json(
        { message: `Skills not found: ${missingSkills.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare the connect payload
    const connectSkillsPayload = skillsToConnect.map((skill) => ({
      id: skill.id,
    }));

    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        facility,
        department,
        shiftType,
        payRate,
        urgent,
        status,
        requiredSkills: {
          set: [],
          connect: connectSkillsPayload,
        },
        description,
        startDateTime,
        endDateTime,
      },
      include: {
        requiredSkills: true,
        applications: true,
      },
    });

    const formattedJob: Job = {
      id: job.id,
      title: job.title,
      facility: job.facility,
      department: job.department,
      shiftType: job.shiftType,
      status: job.status,
      applicants: job.applications.length,
      date: job.startDateTime.toISOString().split('T')[0],
      time: `${job.startDateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${job.endDateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      payRate: job.payRate,
      urgent: job.urgent,
      requiredSkills: job.requiredSkills.map((skill: Skill) => skill.name),
      description: job.description,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedJob, { status: 200 });
  } catch (error: any) {
    console.error('Error updating job:', error.message || error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}