import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { Permission, Role, checkPermission } from '@/lib/permissions';

import { prisma } from '@/lib/prisma';
import { recordAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionRole = (session.user as any).role as Role | undefined;
    const userId = (session.user as any).id as string | undefined;
    const email = session.user?.email as string | undefined;

    let role: Role | undefined = sessionRole;
    if (!role) {
      const { prisma } = await import('@/lib/prisma');
      if (userId) {
        role = (await prisma.user.findUnique({ where: { id: userId }, select: { role: true } }))?.role as Role | undefined;
      } else if (email) {
        role = (await prisma.user.findUnique({ where: { email }, select: { role: true } }))?.role as Role | undefined;
      }
    }

    if (!role) return NextResponse.json({ error: 'Insufficient permissions or stale session' }, { status: 403 });

    if (!checkPermission(role, Permission.MANAGE_BACKUPS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Simple JSON snapshot backup of core tables
    const [users, settings, patients, appointments, invoices, prescriptions] = await Promise.all([
      prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true, updatedAt: true } }),
      prisma.systemSetting.findMany(),
      prisma.patient.findMany({ take: 1000 }),
      prisma.appointment.findMany({ take: 1000 }),
      prisma.invoice.findMany({ take: 1000 }),
      prisma.prescription.findMany({ take: 1000 }),
    ]);

    const payload = {
      createdAt: new Date().toISOString(),
      byUserId: (session.user as any).id,
      data: { users, settings, patients, appointments, invoices, prescriptions },
    };

    await recordAudit({
      userId: (session.user as any).id,
      action: 'BACKUP',
      entityType: 'Backup',
      entityId: null,
      newValues: { tables: Object.keys(payload.data) },
    });

    const blob = JSON.stringify(payload, null, 2);
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="backup-${Date.now()}.json"`,
      },
    });
  } catch (e) {
    console.error('POST /api/system/backup error', e);
    return NextResponse.json({ error: 'Failed to start backup' }, { status: 500 });
  }
}


