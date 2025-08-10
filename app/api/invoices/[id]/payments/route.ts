import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const items = await prisma.payment.findMany({ where: { invoiceId: params.id }, orderBy: { paidAt: 'desc' } });
    return NextResponse.json(items);
  } catch (e) {
    console.error('GET /api/invoices/[id]/payments error', e);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    let body: any;
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      body = await request.json();
    } else {
      const form = await request.formData();
      body = {
        amount: Number(form.get('amount')),
        method: String(form.get('method') || ''),
      };
    }
    if (!body.amount || !body.method) return NextResponse.json({ error: 'amount and method required' }, { status: 400 });
    const created = await prisma.payment.create({
      data: {
        invoiceId: params.id,
        amount: body.amount,
        method: body.method,
        paidAt: body.paidAt ? new Date(body.paidAt) : new Date(),
        notes: body.notes ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/invoices/[id]/payments error', e);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}


