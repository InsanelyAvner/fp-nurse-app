// app/api/nurse/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, DocumentType, Role } from '@prisma/client';
import { getUserFromToken } from '@/lib/utils/auth';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Enable body parsing in Next.js
export const config = {
  api: {
    bodyParser: true,
  },
};

interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio?: string;
  contactNumber: string;
  address: string;
  dob?: string;
  gender: string;
  licenseNumber?: string;
  licenseExpiration?: string;
  yearsOfExperience?: number;
  education?: string;
  certifications: string[];
  specializations: string[];
  languages: string[];
  shiftPreferences: string[];
  skills: string[];
  profilePictureUrl?: string;
  experiences: {
    id: number;
    facilityName: string;
    position: string;
    department: string;
    startDate?: string;
    endDate?: string;
    responsibilities: string;
  }[];
  documents: {
    id: number;
    type: string;
    fileUrl: string;
    uploadedAt: string;
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
        documents: true,
        skills: true,
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
      bio: fetchedUser.bio || undefined,
      contactNumber: fetchedUser.contactNumber,
      address: fetchedUser.address,
      dob: fetchedUser.dob ? fetchedUser.dob.toISOString() : undefined,
      gender: fetchedUser.gender,
      licenseNumber: fetchedUser.licenseNumber || undefined,
      licenseExpiration: fetchedUser.licenseExpiration
        ? fetchedUser.licenseExpiration.toISOString()
        : undefined,
      yearsOfExperience: fetchedUser.yearsOfExperience || undefined,
      education: fetchedUser.education || undefined,
      certifications: fetchedUser.certifications,
      specializations: fetchedUser.specializations,
      languages: fetchedUser.languages,
      shiftPreferences: fetchedUser.shiftPreferences,
      skills: fetchedUser.skills.map((skill) => skill.name),
      profilePictureUrl: fetchedUser.profilePictureUrl || undefined,
      experiences: fetchedUser.experiences.map((exp) => ({
        id: exp.id,
        facilityName: exp.facilityName,
        position: exp.position,
        department: exp.department,
        startDate: exp.startDate ? exp.startDate.toISOString() : undefined,
        endDate: exp.endDate ? exp.endDate.toISOString() : undefined,
        responsibilities: exp.responsibilities,
      })),
      documents: fetchedUser.documents.map((doc) => ({
        id: doc.id,
        type: doc.type,
        fileUrl: doc.fileUrl,
        uploadedAt: doc.uploadedAt.toISOString(),
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
  console.log('POST request received');
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== Role.USER && user.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Retrieve form data from the request
    const formData = await req.formData();
    const fields = Object.fromEntries(formData.entries());

    const parsedSpecializations = JSON.parse(fields.specializations as string);
    const parsedSkills = JSON.parse(fields.skills as string);
    const parsedLanguages = JSON.parse(fields.languages as string);
    const parsedShiftPreferences = JSON.parse(fields.shiftPreferences as string);

    // Update user main fields
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: fields.firstName as string,
        lastName: fields.lastName as string,
        dob: fields.dob ? new Date(fields.dob as string) : null,
        gender: fields.gender as string,
        contactNumber: fields.contactNumber as string,
        address: fields.address as string,
        licenseNumber: fields.licenseNumber as string,
        licenseExpiration: fields.licenseExpiration
          ? new Date(fields.licenseExpiration as string)
          : null,
        yearsOfExperience: parseInt(fields.yearsOfExperience as string, 10) || null,
        education: fields.education as string,
        specializations: parsedSpecializations,
        languages: parsedLanguages,
        shiftPreferences: parsedShiftPreferences,
        skills: {
          set: [],
          connect: parsedSkills
            .filter((skillName: string) => skillName !== null)
            .map((skillName: string) => ({ name: skillName })),
        },
      },
      include: {
        documents: true,
      },
    });

    // Handle experiences array
    const experiences: Array<{
      facilityName: string;
      position: string;
      department: string;
      startDate: Date | null;
      endDate: Date | null;
      responsibilities: string;
    }> = [];

    Object.keys(fields).forEach((key) => {
      const match = key.match(/^experiences\[(\d+)]\[(\w+)]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];

        if (!experiences[index]) {
          experiences[index] = {
            facilityName: '',
            position: '',
            department: '',
            startDate: null,
            endDate: null,
            responsibilities: '',
          };
        }
        
        // Map each field to the experience object
        if (field === 'facilityName') experiences[index].facilityName = fields[key] as string;
        if (field === 'position') experiences[index].position = fields[key] as string;
        if (field === 'department') experiences[index].department = fields[key] as string;
        if (field === 'startDate') experiences[index].startDate = new Date(fields[key] as string);
        if (field === 'endDate') experiences[index].endDate = new Date(fields[key] as string);
        if (field === 'responsibilities') experiences[index].responsibilities = fields[key] as string;
      }
    });

    // Update or create experiences in the database
    await prisma.experience.deleteMany({
      where: { userId: user.id },
    });

    await Promise.all(
      experiences.map((exp) =>
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

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
