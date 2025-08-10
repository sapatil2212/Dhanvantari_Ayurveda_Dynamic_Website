import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      vitals: { orderBy: { recordedAt: 'desc' }, take: 5 },
      encounters: { orderBy: { date: 'desc' }, take: 10 },
      invoices: { orderBy: { date: 'desc' }, take: 10, include: { payments: true } },
      appointments: { orderBy: { preferredDate: 'desc' }, take: 10 },
    },
  });
  if (!patient) redirect('/dashboard/patients');

  const AddVitalForm = dynamic(() => import('@/components/dashboard/AddVitalForm'), { ssr: false });
  const AddEncounterForm = dynamic(() => import('@/components/dashboard/AddEncounterForm'), { ssr: false });
  const AddAllergyForm = dynamic(() => import('@/components/dashboard/AddAllergyForm'), { ssr: false });
  const InvoiceActions = dynamic(() => import('@/components/dashboard/InvoiceActions'), { ssr: false });
  const prescriptions = await prisma.prescription.findMany({ where: { patientId: patient.id }, orderBy: { date: 'desc' }, take: 5 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{patient.firstName} {patient.lastName}</h1>
          <p className="text-sm text-gray-500">MRN: {patient.medicalRecordNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/patients/${patient.id}/edit`}>Edit</Link>
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href={`/dashboard/patients/${patient.id}/invoices/new`}>New Invoice</Link>
          </Button>
          <Link className="text-sm text-emerald-700 underline" href={`/dashboard/patients`}>Back to list</Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 text-sm font-medium text-gray-700">Demographics</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div><span className="text-gray-500">Gender:</span> {patient.gender ?? '-'}</div>
              <div><span className="text-gray-500">DoB:</span> {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '-'}</div>
              <div><span className="text-gray-500">Blood:</span> {patient.bloodType ?? '-'}</div>
              <div><span className="text-gray-500">Phone:</span> {patient.phone ?? '-'}</div>
              <div><span className="text-gray-500">Email:</span> {patient.email ?? '-'}</div>
              <div><span className="text-gray-500">Address:</span> {[patient.addressLine1,patient.city,patient.state,patient.postalCode].filter(Boolean).join(', ') || '-'}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-3 text-sm font-medium text-gray-700">Recent Vitals</div>
            <div className="space-y-2 text-sm">
              {patient.vitals.map(v => (
                <div key={v.id} className="rounded border p-2">
                  <div className="text-gray-500">{new Date(v.recordedAt).toLocaleString()}</div>
                  <div>BP: {v.systolicMmHg ?? '-'} / {v.diastolicMmHg ?? '-'} mmHg · Pulse: {v.pulseBpm ?? '-'} bpm · Temp: {v.temperatureC ?? '-'} °C</div>
                </div>
              ))}
              {patient.vitals.length === 0 && <div className="text-gray-500">No vitals.</div>}
            </div>
            {/* Client-side quick add */}
            <AddVitalForm patientId={patient.id} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-3 text-sm font-medium text-gray-700">Encounters</div>
            <div className="space-y-2 text-sm">
              {patient.encounters.map(e => (
                <div key={e.id} className="rounded border p-2">
                  <div className="font-medium">{e.type} · {new Date(e.date).toLocaleString()}</div>
                  <div className="text-gray-600">{e.diagnosis ?? e.reason ?? '-'}</div>
                </div>
              ))}
              {patient.encounters.length === 0 && <div className="text-gray-500">No encounters.</div>}
            </div>
            <AddEncounterForm patientId={patient.id} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-3 text-sm font-medium text-gray-700">Invoices</div>
            <div className="space-y-2 text-sm">
              {patient.invoices.map(inv => (
                <div key={inv.id} className="rounded border p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">#{inv.number} · {new Date(inv.date).toLocaleDateString()} · {inv.status}</div>
                      <div className="text-gray-600">Total: ₹{String(inv.total)}</div>
                    </div>
                    <InvoiceActions invoice={inv} patientId={patient.id} />
                  </div>
                </div>
              ))}
              {patient.invoices.length === 0 && <div className="text-gray-500">No invoices.</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-3 text-sm font-medium text-gray-700">Allergies</div>
            <div className="space-y-2 text-sm">
              {patient.allergies?.map(a => (
                <div key={a.id} className="rounded border p-2">
                  <div className="font-medium">{a.substance} {a.severity ? `· ${a.severity}` : ''}</div>
                  <div className="text-gray-600">{a.reaction ?? '-'}</div>
                </div>
              ))}
              {(!patient.allergies || patient.allergies.length === 0) && <div className="text-gray-500">No allergies.</div>}
            </div>
            <AddAllergyForm patientId={patient.id} />
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">Prescriptions</div>
              <Button asChild size="sm">
                <Link href={`/dashboard/patients/${patient.id}/prescriptions/new`}>New Prescription</Link>
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="rounded border p-2">
                  <div className="font-medium">
                    <Link className="text-emerald-700 underline" href={`/dashboard/prescriptions/${rx.id}`}>{rx.number}</Link>
                    <span className="ml-2 text-gray-600">· {new Date(rx.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {prescriptions.length === 0 && <div className="text-gray-500">No prescriptions.</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="mb-3 text-sm font-medium text-gray-700">Appointments</div>
          <div className="space-y-2 text-sm">
            {patient.appointments.map(a => (
              <div key={a.id} className="rounded border p-2">
                <div className="font-medium">{a.consultationType} · {new Date(a.preferredDate).toLocaleDateString()} at {a.preferredTime} · {a.status}</div>
              </div>
            ))}
            {patient.appointments.length === 0 && <div className="text-gray-500">No appointments.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


