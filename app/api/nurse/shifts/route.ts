// app/api/nurse/shifts/route.ts

import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth'; // Utility function to extract user from JWT
import { NextRequest, NextResponse } from 'next/server';
import { Shift } from '@prisma/client'; // Import Shift type if needed

// Define the response structure for a shift
interface ShiftResponse {
  id: number;
  facility: string;
  startDate: string; // ISO String
  endDate: string;   // ISO String
  startTime: string; // e.g., "08:00"
  endTime: string;   // e.g., "16:00"
  mealBreak: boolean;
  assignedDepartment: string;
  assignedSupervisor: string;
  supervisorRating: number;
  commentsOnPerformance: string;
  recommendToRehire: boolean;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the user
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Optionally, restrict access based on roles
    if (user.role !== 'USER' && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Extract query parameters for pagination (optional)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Optional: Extract date range for filtering
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const currentDate = new Date();

    // Build the where clause
    const whereClause: any = {
      userId: user.id,
      startDate: {
        gte: currentDate, // Fetch shifts starting today or in the future
      },
    };

    if (startDateParam) {
      const startDate = new Date(startDateParam);
      if (!isNaN(startDate.getTime())) {
        whereClause.startDate = {
          ...whereClause.startDate,
          gte: startDate,
        };
      }
    }

    if (endDateParam) {
      const endDate = new Date(endDateParam);
      if (!isNaN(endDate.getTime())) {
        whereClause.startDate = {
          ...whereClause.startDate,
          lte: endDate,
        };
      }
    }

    // Fetch shifts with pagination and filtering
    const shifts = await prisma.shift.findMany({
      where: whereClause,
      orderBy: {
        startDate: 'asc',
      },
      skip,
      take: limit,
    });

    // Fetch total count for pagination
    const totalShifts = await prisma.shift.count({
      where: whereClause,
    });

    // Map shifts to the format expected by the frontend
    const shiftsData: ShiftResponse[] = shifts.map((shift: Shift) => ({
      id: shift.id,
      facility: shift.facility,
      startDate: shift.startDate.toISOString(),
      endDate: shift.endDate.toISOString(),
      startTime: shift.startTime,
      endTime: shift.endTime,
      mealBreak: shift.mealBreak,
      assignedDepartment: shift.assignedDepartment,
      assignedSupervisor: shift.assignedSupervisor,
      supervisorRating: shift.supervisorRating,
      commentsOnPerformance: shift.commentsOnPerformance,
      recommendToRehire: shift.recommendToRehire,
      createdAt: shift.createdAt.toISOString(),
      updatedAt: shift.updatedAt.toISOString(),
    }));

    // Prepare the response with pagination info
    const response = {
      shifts: shiftsData,
      pagination: {
        page,
        limit,
        total: totalShifts,
        totalPages: Math.ceil(totalShifts / limit),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching shifts:', error.message || error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
  // Removed prisma.$disconnect() to maintain the singleton instance
}
