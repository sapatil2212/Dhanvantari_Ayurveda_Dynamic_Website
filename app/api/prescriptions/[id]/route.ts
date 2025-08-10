import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: params.id },
      include: {
        patient: true,
        items: true,
        encounter: true,
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prescription);
  } catch (error) {
    console.error('GET /api/prescriptions/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescription' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Update prescription
    const updated = await prisma.prescription.update({
      where: { id: params.id },
      data: {
        diagnosis: body.diagnosis ?? null,
        notes: body.notes ?? null,
        advice: body.advice ?? null,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        prescriberName: body.prescriberName,
        prescriberRegNo: body.prescriberRegNo ?? null,
      },
    });

    // Update prescription items if provided
    if (body.items && Array.isArray(body.items)) {
      // Delete existing items
      await prisma.prescriptionItem.deleteMany({
        where: { prescriptionId: params.id },
      });

      // Create new items
      await prisma.prescriptionItem.createMany({
        data: body.items.map((item: any) => ({
          prescriptionId: params.id,
          medicineName: item.medicineName,
          strength: item.strength ?? null,
          dosage: item.dosage ?? null,
          frequency: item.frequency ?? null,
          route: item.route ?? null,
          durationDays: item.durationDays ? Number(item.durationDays) : null,
          instructions: item.instructions ?? null,
        })),
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/prescriptions/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update prescription' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete prescription items first
    await prisma.prescriptionItem.deleteMany({
      where: { prescriptionId: params.id },
    });

    // Delete prescription
    await prisma.prescription.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/prescriptions/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete prescription' },
      { status: 500 }
    );
  }
}


