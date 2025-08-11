import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const items = await prisma.familyHistory.findMany({
      where: { patientId: params.id },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error('GET /api/patients/[id]/family-history error', e);
    return NextResponse.json({ error: 'Failed to fetch family history' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (!body.relation || !body.condition) {
      return NextResponse.json({ error: 'relation and condition are required' }, { status: 400 });
    }
    const created = await prisma.familyHistory.create({
      data: {
        patientId: params.id,
        relation: body.relation,
        condition: body.condition,
        ageAtOnset: body.ageAtOnset ?? null,
        outcome: body.outcome ?? null,
        notes: body.notes ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/patients/[id]/family-history error', e);
    return NextResponse.json({ error: 'Failed to create family history entry' }, { status: 500 });
  }
}


