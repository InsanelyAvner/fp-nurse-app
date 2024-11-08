// File: /app/api/jobs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth';
import { JobStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // if (user.role !== 'ADMIN') {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    const jobs = await prisma.job.findMany({
      include: {
        requiredSkills: true,
        applications: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedJobs = jobs.map((job) => ({
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
      requiredSkills: job.requiredSkills.map((skill) => skill.name),
      description: job.description,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedJobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
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
      startDateTime,
      endDateTime,
    } = await req.json();

    if (
      !title ||
      !facility ||
      !department ||
      !shiftType ||
      !payRate ||
      requiredSkills.length === 0 ||
      !description ||
      !startDateTime ||
      !endDateTime
    ) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        facility,
        department,
        shiftType,
        payRate,
        urgent,
        status: 'ACTIVE',
        requiredSkills: {
          connect: requiredSkills.map((skillId: number) => ({ id: skillId })),
        },
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
      },
      include: {
        requiredSkills: true,
      },
    });

    const formattedJob = {
      id: job.id,
      title: job.title,
      facility: job.facility,
      department: job.department,
      shiftType: job.shiftType,
      status: job.status,
      applicants: 0,
      date: job.startDateTime.toISOString().split('T')[0],
      time: `${job.startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${job.endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      payRate: job.payRate,
      urgent: job.urgent,
      requiredSkills: job.requiredSkills.map((skill) => skill.name),
      description: job.description,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
