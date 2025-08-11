import { NextRequest, NextResponse } from 'next/server';
import { recordAudit } from '@/lib/audit';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission, Role, checkPermission } from '@/lib/permissions';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

    if (!checkPermission(role, Permission.MANAGE_SETTINGS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { value } = body ?? {};
    if (value === undefined) return NextResponse.json({ error: 'value is required' }, { status: 400 });

    const before = await prisma.systemSetting.findUnique({ where: { id: params.id } });
    const updated = await prisma.systemSetting.update({
      where: { id: params.id },
      data: { value: String(value), updatedById: session.user.id },
    });
    await recordAudit({
      userId: (session.user as any).id,
      action: 'UPDATE',
      entityType: 'SystemSetting',
      entityId: params.id,
      oldValues: before ? { value: before.value } : null,
      newValues: { value: updated.value },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('PATCH /api/system/settings/[id] error', e);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
    if (!checkPermission(role, Permission.MANAGE_SETTINGS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const before = await prisma.systemSetting.findUnique({ where: { id: params.id } });
    await prisma.systemSetting.delete({ where: { id: params.id } });
    await recordAudit({
      userId: (session.user as any).id,
      action: 'DELETE',
      entityType: 'SystemSetting',
      entityId: params.id,
      oldValues: before ? { key: before.key, value: before.value } : null,
      newValues: null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/system/settings/[id] error', e);
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 });
  }
}


