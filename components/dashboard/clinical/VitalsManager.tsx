'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PatientSelector, type Patient } from './PatientSelector';
import dynamic from 'next/dynamic';

const AddVitalForm = dynamic(() => import('@/components/dashboard/AddVitalForm'), { ssr: false });

type Vital = {
  id: string;
  recordedAt: string;
  systolicMmHg?: number | null;
  diastolicMmHg?: number | null;
  pulseBpm?: number | null;
  temperatureC?: number | null;
};

export default function VitalsManager() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (patientId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/vitals`);
      if (res.ok) {
        const data = await res.json();
        setVitals(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patient) load(patient.id);
    else setVitals([]);
  }, [patient]);

  return (
    <div className="space-y-4">
      <PatientSelector onSelect={setPatient} />
      {patient && (
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="text-sm font-medium text-gray-700">Vitals Management</div>
            <AddVitalForm patientId={patient.id} onCreated={() => load(patient.id)} vitals={vitals} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}


