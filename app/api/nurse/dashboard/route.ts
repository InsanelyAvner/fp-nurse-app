// app/api/nurse/dashboard/route.ts

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

// Helper function to verify JWT
async function verifyJWT(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid token');
  }
}

export async function GET() {
  try {
    // Retrieve cookies to access the JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify the JWT token using jose
    const secret = process.env.JWT_SECRET as string;
    const decoded = await verifyJWT(token, secret) as { user: { id: number; role: string } };
    const userId = decoded.user.id;

    // Fetch Jobs matched for the nurse
    const jobs = await prisma.job.findMany({
      where: {
        applications: {
          some: {
            userId: userId,
            status: 'APPLIED',
          },
        },
        status: 'ACTIVE',
      },
      include: {
        requiredSkills: {
          select: { name: true },
        },
        applications: {
          where: { userId: userId },
          select: { matchingScore: true },
        },
      },
    });

    // Transform jobs data
    const transformedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      facility: job.facility,
      date: job.startDateTime.toISOString().split('T')[0],
      time: `${job.startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${job.endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      payRate: job.payRate,
      urgent: job.urgent,
      requiredSkills: job.requiredSkills.map((skill) => skill.name),
      matchingScore: job.applications[0]?.matchingScore || 0,
    }));

    // Fetch Notifications for the nurse
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { timestamp: 'desc' },
      take: 5,
    });

    // Transform notifications data
    const transformedNotifications = notifications.map((notification) => ({
      id: notification.id,
      message: notification.message,
      timestamp: notification.timestamp.toISOString(),
    }));

    // Fetch Upcoming Shifts for the nurse
    const shifts = await prisma.shift.findMany({
      where: {
        userId: userId,
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: 'asc' },
      take: 5,
    });

    // Transform shifts data
    const transformedShifts = shifts.map((shift) => ({
      id: shift.id,
      facility: shift.facility,
      date: shift.date.toISOString().split('T')[0],
      time: shift.time,
    }));

    // Respond with all fetched data
    return NextResponse.json({
      jobs: transformedJobs,
      notifications: transformedNotifications,
      upcomingShifts: transformedShifts,
    });
  } catch (error) {
    console.error('Dashboard data fetching error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
