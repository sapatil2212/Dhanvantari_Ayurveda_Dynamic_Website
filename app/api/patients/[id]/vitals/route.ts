import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const vitals = await prisma.vital.findMany({ where: { patientId: params.id }, orderBy: { recordedAt: 'desc' }, take: 100 });
    return NextResponse.json(vitals);
  } catch (e) {
    console.error('GET /api/patients/[id]/vitals error', e);
    return NextResponse.json({ error: 'Failed to fetch vitals' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const created = await prisma.vital.create({
      data: {
        patientId: params.id,
        recordedAt: body.recordedAt ? new Date(body.recordedAt) : new Date(),
        heightCm: body.heightCm ?? null,
        weightKg: body.weightKg ?? null,
        temperatureC: body.temperatureC ?? null,
        pulseBpm: body.pulseBpm ?? null,
        systolicMmHg: body.systolicMmHg ?? null,
        diastolicMmHg: body.diastolicMmHg ?? null,
        respiratoryRpm: body.respiratoryRpm ?? null,
        spo2Percent: body.spo2Percent ?? null,
        bmi: body.bmi ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/patients/[id]/vitals error', e);
    return NextResponse.json({ error: 'Failed to create vital' }, { status: 500 });
  }
}


