// app/api/nurse/shifts/route.ts

import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth'; // Utility function to extract user from JWT
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the logged-in user
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch upcoming shifts for the user
    const shifts = await prisma.shift.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Map shifts to the format expected by the frontend
    const shiftsData = shifts.map((shift) => ({
      id: shift.id,
      facility: shift.facility,
      date: shift.date.toISOString().split('T')[0],
      time: shift.time,
    }));

    return NextResponse.json(shiftsData, { status: 200 });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
