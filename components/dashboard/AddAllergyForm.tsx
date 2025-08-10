"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddAllergyForm({ patientId, onCreated }: { patientId: string; onCreated?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [substance, setSubstance] = useState('');
  const [reaction, setReaction] = useState('');
  const [severity, setSeverity] = useState('');

  const submit = async () => {
    if (!substance) return;
    setLoading(true);
    const res = await fetch(`/api/patients/${patientId}/allergies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ substance, reaction, severity }),
    });
    setLoading(false);
    if (res.ok) {
      setSubstance('');
      setReaction('');
      setSeverity('');
      onCreated?.();
    }
  };

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      <Input placeholder="Substance" value={substance} onChange={(e) => setSubstance(e.target.value)} />
      <Input placeholder="Reaction" value={reaction} onChange={(e) => setReaction(e.target.value)} />
      <Input placeholder="Severity" value={severity} onChange={(e) => setSeverity(e.target.value)} />
      <div className="col-span-3 flex justify-end">
        <Button onClick={submit} disabled={loading || !substance}>{loading ? 'Saving…' : 'Add allergy'}</Button>
      </div>
    </div>
  );
}


