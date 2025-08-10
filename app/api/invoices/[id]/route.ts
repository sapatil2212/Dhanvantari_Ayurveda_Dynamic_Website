import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { payments: true, patient: true },
    });
    
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    return NextResponse.json(invoice);
  } catch (e) {
    console.error('GET /api/invoices/[id] error', e);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    // Handle status-only updates (from status manager)
    if (body.status && Object.keys(body).length === 1) {
      if (!['PENDING', 'PARTIAL', 'PAID', 'CANCELLED'].includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      
      const updated = await prisma.invoice.update({
        where: { id: params.id },
        data: { status: body.status },
      });
      
      return NextResponse.json(updated);
    }
    
    // Handle full invoice updates (from edit form)
    const { items, subtotal, tax, discount, total, notes, status } = body;
    
    if (!items || typeof subtotal !== 'number' || typeof total !== 'number') {
      return NextResponse.json({ error: 'Invalid invoice data' }, { status: 400 });
    }
    
    // Validate status if provided
    if (status && !['PENDING', 'PARTIAL', 'PAID', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    // Get current invoice with payments to check if it was fully paid
    const currentInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { payments: true },
    });
    
    if (!currentInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    const updateData: any = {
      items,
      subtotal,
      tax,
      discount,
      total,
      notes,
    };
    
    // Include status in update if provided
    if (status) {
      updateData.status = status;
    }
    
    // Update the invoice
    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: updateData,
    });
    
    // If invoice was fully paid and total amount changed, update payment amounts
    if (currentInvoice.payments.length > 0) {
      const totalPaid = currentInvoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const oldTotal = Number(currentInvoice.total);
      const newTotal = total;
      
      console.log(`Invoice ${params.id} payment update check:`, {
        totalPaid,
        oldTotal,
        newTotal,
        difference: Math.abs(newTotal - oldTotal),
        shouldUpdate: totalPaid >= oldTotal && Math.abs(newTotal - oldTotal) > 0.01
      });
      
      // If the invoice was fully paid (total paid >= old total) and total changed
      if (totalPaid >= oldTotal && Math.abs(newTotal - oldTotal) > 0.01) {
        console.log(`Updating payment amounts for invoice ${params.id}`);
        // Update the payment amounts proportionally
        for (const payment of currentInvoice.payments) {
          const paymentRatio = Number(payment.amount) / oldTotal;
          const newPaymentAmount = newTotal * paymentRatio;
          
          console.log(`Payment ${payment.id}: ${payment.amount} -> ${newPaymentAmount}`);
          
          await prisma.payment.update({
            where: { id: payment.id },
            data: { amount: newPaymentAmount },
          });
        }
        console.log(`Payment amounts updated for invoice ${params.id}`);
      }
    }
    
    return NextResponse.json(updated);
  } catch (e) {
    console.error('PATCH /api/invoices/[id] error', e);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // First delete all payments associated with this invoice
    await prisma.payment.deleteMany({
      where: { invoiceId: params.id },
    });
    
    // Then delete the invoice
    await prisma.invoice.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (e) {
    console.error('DELETE /api/invoices/[id] error', e);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
