import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

async function genNumber() {
  // Get the current year
  const currentYear = new Date().getFullYear();
  
  // Count existing prescriptions for this year
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
  
  const count = await prisma.prescription.count({
    where: {
      createdAt: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
  });
  
  // Generate prescription number: RX-YYYY-XXXXX (e.g., RX-2025-00001)
  const sequenceNumber = (count + 1).toString().padStart(5, '0');
  return `RX-${currentYear}-${sequenceNumber}`;
}
function genShare() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId') ?? undefined;
  const where: any = {};
  if (patientId) where.patientId = patientId;
  const items = await prisma.prescription.findMany({ 
    where, 
    orderBy: { date: 'desc' }, 
    include: { 
      items: true,
      patient: true 
    } 
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const body = await request.json();
    if (!body.patientId || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'patientId and items are required' }, { status: 400 });
    }
    
    // Generate unique prescription number
    const prescriptionNumber = await genNumber();
    
    const created = await prisma.prescription.create({
      data: {
        number: prescriptionNumber,
        shareCode: genShare(),
        patientId: body.patientId,
        encounterId: body.encounterId ?? null,
        date: body.date ? new Date(body.date) : new Date(),
        diagnosis: body.diagnosis ?? null,
        notes: body.notes ?? null,
        advice: body.advice ?? null,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        prescriberName: body.prescriberName ?? null,
        prescriberRegNo: body.prescriberRegNo ?? null,
        createdById: userId,
        items: {
          create: body.items.map((it: any) => ({
            medicineName: it.medicineName,
            strength: it.strength ?? null,
            dosage: it.dosage ?? null,
            frequency: it.frequency ?? null,
            route: it.route ?? null,
            durationDays: it.durationDays ? Number(it.durationDays) : null,
            instructions: it.instructions ?? null,
          })),
        },
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/prescriptions error', e);
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 });
  }
}


