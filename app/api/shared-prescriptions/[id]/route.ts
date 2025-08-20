import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    // Verify ownership
    const existingSharedPrescription = await prisma.sharedPrescription.findFirst({
      where: {
        id: params.id,
        sharedBy: userId,
      },
    });

    if (!existingSharedPrescription) {
      return NextResponse.json(
        { error: 'Shared prescription not found or access denied' },
        { status: 404 }
      );
    }

    const updatedSharedPrescription = await prisma.sharedPrescription.update({
      where: { id: params.id },
      data: {
        accessCode: body.accessCode !== undefined ? body.accessCode : existingSharedPrescription.accessCode,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : existingSharedPrescription.expiresAt,
        maxViews: body.maxViews !== undefined ? body.maxViews : existingSharedPrescription.maxViews,
        allowDownload: body.allowDownload !== undefined ? body.allowDownload : existingSharedPrescription.allowDownload,
        allowPrint: body.allowPrint !== undefined ? body.allowPrint : existingSharedPrescription.allowPrint,
        shareType: body.shareType || existingSharedPrescription.shareType,
        isActive: body.isActive !== undefined ? body.isActive : existingSharedPrescription.isActive,
      },
      include: {
        prescription: {
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                medicalRecordNumber: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        views: {
          orderBy: {
            viewedAt: 'desc',
          },
          take: 5,
        },
      },
    });

    return NextResponse.json(updatedSharedPrescription);
  } catch (error) {
    console.error('PUT /api/shared-prescriptions/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update shared prescription' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // Verify ownership
    const existingSharedPrescription = await prisma.sharedPrescription.findFirst({
      where: {
        id: params.id,
        sharedBy: userId,
      },
    });

    if (!existingSharedPrescription) {
      return NextResponse.json(
        { error: 'Shared prescription not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the shared prescription and all its views
    await prisma.$transaction([
      prisma.sharedPrescriptionView.deleteMany({
        where: { sharedPrescriptionId: params.id },
      }),
      prisma.sharedPrescription.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json({ message: 'Shared prescription deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/shared-prescriptions/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete shared prescription' },
      { status: 500 }
    );
  }
}
