// app/api/admin/applications/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth';
import { Role, ApplicationStatus } from '@prisma/client';

// Define the structure of the request body
interface UpdateApplicationStatusRequest {
  status: 'ACCEPTED' | 'REJECTED';
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  // Validate the ID
  const applicationId = parseInt(id, 10);
  if (isNaN(applicationId)) {
    return NextResponse.json(
      { error: 'Invalid application ID provided.' },
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

    // Parse and validate the request body
    const body: UpdateApplicationStatusRequest = await req.json();

    if (!body.status || !['ACCEPTED', 'REJECTED'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status provided. Must be ACCEPTED or REJECTED.' },
        { status: 400 }
      );
    }

    // Fetch the current application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found.' },
        { status: 404 }
      );
    }

    // Prevent status update if already ACCEPTED or REJECTED
    if (
      application.status === ApplicationStatus.ACCEPTED ||
      application.status === ApplicationStatus.REJECTED
    ) {
      return NextResponse.json(
        { error: `Cannot update application. Current status is ${application.status}.` },
        { status: 400 }
      );
    }

    // Update the application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: body.status as ApplicationStatus,
        updatedAt: new Date(),
      },
    });

    // Optionally, you can send a notification to the user about the status change here.

    return NextResponse.json(
      { message: `Application has been ${body.status.toLowerCase()}.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}
