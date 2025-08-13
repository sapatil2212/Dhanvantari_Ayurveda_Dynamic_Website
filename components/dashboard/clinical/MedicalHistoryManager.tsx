'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PatientSelector, type Patient } from './PatientSelector';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedTick } from '@/components/ui/animated-tick';

type MedicalHistory = {
  id: string;
  condition: string;
  diagnosis?: string | null;
  treatment?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isOngoing: boolean;
  notes?: string | null;
  createdAt: string;
};

export default function MedicalHistoryManager() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [items, setItems] = useState<MedicalHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    condition: '',
    diagnosis: '',
    treatment: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = async (patientId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/medical-history`);
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
    if (!form.condition.trim()) return;
    setSaving(true);
    const payload = {
      condition: form.condition.trim(),
      diagnosis: form.diagnosis.trim() || undefined,
      treatment: form.treatment.trim() || undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      isOngoing: form.isOngoing,
      notes: form.notes.trim() || undefined,
    };
    const res = await fetch(`/api/patients/${patient.id}/medical-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ condition: '', diagnosis: '', treatment: '', startDate: '', endDate: '', isOngoing: false, notes: '' });
      setSuccess(true);
      load(patient.id);
      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <PatientSelector onSelect={setPatient} />
      {patient && (
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="text-sm font-medium text-gray-700">Medical History</div>
            <div className="space-y-2 text-sm">
              {items.map((m) => (
                <div key={m.id} className="rounded border p-2">
                  <div className="font-medium">{m.condition} {m.isOngoing ? '· Ongoing' : ''}</div>
                  <div className="text-gray-600">Diagnosis: {m.diagnosis || '-'}</div>
                  <div className="text-gray-600">Treatment: {m.treatment || '-'}</div>
                  <div className="text-gray-600">From {m.startDate ? new Date(m.startDate).toLocaleDateString() : '-'} to {m.endDate ? new Date(m.endDate).toLocaleDateString() : (m.isOngoing ? 'Present' : '-')}</div>
                  {m.notes && <div className="text-gray-600">Notes: {m.notes}</div>}
                </div>
              ))}
              {(!loading && items.length === 0) && <div className="text-gray-500">No medical history for this patient.</div>}
              {loading && <div className="text-gray-500">Loading…</div>}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input placeholder="Condition (required)" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} />
              </div>
              <div>
                <Input placeholder="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
              </div>
              <div>
                <Input placeholder="Treatment" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} />
              </div>
              <div>
                <Input type="date" placeholder="Start Date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <Input type="date" placeholder="End Date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2 text-sm">
                <input id="ongoing" type="checkbox" checked={form.isOngoing} onChange={(e) => setForm({ ...form, isOngoing: e.target.checked })} />
                <label htmlFor="ongoing">Ongoing</label>
              </div>
              <div className="sm:col-span-2">
                <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button 
                  onClick={submit} 
                  disabled={saving || !form.condition.trim()}
                  className={success ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {saving ? 'Saving…' : success ? (
                    <>
                      <AnimatedTick className="mr-2" size={16} />
                      Added!
                    </>
                  ) : 'Add Entry'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


