"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddVitalForm({ patientId, onCreated }: { patientId: string; onCreated?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    systolicMmHg: '',
    diastolicMmHg: '',
    pulseBpm: '',
    temperatureC: '',
  });

  const submit = async () => {
    setLoading(true);
    const payload: any = {};
    for (const [k, v] of Object.entries(form)) {
      if (v !== '') payload[k] = Number(v);
    }
    const res = await fetch(`/api/patients/${patientId}/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      setForm({ systolicMmHg: '', diastolicMmHg: '', pulseBpm: '', temperatureC: '' });
      onCreated?.();
    }
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Input placeholder="Systolic (mmHg)" value={form.systolicMmHg} onChange={(e) => setForm({ ...form, systolicMmHg: e.target.value })} />
      <Input placeholder="Diastolic (mmHg)" value={form.diastolicMmHg} onChange={(e) => setForm({ ...form, diastolicMmHg: e.target.value })} />
      <Input placeholder="Pulse (bpm)" value={form.pulseBpm} onChange={(e) => setForm({ ...form, pulseBpm: e.target.value })} />
      <Input placeholder="Temperature (°C)" value={form.temperatureC} onChange={(e) => setForm({ ...form, temperatureC: e.target.value })} />
      <div className="col-span-2 flex justify-end">
        <Button onClick={submit} disabled={loading}>{loading ? 'Saving…' : 'Add vitals'}</Button>
      </div>
    </div>
  );
}


