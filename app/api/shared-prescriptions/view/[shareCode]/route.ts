import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { shareCode: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const accessCode = searchParams.get('accessCode');
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Find the shared prescription
    const sharedPrescription = await prisma.sharedPrescription.findUnique({
      where: { shareCode: params.shareCode },
      include: {
        prescription: {
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                dateOfBirth: true,
                gender: true,
                medicalRecordNumber: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                specialization: true,
                licenseNumber: true,
              },
            },
            items: {
              orderBy: {
                id: 'asc',
              },
            },
          },
        },
      },
    });

    if (!sharedPrescription) {
      return NextResponse.json(
        { error: 'Shared prescription not found' },
        { status: 404 }
      );
    }

    // Check if it's active
    if (!sharedPrescription.isActive) {
      return NextResponse.json(
        { error: 'This shared prescription is no longer active' },
        { status: 410 }
      );
    }

    // Check if it has expired
    if (sharedPrescription.expiresAt && new Date() > sharedPrescription.expiresAt) {
      return NextResponse.json(
        { error: 'This shared prescription has expired' },
        { status: 410 }
      );
    }

    // Check access code if required
    if (sharedPrescription.accessCode && sharedPrescription.accessCode !== accessCode) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 403 }
      );
    }

    // Check view limit
    if (sharedPrescription.maxViews && sharedPrescription.currentViews >= sharedPrescription.maxViews) {
      return NextResponse.json(
        { error: 'Maximum view limit reached for this shared prescription' },
        { status: 429 }
      );
    }

    // Record the view
    await prisma.$transaction([
      prisma.sharedPrescriptionView.create({
        data: {
          sharedPrescriptionId: sharedPrescription.id,
          ipAddress,
          userAgent,
        },
      }),
      prisma.sharedPrescription.update({
        where: { id: sharedPrescription.id },
        data: {
          currentViews: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      sharedPrescription,
      allowDownload: sharedPrescription.allowDownload,
      allowPrint: sharedPrescription.allowPrint,
    });
  } catch (error) {
    console.error('GET /api/shared-prescriptions/view/[shareCode] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shared prescription' },
      { status: 500 }
    );
  }
}
