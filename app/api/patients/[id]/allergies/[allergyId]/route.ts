import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; allergyId: string } }
) {
  try {
    // Verify the allergy belongs to the patient
    const allergy = await prisma.allergy.findFirst({
      where: {
        id: params.allergyId,
        patientId: params.id,
      },
    });

    if (!allergy) {
      return NextResponse.json(
        { error: 'Allergy not found or does not belong to this patient' },
        { status: 404 }
      );
    }

    // Delete the allergy
    await prisma.allergy.delete({
      where: {
        id: params.allergyId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/patients/[id]/allergies/[allergyId] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete allergy' },
      { status: 500 }
    );
  }
}
