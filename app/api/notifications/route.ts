import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since'); // ISO string
    const take = Number(searchParams.get('take') ?? 10);
    
    const where: any = {
      OR: [
        { userId: session.user.id },
        { userId: null } // System-wide notifications
      ]
    };
    
    if (since) {
      where.createdAt = { gt: new Date(since) };
    }

    const [items, unreadCount] = await Promise.all([
      prisma.notification.findMany({ 
        where, 
        orderBy: { createdAt: 'desc' }, 
        take 
      }),
      prisma.notification.count({
        where: {
          ...where,
          isRead: false
        }
      })
    ]);

    return NextResponse.json({ items, unreadCount });
  } catch (e) {
    console.error('Failed to fetch notifications:', e);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}


