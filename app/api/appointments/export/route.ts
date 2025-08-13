import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') ?? 'csv') as 'csv' | 'docx' | 'pdf';
    const q = searchParams.get('q')?.trim();
    const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined;
    const to = searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined;

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }
    if (from || to) {
      where.preferredDate = {};
      if (from) where.preferredDate.gte = from;
      if (to) where.preferredDate.lte = to;
    }

    const items = await prisma.appointment.findMany({ where, orderBy: { preferredDate: 'asc' } });

    if (format === 'csv') {
      const header = ['Name','Email','Phone','Consultation','Date','Time','Status'];
      const rows = items.map((a) => [
        a.name,
        a.email,
        a.phone,
        a.consultationType,
        new Date(a.preferredDate).toISOString().slice(0,10),
        a.preferredTime,
        a.status,
      ]);
      const csv = [header.join(','), ...rows.map((r) => r.map((v) => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="appointments.csv"',
        },
      });
    }

    if (format === 'docx') {
      let docx: any;
      try {
        docx = await import('docx');
      } catch (e) {
        return NextResponse.json({ error: "'docx' package is not installed. Run: npm install docx" }, { status: 500 });
      }
      const { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } = docx;
      const rows = items.map((a: any) => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(a.name)] }),
          new TableCell({ children: [new Paragraph(a.email)] }),
          new TableCell({ children: [new Paragraph(a.phone)] }),
          new TableCell({ children: [new Paragraph(a.consultationType)] }),
          new TableCell({ children: [new Paragraph(new Date(a.preferredDate).toISOString().slice(0,10))] }),
          new TableCell({ children: [new Paragraph(a.preferredTime)] }),
          new TableCell({ children: [new Paragraph(a.status)] }),
        ],
      }));
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({ text: 'Appointments', heading: 'Heading1' }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: ['Name','Email','Phone','Consultation','Date','Time','Status'].map((t: string) => new TableCell({ children: [new Paragraph(t)] })),
                }),
                ...rows,
              ],
            }),
          ],
        }],
      });
      const buffer = await Packer.toBuffer(doc);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': 'attachment; filename="appointments.docx"',
        },
      });
    }

    // PDF via pdf-lib (no native deps)
    let pdfLib: any;
    try {
      pdfLib = await import('pdf-lib');
    } catch (e) {
      return NextResponse.json({ error: "'pdf-lib' package is not installed. Run: npm install pdf-lib" }, { status: 500 });
    }
    const { PDFDocument, StandardFonts, rgb } = pdfLib;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = 800;
    page.drawText('Appointments', { x: 50, y, size: 16, font, color: rgb(0, 0.4, 0.2) });
    y -= 24;
    const lines = items.flatMap((a) => [
      `${a.name} | ${a.email} | ${a.phone}`,
      `${a.consultationType} | ${new Date(a.preferredDate).toISOString().slice(0,10)} ${a.preferredTime} | ${a.status}`,
      ''
    ]);
    for (const line of lines) {
      if (y < 60) {
        y = 800;
        // new page when needed
        const p = pdfDoc.addPage([595.28, 841.89]);
        p.setFont(font);
        p.setFontSize(12);
        (p as any)._y = y; // not used further, just to be explicit
      }
      page.drawText(line, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
      y -= 16;
    }
    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="appointments.pdf"',
      },
    });
  } catch (error) {
    console.error('GET /api/appointments/export error', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}


