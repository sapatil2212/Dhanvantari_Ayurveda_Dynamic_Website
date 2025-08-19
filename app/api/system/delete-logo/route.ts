import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { Permission, Role, checkPermission } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionRole = (session.user as any).role as Role | undefined;
    const userId = (session.user as any).id as string | undefined;
    const userEmail = session.user?.email as string | undefined;

    let role: Role | undefined = sessionRole;
    if (!role) {
      if (userId) {
        role = (await prisma.user.findUnique({ where: { id: userId }, select: { role: true } }))?.role as Role | undefined;
      } else if (userEmail) {
        role = (await prisma.user.findUnique({ where: { email: userEmail }, select: { role: true } }))?.role as Role | undefined;
      }
    }
    if (!role) return NextResponse.json({ error: 'Insufficient permissions or stale session' }, { status: 403 });
    if (!checkPermission(role, Permission.MANAGE_SETTINGS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ 
      success: true, 
      message: 'Logo deleted successfully',
      result 
    });

  } catch (e) {
    console.error('DELETE /api/system/delete-logo error', e);
    return NextResponse.json({ error: 'Failed to delete logo' }, { status: 500 });
  }
}
