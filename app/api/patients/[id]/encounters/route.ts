import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const encounters = await prisma.encounter.findMany({ where: { patientId: params.id }, orderBy: { date: 'desc' }, take: 100 });
    return NextResponse.json(encounters);
  } catch (e) {
    console.error('GET /api/patients/[id]/encounters error', e);
    return NextResponse.json({ error: 'Failed to fetch encounters' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (!body.type) return NextResponse.json({ error: 'type is required' }, { status: 400 });
    const created = await prisma.encounter.create({
      data: {
        patientId: params.id,
        date: body.date ? new Date(body.date) : new Date(),
        type: body.type,
        reason: body.reason ?? null,
        diagnosis: body.diagnosis ?? null,
        notes: body.notes ?? null,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/patients/[id]/encounters error', e);
    return NextResponse.json({ error: 'Failed to create encounter' }, { status: 500 });
  }
}


