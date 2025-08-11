'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PatientSelector, type Patient } from './PatientSelector';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Lifestyle = {
  id: string;
  smoking?: string | null;
  alcohol?: string | null;
  exercise?: string | null;
  diet?: string | null;
  occupation?: string | null;
  stressLevel?: string | null;
  sleepHours?: number | null;
  notes?: string | null;
  createdAt: string;
};

export default function LifestyleManager() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [items, setItems] = useState<Lifestyle[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    smoking: '',
    alcohol: '',
    exercise: '',
    diet: '',
    occupation: '',
    stressLevel: '',
    sleepHours: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const load = async (patientId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/lifestyle`);
      if (res.ok) {
        const data = await res.json();
        setItems(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patient) load(patient.id);
    else setItems([]);
  }, [patient]);

  const submit = async () => {
    if (!patient) return;
    setSaving(true);
    const payload: any = {
      smoking: form.smoking || undefined,
      alcohol: form.alcohol || undefined,
      exercise: form.exercise || undefined,
      diet: form.diet || undefined,
      occupation: form.occupation || undefined,
      stressLevel: form.stressLevel || undefined,
      sleepHours: form.sleepHours ? Number(form.sleepHours) : undefined,
      notes: form.notes || undefined,
    };
    const res = await fetch(`/api/patients/${patient.id}/lifestyle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ smoking: '', alcohol: '', exercise: '', diet: '', occupation: '', stressLevel: '', sleepHours: '', notes: '' });
      load(patient.id);
    }
  };

  return (
    <div className="space-y-4">
      <PatientSelector onSelect={setPatient} />
      {patient && (
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="text-sm font-medium text-gray-700">Lifestyle</div>
            <div className="space-y-2 text-sm">
              {items.map((m) => (
                <div key={m.id} className="rounded border p-2">
                  <div>Smoking: {m.smoking || '-'}</div>
                  <div>Alcohol: {m.alcohol || '-'}</div>
                  <div>Exercise: {m.exercise || '-'}</div>
                  <div>Diet: {m.diet || '-'}</div>
                  <div>Occupation: {m.occupation || '-'}</div>
                  <div>Stress: {m.stressLevel || '-'}</div>
                  <div>Sleep Hours: {m.sleepHours ?? '-'}</div>
                  {m.notes && <div>Notes: {m.notes}</div>}
                  <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
                </div>
              ))}
              {(!loading && items.length === 0) && <div className="text-gray-500">No lifestyle entries for this patient.</div>}
              {loading && <div className="text-gray-500">Loading…</div>}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Input placeholder="Smoking" value={form.smoking} onChange={(e) => setForm({ ...form, smoking: e.target.value })} />
              <Input placeholder="Alcohol" value={form.alcohol} onChange={(e) => setForm({ ...form, alcohol: e.target.value })} />
              <Input placeholder="Exercise" value={form.exercise} onChange={(e) => setForm({ ...form, exercise: e.target.value })} />
              <Input placeholder="Diet" value={form.diet} onChange={(e) => setForm({ ...form, diet: e.target.value })} />
              <Input placeholder="Occupation" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
              <Input placeholder="Stress Level" value={form.stressLevel} onChange={(e) => setForm({ ...form, stressLevel: e.target.value })} />
              <Input type="number" placeholder="Sleep Hours" value={form.sleepHours} onChange={(e) => setForm({ ...form, sleepHours: e.target.value })} />
              <div className="sm:col-span-3">
                <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <Button onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Add Entry'}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


