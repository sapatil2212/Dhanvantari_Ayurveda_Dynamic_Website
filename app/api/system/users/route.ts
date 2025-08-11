import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission, Role, checkPermission } from '@/lib/permissions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Resolve role from session or DB (handles stale sessions)
    const sessionRole = (session.user as any).role as Role | undefined;
    const userId = (session.user as any).id as string | undefined;
    const email = session.user?.email as string | undefined;

    let role: Role | undefined = sessionRole;
    if (!role) {
      if (userId) {
        role = (await prisma.user.findUnique({ where: { id: userId }, select: { role: true } }))?.role as Role | undefined;
      } else if (email) {
        role = (await prisma.user.findUnique({ where: { email }, select: { role: true } }))?.role as Role | undefined;
      }
    }

    if (!role) return NextResponse.json({ error: 'Insufficient permissions or stale session' }, { status: 403 });

    if (!checkPermission(role, Permission.VIEW_USERS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const items = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, isActive: true }
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error('GET /api/system/users error', e);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}


