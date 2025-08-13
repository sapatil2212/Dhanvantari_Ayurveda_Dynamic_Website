import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; vitalId: string } }
) {
  try {
    // Verify the vital belongs to the patient
    const vital = await prisma.vital.findFirst({
      where: {
        id: params.vitalId,
        patientId: params.id,
      },
    });

    if (!vital) {
      return NextResponse.json(
        { error: 'Vital not found or does not belong to this patient' },
        { status: 404 }
      );
    }

    // Delete the vital
    await prisma.vital.delete({
      where: {
        id: params.vitalId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/patients/[id]/vitals/[vitalId] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete vital' },
      { status: 500 }
    );
  }
}
