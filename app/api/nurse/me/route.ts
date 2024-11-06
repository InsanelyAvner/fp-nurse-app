// app/api/nurse/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/utils/auth'; // Adjust the path as necessary

export async function GET(req: NextRequest) {
  try {
    // Get the logged-in user
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Respond with user information
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      experience: user.experience,
      certifications: user.certifications,
      skills: user.skills.map(skill => skill.name),
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle non-GET requests
export async function POST() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
