import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission, Role, checkPermission } from '@/lib/permissions';

export async function GET() {
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

    const items = await prisma.systemSetting.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error('GET /api/system/settings error', e);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const { key, value, description, category, isPublic } = body ?? {};
    if (!key || value === undefined) return NextResponse.json({ error: 'key and value are required' }, { status: 400 });

    const created = await prisma.systemSetting.create({
      data: {
        key,
        value: String(value),
        description: description ?? null,
        category: category ?? null,
        isPublic: Boolean(isPublic ?? false),
        updatedById: (session.user as any).id,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/system/settings error', e);
    return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 });
  }
}


