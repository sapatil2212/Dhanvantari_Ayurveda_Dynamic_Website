'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const AddVitalForm = dynamic(() => import('@/components/dashboard/AddVitalForm'), { ssr: false });
const AddEncounterForm = dynamic(() => import('@/components/dashboard/AddEncounterForm'), { ssr: false });
const AddAllergyForm = dynamic(() => import('@/components/dashboard/AddAllergyForm'), { ssr: false });
const InvoiceActions = dynamic(() => import('@/components/dashboard/InvoiceActions'), { ssr: false });

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  email?: string | null;
  phone?: string | null;
  bloodType?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  vitals: Array<{
    id: string;
    recordedAt: string;
    systolicMmHg?: number | null;
    diastolicMmHg?: number | null;
    pulseBpm?: number | null;
    temperatureC?: number | null;
  }>;
  encounters: Array<{
    id: string;
    type: string;
    date: string;
    diagnosis?: string | null;
    reason?: string | null;
  }>;
  invoices: Array<{
    id: string;
    number: string;
    date: string;
    status: string;
    total: number;
  }>;
  allergies?: Array<{
    id: string;
    substance: string;
    reaction?: string | null;
    severity?: string | null;
    createdAt: string;
  }>;
  appointments: Array<{
    id: string;
    consultationType: string;
    preferredDate: string;
    preferredTime: string;
    status: string;
  }>;
};

type Prescription = {
  id: string;
  number: string;
  date: string;
};

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPatient = async () => {
    try {
      const res = await fetch(`/api/patients/${id}`);
      if (!res.ok) {
        router.push('/dashboard/patients');
        return;
      }
      const data = await res.json();
      setPatient(data);
    } catch (error) {
      console.error('Failed to load patient:', error);
      router.push('/dashboard/patients');
    }
  };

  const loadPrescriptions = async () => {
    try {
      const res = await fetch(`/api/prescriptions?patientId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data || []);
      }
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadPatient(), loadPrescriptions()]);
  };

  useEffect(() => {
    if (id) {
      refreshData().finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!patient) return <div className="p-6">Patient not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{patient.firstName} {patient.lastName}</h1>
          <p className="text-sm text-gray-500">Patient Details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/patients/${patient.id}/edit`}>Edit</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/patients/${patient.id}/invoices/new`}>New Invoice</Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="mb-3 text-sm font-medium text-gray-700">Demographics</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <div className="text-gray-500">Gender:</div>
              <div>{patient.gender || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">DoB:</div>
              <div>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Blood:</div>
              <div>{patient.bloodType || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Phone:</div>
              <div>{patient.phone || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Email:</div>
              <div>{patient.email || '-'}</div>
            </div>
            <div className="sm:col-span-3">
              <div className="text-gray-500">Address:</div>
              <div>
                {[patient.addressLine1, patient.addressLine2, patient.city, patient.state, patient.postalCode, patient.country]
                  .filter(Boolean)
                  .join(', ') || '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-3 text-sm font-medium text-gray-700">Vitals Management</div>
            <AddVitalForm patientId={patient.id} onCreated={refreshData} vitals={patient.vitals} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-3 text-sm font-medium text-gray-700">Quick Actions</div>
            <div className="space-y-2">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href={`/dashboard/clinical/vitals?patientId=${patient.id}`}>Full Vitals History</Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href={`/dashboard/clinical/allergies?patientId=${patient.id}`}>Manage Allergies</Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href={`/dashboard/clinical/history?patientId=${patient.id}`}>Medical History</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-3 text-sm font-medium text-gray-700">Encounters Management</div>
            <AddEncounterForm patientId={patient.id} onCreated={refreshData} encounters={patient.encounters} />
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
                    <InvoiceActions invoice={{
                      id: inv.id,
                      number: inv.number,
                      status: inv.status,
                      total: Number(inv.total),
                      date: inv.date
                    }} patientId={patient.id} />
                  </div>
                </div>
              ))}
              {patient.invoices.length === 0 && <div className="text-gray-500">No invoices.</div>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-3 text-sm font-medium text-gray-700">Allergies Management</div>
            <AddAllergyForm patientId={patient.id} onCreated={refreshData} allergies={patient.allergies || []} />
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


