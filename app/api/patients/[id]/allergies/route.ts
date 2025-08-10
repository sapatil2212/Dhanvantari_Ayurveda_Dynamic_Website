import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const items = await prisma.allergy.findMany({ where: { patientId: params.id }, orderBy: { recordedAt: 'desc' } });
    return NextResponse.json(items);
  } catch (e) {
    console.error('GET /api/patients/[id]/allergies error', e);
    return NextResponse.json({ error: 'Failed to fetch allergies' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (!body.substance) return NextResponse.json({ error: 'substance is required' }, { status: 400 });
    const created = await prisma.allergy.create({
      data: {
        patientId: params.id,
        substance: body.substance,
        reaction: body.reaction ?? null,
        severity: body.severity ?? null,
        notes: body.notes ?? null,
        recordedAt: body.recordedAt ? new Date(body.recordedAt) : new Date(),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/patients/[id]/allergies error', e);
    return NextResponse.json({ error: 'Failed to create allergy' }, { status: 500 });
  }
}


