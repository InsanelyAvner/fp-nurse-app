// app/api/nurse/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role, Specialization, ApplicationStatus } from '@prisma/client';
import { getUserFromToken } from '@/lib/utils/auth';
import prisma from '@/lib/db'; // Ensure prisma is a singleton instance

// Enable body parsing in Next.js
export const config = {
  api: {
    bodyParser: true,
  },
};

// Extend the UserResponse interface to include skills and dob
interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  contactNumber: string;
  postalCode: string;
  citizenship: string;
  race: string;
  gender: string;
  dob: string | null; // Added dob field
  specialization: Specialization;
  availableWorkDays: string;
  frequencyOfWork: number; // Changed to number
  preferredFacilityType: string;
  availableWorkTiming: string;
  experiences: {
    id: number;
    facilityName: string;
    position: string;
    department: string;
    startDate?: string;
    endDate?: string;
    responsibilities: string;
  }[];
  shifts: {
    id: number;
    facility: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    mealBreak: boolean;
    assignedDepartment: string;
    assignedSupervisor: string;
    supervisorRating: number;
    commentsOnPerformance: string;
    recommendToRehire: boolean;
  }[];
  applications: {
    id: number;
    jobId: number;
    status: ApplicationStatus;
    matchingScore: number;
    appliedAt: string;
    updatedAt: string;
  }[];
  notifications: {
    id: number;
    message: string;
    timestamp: string;
  }[];
  skills: {
    id: number;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== Role.USER && user.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const fetchedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        experiences: true,
        shifts: true,
        applications: true,
        notifications: true,
        skills: true, // Include skills in the response
      },
    });

    if (!fetchedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userResponse: UserResponse = {
      id: fetchedUser.id,
      firstName: fetchedUser.firstName,
      lastName: fetchedUser.lastName,
      email: fetchedUser.email,
      role: fetchedUser.role,
      contactNumber: fetchedUser.contactNumber,
      postalCode: fetchedUser.postalCode,
      citizenship: fetchedUser.citizenship,
      race: fetchedUser.race,
      gender: fetchedUser.gender,
      dob: fetchedUser.dob ? fetchedUser.dob.toISOString().split('T')[0] : null, // Included dob
      specialization: fetchedUser.specialization,
      availableWorkDays: fetchedUser.availableWorkDays,
      frequencyOfWork: Number(fetchedUser.frequencyOfWork), // Ensure it's a number
      preferredFacilityType: fetchedUser.preferredFacilityType,
      availableWorkTiming: fetchedUser.availableWorkTiming,
      experiences: fetchedUser.experiences.map((exp) => ({
        id: exp.id,
        facilityName: exp.facilityName,
        position: exp.position,
        department: exp.department,
        startDate: exp.startDate ? exp.startDate.toISOString().split('T')[0] : undefined,
        endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : undefined,
        responsibilities: exp.responsibilities,
      })),
      shifts: fetchedUser.shifts.map((shift) => ({
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
      })),
      applications: fetchedUser.applications.map((app) => ({
        id: app.id,
        jobId: app.jobId,
        status: app.status,
        matchingScore: app.matchingScore,
        appliedAt: app.appliedAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
      })),
      notifications: fetchedUser.notifications.map((notif) => ({
        id: notif.id,
        message: notif.message,
        timestamp: notif.timestamp.toISOString(),
      })),
      skills: fetchedUser.skills.map((skill: Skill) => ({
        id: skill.id,
        name: skill.name,
      })),
      createdAt: fetchedUser.createdAt.toISOString(),
      updatedAt: fetchedUser.updatedAt.toISOString(),
    };

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromToken(req);

    if (!user || (user.role !== Role.USER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse JSON body
    const data = await req.json();

    // Destructure fields from the parsed data
    const {
      firstName,
      lastName,
      dob,
      gender,
      contactNumber,
      postalCode,
      citizenship,
      race,
      specialization,
      availableWorkDays,
      frequencyOfWork,
      preferredFacilityType,
      availableWorkTiming,
      skills,
      experiences,
    } = data;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      !contactNumber ||
      !postalCode ||
      !citizenship ||
      !race ||
      !specialization ||
      !availableWorkDays ||
      !frequencyOfWork ||
      !preferredFacilityType ||
      !availableWorkTiming
    ) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate specialization
    const validSpecializations: Specialization[] = [
      Specialization.COMMUNITY_HEALTH,
      Specialization.CRITICAL_CARE,
      Specialization.GERONTOLOGY,
      Specialization.EMERGENCY,
    ];

    if (!validSpecializations.includes(specialization)) {
      return NextResponse.json(
        { message: 'Invalid specialization provided' },
        { status: 400 }
      );
    }

    // Update user main fields
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName as string,
        lastName: lastName as string,
        dob: dob ? new Date(dob as string) : null,
        gender: gender as string,
        contactNumber: contactNumber as string,
        postalCode: postalCode as string,
        citizenship: citizenship as string,
        race: race as string,
        specialization: specialization as Specialization,
        availableWorkDays: availableWorkDays as string,
        frequencyOfWork: Number(frequencyOfWork),
        preferredFacilityType: preferredFacilityType as string,
        availableWorkTiming: availableWorkTiming as string,
      },
      include: {
        experiences: true,
        shifts: true,
        applications: true,
        notifications: true,
        skills: true, // Include skills in the response
      },
    });

    // Handle experiences array
    const experiencesData: Array<{
      facilityName: string;
      position: string;
      department: string;
      startDate: Date | null;
      endDate: Date | null;
      responsibilities: string;
    }> = experiences || [];

    // Update experiences: delete existing and create new ones
    await prisma.experience.deleteMany({
      where: { userId: user.id },
    });

    await Promise.all(
      experiencesData.map((exp) =>
        prisma.experience.create({
          data: {
            userId: user.id,
            facilityName: exp.facilityName,
            position: exp.position,
            department: exp.department,
            startDate: exp.startDate,
            endDate: exp.endDate,
            responsibilities: exp.responsibilities,
          },
        })
      )
    );

    // Handle Skills Update
    if (Array.isArray(skills)) {
      // Fetch existing skills from the database
      const existingSkills = await prisma.skill.findMany({
        where: {
          id: {
            in: skills,
          },
        },
      });

      // Identify skills to connect
      const connectSkills = existingSkills.map((skill) => ({
        id: skill.id,
      }));

      // Update user's skills
      await prisma.user.update({
        where: { id: user.id },
        data: {
          skills: {
            set: [], // Remove existing connections
            connect: connectSkills,
          },
        },
      });

      console.log(`Updated skills for userId ${user.id}`);
    }

    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
