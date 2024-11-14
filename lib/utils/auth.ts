// utils/auth.ts

import { NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';
import prisma from '@/lib/db';
import { Role, Specialization, ApplicationStatus } from '@prisma/client';

export interface UserPayload extends JWTPayload {
  user: {
    id: number;
  };
}

export async function getUserFromToken(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret, {
      algorithms: ['HS256'],
    }) as { payload: UserPayload };

    const userId = payload.user?.id;

    if (!userId) return null;

    // Fetch the user from the database with necessary relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        experiences: true,
        applications: true,
        notifications: true,
        shifts: true,
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
