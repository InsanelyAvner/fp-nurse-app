// File: /app/api/skills/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
