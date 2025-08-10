import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') ?? undefined;
    const where: any = {};
    if (patientId) where.patientId = patientId;
    const items = await prisma.invoice.findMany({ 
      where, 
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { date: 'desc' } 
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error('GET /api/invoices error', e);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.patientId || !body.items) return NextResponse.json({ error: 'patientId and items required' }, { status: 400 });
    const number = `INV-${Date.now()}`;
    
    // Store GST and offer information in the items JSON along with the items
    const itemsWithMetadata = {
      items: body.items,
      gstApplicable: body.gstApplicable || false,
      gstPercentage: body.gstPercentage || 0,
      gstAmount: body.gstAmount || 0,
      offerApplicable: body.offerApplicable || false,
      offerPercentage: body.offerPercentage || 0,
      discountAmount: body.discountAmount || 0,
      amountAfterDiscount: body.amountAfterDiscount || body.subtotal,
    };
    
    const created = await prisma.invoice.create({
      data: {
        patientId: body.patientId,
        number,
        items: itemsWithMetadata,
        subtotal: body.subtotal,
        tax: body.gstAmount || 0, // Store GST amount in tax field
        discount: body.discountAmount || 0, // Store discount amount in discount field
        total: body.total,
        notes: body.notes ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/invoices error', e);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}


