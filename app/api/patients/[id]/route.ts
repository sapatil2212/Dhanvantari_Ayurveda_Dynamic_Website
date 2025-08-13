import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        vitals: { orderBy: { recordedAt: 'desc' }, take: 5 },
        encounters: { orderBy: { date: 'desc' }, take: 10 },
        invoices: { orderBy: { date: 'desc' }, take: 10, include: { payments: true } },
        appointments: { orderBy: { preferredDate: 'desc' }, take: 10 },
        allergies: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(patient);
  } catch (e) {
    console.error('GET /api/patients/[id] error', e);
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const allowed = [
      'firstName','lastName','middleName','dateOfBirth','gender','email','phone','alternatePhone','addressLine1','addressLine2','city','state','postalCode','country','bloodType','maritalStatus','occupation','emergencyContactName','emergencyContactPhone','notes'
    ] as const;
    const data: any = {};
    for (const key of allowed) {
      if (key in body) {
        if (key === 'dateOfBirth') data.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null;
        else data[key] = body[key];
      }
    }
    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'No valid fields' }, { status: 400 });
    const updated = await prisma.patient.update({ where: { id: params.id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('PATCH /api/patients/[id] error', e);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.patient.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/patients/[id] error', e);
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}


