import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  const rx = await prisma.prescription.findFirst({ where: { shareCode: params.code }, include: { items: true, patient: true } });
  if (!rx) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rx);
}


