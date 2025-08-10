"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddEncounterForm({ patientId, onCreated }: { patientId: string; onCreated?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('Consultation');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const submit = async () => {
    setLoading(true);
    const res = await fetch(`/api/patients/${patientId}/encounters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, diagnosis, notes }),
    });
    setLoading(false);
    if (res.ok) {
      setDiagnosis('');
      setNotes('');
      onCreated?.();
    }
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Input placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
      <Input placeholder="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
      <div className="col-span-2">
        <Input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="col-span-2 flex justify-end">
        <Button onClick={submit} disabled={loading}>{loading ? 'Saving…' : 'Add encounter'}</Button>
      </div>
    </div>
  );
}


