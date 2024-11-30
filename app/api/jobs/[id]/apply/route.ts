// app/api/jobs/[id]/apply/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromToken } from "@/lib/utils/auth";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function filterNurseData(user: any) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    specialization: user.specialization,
    availableWorkDays: user.availableWorkDays,
    frequencyOfWork: user.frequencyOfWork,
    preferredFacilityType: user.preferredFacilityType,
    experiences: user.experiences.map((exp: any) => ({
      facilityName: exp.facilityName,
      position: exp.position,
      department: exp.department,
      startDate: exp.startDate,
      endDate: exp.endDate,
    })),
  };
}

// Mock AI model function to calculate matching score
async function getMatchingScore(
  nurseProfile: any,
  jobDetails: any
): Promise<number> {
  const PROMPT = `
  You are a nurse-matching algorithm designed to evaluate the compatibility between a nurse and a job posting. Your task is to analyze the following nurse data and job details to calculate a matching score between **0 and 100**, where **0** means no match and **100** means a perfect match.

  **Instructions:**

  - Evaluate the nurse's qualifications, experience, availability, and preferences against the job requirements.
  - Consider factors such as specialization, work experience, available workdays, preferred facility type, required skills, and any other relevant details.
  - Ensure the scoring is **non-biased**, accurate, and reliable.
  - **Output only the matching score as a whole number between 0 and 100. Do not include any additional text or explanation.**
  - YOU ARE NOT TO WRITE THE CODE, YOU ARE TO OUTPUT A MATCHING SCORE!!!

  **Nurse Data:**
  ${JSON.stringify(filterNurseData(nurseProfile))}

  **Job Details:**
  ${JSON.stringify(jobDetails)}
  `

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: PROMPT,
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  const matchingScoreString = chatCompletion.choices[0]?.message?.content || ""
  const matchingScore = parseInt(matchingScoreString);

  console.log(chatCompletion.choices[0]?.message?.content || "");

  // Ensure the score is between 0 and 100
  return Math.min(Math.max(matchingScore, 0), 100);
}

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  const { id } = await params;
  const jobId = parseInt(params.id, 10);

  if (isNaN(jobId)) {
    return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
  }

  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "USER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Check if the job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { requiredSkills: true },
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    if (job.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Job is not active" },
        { status: 400 }
      );
    }

    // Check if the application already exists using the correct unique constraint name
    const existingApplication = await prisma.application.findUnique({
      where: {
        user_job_unique: {
          // Corrected constraint name
          userId: user.id,
          jobId: jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied for this job" },
        { status: 400 }
      );
    }

    // Fetch user's skills
    const userWithSkills = await prisma.user.findUnique({
      where: { id: user.id },
      include: { skills: true },
    });

    if (!userWithSkills) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const nurseSkills = userWithSkills.skills.map((skill) => skill.name);
    const jobRequiredSkills = job.requiredSkills.map((skill) => skill.name);

    // Get matching score from AI model (mocked)
    const matchingScore = await getMatchingScore(user, job);

    // Save the application in the database
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        jobId: jobId,
        status: "APPLIED",
        matchingScore: matchingScore,
      },
    });

    // Create a notification for the nurse
    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `You have successfully applied for the "${job.title}" position at "${job.facility}". Your matching score is ${matchingScore}%.`,
      },
    });

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
