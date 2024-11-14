// app/api/jobs/[id]/applicants/[applicantId]/action/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth';
import { Role, ApplicationStatus } from '@prisma/client';

// Define the structure of the request body
interface ActionRequestBody {
  action: 'accept' | 'reject';
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; applicantId: string } }
): Promise<NextResponse> {
  const { id, applicantId } = params;

  // Validate the IDs
  const parsedJobId = parseInt(id, 10);
  const parsedUserId = parseInt(applicantId, 10); // Renamed for clarity

  if (isNaN(parsedJobId) || isNaN(parsedUserId)) {
    return NextResponse.json(
      { error: 'Invalid job ID or applicant ID provided.' },
      { status: 400 }
    );
  }

  // Parse the request body
  let body: ActionRequestBody;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    );
  }

  const { action } = body;

  if (!['accept', 'reject'].includes(action)) {
    return NextResponse.json(
      { error: 'Invalid action. Must be either "accept" or "reject".' },
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

    // Fetch the application using the unique constraint (userId + jobId)
    const application = await prisma.application.findUnique({
      where: {
        user_job_unique: {
          userId: parsedUserId,
          jobId: parsedJobId,
        },
      },
      include: {
        job: true,
        user: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found for the specified job and applicant.' },
        { status: 404 }
      );
    }

    // Check if the application is already processed
    if (
      application.status === ApplicationStatus.ACCEPTED ||
      application.status === ApplicationStatus.REJECTED
    ) {
      return NextResponse.json(
        { error: 'Application has already been processed.' },
        { status: 400 }
      );
    }

    // Update the application status
    const updatedStatus =
      action === 'accept'
        ? ApplicationStatus.ACCEPTED
        : ApplicationStatus.REJECTED;

    await prisma.application.update({
      where: {
        user_job_unique: {
          userId: parsedUserId,
          jobId: parsedJobId,
        },
      },
      data: { status: updatedStatus },
    });

    // Optional: Notify the applicant about the status change
    // You can implement a notification system here

    return NextResponse.json(
      { message: `Application ${action}ed successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing application action:', error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}
