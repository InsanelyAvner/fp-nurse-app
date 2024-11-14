// app/api/admin/nurses/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth';
import { Role, Specialization } from '@prisma/client';

// Define the structure of the response
interface UserWithRelations {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: string | null;
  gender: string;
  contactNumber: string;
  postalCode: string;
  citizenship: string;
  race: string;
  role: Role;
  specialization: Specialization;
  availableWorkDays: string;
  frequencyOfWork: number;
  preferredFacilityType: string;
  availableWorkTiming: string;
  skills: { id: number; name: string }[];
  experiences: {
    id: number;
    facilityName: string;
    position: string;
    department: string;
    startDate: string | null;
    endDate: string | null;
    responsibilities: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  // Validate the ID
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json(
      { error: 'Invalid user ID provided.' },
      { status: 400 }
    );
  }

  try {
    // Authenticate the user
    const authenticatedUser = await getUserFromToken(req);

    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Check if the user has ADMIN role
    if (authenticatedUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Fetch the user with related data, excluding password and notifications
    const nurse = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        dob: true,
        gender: true,
        contactNumber: true,
        postalCode: true,
        citizenship: true,
        race: true,
        role: true,
        specialization: true,
        availableWorkDays: true,
        frequencyOfWork: true,
        preferredFacilityType: true,
        availableWorkTiming: true,
        skills: {
          select: {
            id: true,
            name: true,
          },
        },
        experiences: {
          select: {
            id: true,
            facilityName: true,
            position: true,
            department: true,
            startDate: true,
            endDate: true,
            responsibilities: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!nurse) {
      return NextResponse.json(
        { error: 'Nurse not found.' },
        { status: 404 }
      );
    }

    // Convert Date objects to ISO strings for JSON serialization
    const formattedNurse: UserWithRelations = {
      ...nurse,
      dob: nurse.dob ? new Date(nurse.dob).toISOString() : null,
      experiences: nurse.experiences.map(exp => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
        endDate: exp.endDate ? new Date(exp.endDate).toISOString() : null,
      })),
      createdAt: new Date(nurse.createdAt).toISOString(),
      updatedAt: new Date(nurse.updatedAt).toISOString(),
    };

    return NextResponse.json(formattedNurse, { status: 200 });
  } catch (error) {
    console.error('Error fetching nurse:', error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}
