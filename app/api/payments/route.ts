import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '30';
    const method = searchParams.get('method') || 'all';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Build where clause
    const where: any = {
      paidAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (method !== 'all') {
      where.method = method;
    }

    // Fetch payments with related data
    const payments = await prisma.payment.findMany({
      where,
      include: {
        invoice: {
          include: {
            patient: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        paidAt: 'desc',
      },
    });

    // Transform data for frontend
    const transformedPayments = payments.map(payment => ({
      id: payment.id,
      amount: Number(payment.amount),
      method: payment.method,
      paidAt: payment.paidAt.toISOString(),
      invoiceNumber: payment.invoice.number,
      patientName: `${payment.invoice.patient.firstName} ${payment.invoice.patient.lastName}`,
      status: 'completed',
    }));

    console.log(`Payments API: Returning ${transformedPayments.length} payments, total amount: ${transformedPayments.reduce((sum, p) => sum + p.amount, 0)}`);

    const response = NextResponse.json(transformedPayments);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (e) {
    console.error('GET /api/payments error', e);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
