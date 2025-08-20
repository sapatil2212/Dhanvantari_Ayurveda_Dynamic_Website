import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const medicine = await prisma.medicine.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!medicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(medicine);
  } catch (error) {
    console.error('GET /api/medicines/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medicine' },
      { status: 500 }
    );
  }
}

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

    if (!body.name) {
      return NextResponse.json(
        { error: 'Medicine name is required' },
        { status: 400 }
      );
    }

    const existingMedicine = await prisma.medicine.findUnique({
      where: { id: params.id },
    });

    if (!existingMedicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    const updatedMedicine = await prisma.medicine.update({
      where: { id: params.id },
      data: {
        name: body.name,
        genericName: body.genericName || null,
        brandName: body.brandName || null,
        category: body.category,
        type: body.type,
        strength: body.strength || null,
        dosageForm: body.dosageForm || null,
        route: body.route || null,
        manufacturer: body.manufacturer || null,
        description: body.description || null,
        indications: body.indications || null,
        contraindications: body.contraindications || null,
        sideEffects: body.sideEffects || null,
        interactions: body.interactions || null,
        dosage: body.dosage || null,
        storage: body.storage || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        isPrescription: body.isPrescription !== undefined ? body.isPrescription : true,
        isControlled: body.isControlled !== undefined ? body.isControlled : false,
        updatedById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMedicine);
  } catch (error) {
    console.error('PUT /api/medicines/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update medicine' },
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

    const existingMedicine = await prisma.medicine.findUnique({
      where: { id: params.id },
    });

    if (!existingMedicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Check if medicine is being used in any prescriptions
    const prescriptionItems = await prisma.prescriptionItem.findMany({
      where: {
        medicineName: existingMedicine.name,
      },
      take: 1,
    });

    if (prescriptionItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete medicine as it is being used in prescriptions. Consider deactivating it instead.' },
        { status: 400 }
      );
    }

    await prisma.medicine.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/medicines/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete medicine' },
      { status: 500 }
    );
  }
}
