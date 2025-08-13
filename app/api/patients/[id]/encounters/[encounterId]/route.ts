import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; encounterId: string } }
) {
  try {
    // Verify the encounter belongs to the patient
    const encounter = await prisma.encounter.findFirst({
      where: {
        id: params.encounterId,
        patientId: params.id,
      },
    });

    if (!encounter) {
      return NextResponse.json(
        { error: 'Encounter not found or does not belong to this patient' },
        { status: 404 }
      );
    }

    // Delete the encounter
    await prisma.encounter.delete({
      where: {
        id: params.encounterId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/patients/[id]/encounters/[encounterId] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete encounter' },
      { status: 500 }
    );
  }
}
