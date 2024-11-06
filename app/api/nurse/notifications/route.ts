// app/api/nurse/notifications/route.ts

import prisma from '@/lib/db';
import { getUserFromToken } from '@/lib/utils/auth'; // Utility function to extract user from JWT
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the logged-in user
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch recent notifications for the user
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 10, // Limit to recent 10 notifications
    });

    // Map notifications to the format expected by the frontend
    const notificationsData = notifications.map((notification) => ({
      id: notification.id,
      message: notification.message,
      timestamp: notification.timestamp.toISOString(),
    }));

    return NextResponse.json(notificationsData, { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
