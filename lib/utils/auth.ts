// utils/auth.ts

import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';
import prisma from '@/lib/db';

export async function getUserFromToken(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    const userId = payload.user?.id;

    if (!userId) return null;

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
