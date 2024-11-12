// app/api/admin/nurses/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { User, Skill, Experience, Document } from "@prisma/client";

// Define the structure of the response
interface UserWithRelations extends User {
  skills: Skill[];
  experiences: Experience[];
  documents: Document[];
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  // Validate the ID
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json(
      { error: "Invalid user ID provided." },
      { status: 400 }
    );
  }

  try {
    // Fetch the user with related data
    const user: UserWithRelations | null = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        experiences: true,
        documents: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Nurse not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching nurse:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
