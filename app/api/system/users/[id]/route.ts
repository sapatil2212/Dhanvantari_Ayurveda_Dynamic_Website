import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission, Role, checkPermission } from '@/lib/permissions';
import { recordAudit } from '@/lib/audit';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionRole = (session.user as any).role as Role | undefined;
    const userId = (session.user as any).id as string | undefined;
    const email = session.user?.email as string | undefined;

    let userRole: Role | undefined = sessionRole;
    if (!userRole) {
      if (userId) {
        userRole = (await prisma.user.findUnique({ where: { id: userId }, select: { role: true } }))?.role as Role | undefined;
      } else if (email) {
        userRole = (await prisma.user.findUnique({ where: { email }, select: { role: true } }))?.role as Role | undefined;
      }
    }

    if (!userRole) return NextResponse.json({ error: 'Insufficient permissions or stale session' }, { status: 403 });

    if (!checkPermission(userRole, Permission.MANAGE_ROLES)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { role } = body ?? {};
    if (!role) return NextResponse.json({ error: 'role is required' }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: { id: true, role: true }
    });

    await recordAudit({
      userId: (session.user as any).id,
      action: 'ROLE_CHANGE',
      entityType: 'User',
      entityId: params.id,
      oldValues: null,
      newValues: { role },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('PATCH /api/system/users/[id] error', e);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}


