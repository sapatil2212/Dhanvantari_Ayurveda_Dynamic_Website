import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { generateShareCode } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const prescriptionId = searchParams.get('prescriptionId');
    const isActive = searchParams.get('isActive');

    const where: any = {
      sharedBy: userId,
    };

    if (prescriptionId) {
      where.prescriptionId = prescriptionId;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const sharedPrescriptions = await prisma.sharedPrescription.findMany({
      where,
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
          take: 5, // Get last 5 views
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(sharedPrescriptions);
  } catch (error) {
    console.error('GET /api/shared-prescriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shared prescriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    if (!body.prescriptionId) {
      return NextResponse.json(
        { error: 'Prescription ID is required' },
        { status: 400 }
      );
    }

    // Verify the prescription exists and user has access
    const prescription = await prisma.prescription.findFirst({
      where: {
        id: body.prescriptionId,
        OR: [
          { createdById: userId },
          { encounter: { createdById: userId } },
        ],
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found or access denied' },
        { status: 404 }
      );
    }

    // Generate unique share code
    const shareCode = generateShareCode();
    
    // Calculate expiry date (default 30 days)
    const expiresAt = body.expiresAt 
      ? new Date(body.expiresAt)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const sharedPrescription = await prisma.sharedPrescription.create({
      data: {
        prescriptionId: body.prescriptionId,
        shareCode,
        accessCode: body.accessCode || null,
        expiresAt,
        maxViews: body.maxViews || null,
        allowDownload: body.allowDownload !== undefined ? body.allowDownload : true,
        allowPrint: body.allowPrint !== undefined ? body.allowPrint : true,
        shareType: body.shareType || 'PUBLIC',
        sharedBy: userId,
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
      },
    });

    return NextResponse.json(sharedPrescription, { status: 201 });
  } catch (error) {
    console.error('POST /api/shared-prescriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to create shared prescription' },
      { status: 500 }
    );
  }
}
