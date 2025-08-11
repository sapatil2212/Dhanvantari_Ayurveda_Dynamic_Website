'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PatientSelector, type Patient } from './PatientSelector';
import dynamic from 'next/dynamic';

const AddAllergyForm = dynamic(() => import('@/components/dashboard/AddAllergyForm'), { ssr: false });

type Allergy = {
  id: string;
  substance: string;
  reaction?: string | null;
  severity?: string | null;
  recordedAt: string;
};

export default function AllergiesManager() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (patientId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/allergies`);
      if (res.ok) {
        const data = await res.json();
        setAllergies(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patient) load(patient.id);
    else setAllergies([]);
  }, [patient]);

  return (
    <div className="space-y-4">
      <PatientSelector onSelect={setPatient} />
      {patient && (
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="text-sm font-medium text-gray-700">Allergies</div>
            <div className="space-y-2 text-sm">
              {allergies.map(a => (
                <div key={a.id} className="rounded border p-2">
                  <div className="text-gray-500">{new Date(a.recordedAt).toLocaleString()}</div>
                  <div className="font-medium">{a.substance} {a.severity ? `· ${a.severity}` : ''}</div>
                  <div className="text-gray-600">{a.reaction ?? '-'}</div>
                </div>
              ))}
              {(!loading && allergies.length === 0) && <div className="text-gray-500">No allergies for this patient.</div>}
              {loading && <div className="text-gray-500">Loading…</div>}
            </div>
            <AddAllergyForm patientId={patient.id} onCreated={() => load(patient.id)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}


