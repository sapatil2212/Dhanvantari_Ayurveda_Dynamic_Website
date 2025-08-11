import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const items = await prisma.lifestyle.findMany({
      where: { patientId: params.id },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error('GET /api/patients/[id]/lifestyle error', e);
    return NextResponse.json({ error: 'Failed to fetch lifestyle entries' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const created = await prisma.lifestyle.create({
      data: {
        patientId: params.id,
        smoking: body.smoking ?? null,
        alcohol: body.alcohol ?? null,
        exercise: body.exercise ?? null,
        diet: body.diet ?? null,
        occupation: body.occupation ?? null,
        stressLevel: body.stressLevel ?? null,
        sleepHours: body.sleepHours ?? null,
        notes: body.notes ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/patients/[id]/lifestyle error', e);
    return NextResponse.json({ error: 'Failed to create lifestyle entry' }, { status: 500 });
  }
}


