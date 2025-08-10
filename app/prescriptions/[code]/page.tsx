import { prisma } from '@/lib/prisma';

export default async function PublicPrescriptionPage({ params }: { params: { code: string } }) {
  const rx = await prisma.prescription.findFirst({ where: { shareCode: params.code }, include: { items: true, patient: true } });
  if (!rx) return <div className="p-6">Invalid link</div>;
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-4 text-center">
        <div className="text-xl font-semibold">Digital Prescription</div>
        <div className="text-sm text-gray-600">{rx.number} · {new Date(rx.date).toLocaleDateString()}</div>
      </div>
      <div className="mb-4 rounded border p-4">
        <div className="text-sm">Patient: <span className="font-medium">{rx.patient.firstName} {rx.patient.lastName}</span></div>
        <div className="text-sm">Diagnosis: {rx.diagnosis ?? '-'}</div>
        {rx.followUpDate && <div className="text-sm">Follow-up: {new Date(rx.followUpDate).toLocaleDateString()}</div>}
      </div>
      <div className="space-y-3">
        {rx.items.map((it) => (
          <div key={it.id} className="rounded border p-3">
            <div className="font-medium">{it.medicineName} {it.strength ? `· ${it.strength}` : ''}</div>
            <div className="text-gray-600 text-sm">{[it.dosage, it.frequency, it.route, it.durationDays ? `${it.durationDays} days` : ''].filter(Boolean).join(' · ')}</div>
            {it.instructions && <div className="text-gray-600 text-sm">{it.instructions}</div>}
          </div>
        ))}
      </div>
      <div className="mt-6 text-center text-xs text-gray-500">Prescriber: {rx.prescriberName}{rx.prescriberRegNo ? ` · Reg# ${rx.prescriberRegNo}` : ''}</div>
    </div>
  );
}


