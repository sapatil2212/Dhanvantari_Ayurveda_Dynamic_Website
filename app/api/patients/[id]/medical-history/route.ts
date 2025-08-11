import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const items = await prisma.medicalHistory.findMany({
      where: { patientId: params.id },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error('GET /api/patients/[id]/medical-history error', e);
    return NextResponse.json({ error: 'Failed to fetch medical history' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (!body.condition) {
      return NextResponse.json({ error: 'condition is required' }, { status: 400 });
    }
    const created = await prisma.medicalHistory.create({
      data: {
        patientId: params.id,
        condition: body.condition,
        diagnosis: body.diagnosis ?? null,
        treatment: body.treatment ?? null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        isOngoing: Boolean(body.isOngoing) ?? false,
        notes: body.notes ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/patients/[id]/medical-history error', e);
    return NextResponse.json({ error: 'Failed to create medical history entry' }, { status: 500 });
  }
}


