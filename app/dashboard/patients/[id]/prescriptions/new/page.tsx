'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type RxItem = { medicineName: string; strength?: string; dosage?: string; frequency?: string; route?: string; durationDays?: number; instructions?: string };

export default function NewPrescriptionPage() {
  const { id: patientId } = useParams<{ id: string }>();
  const router = useRouter();
  const [prescriberName, setPrescriberName] = useState('');
  const [prescriberRegNo, setPrescriberRegNo] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [items, setItems] = useState<RxItem[]>([{ medicineName: '', strength: '', dosage: '', frequency: '', route: 'Oral', durationDays: 5, instructions: '' }]);
  const [saving, setSaving] = useState(false);

  const addItem = () => setItems([...items, { medicineName: '', strength: '', dosage: '', frequency: '', route: 'Oral', durationDays: 5, instructions: '' }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    const payload = { patientId, prescriberName, prescriberRegNo, diagnosis, advice, followUpDate: followUpDate || undefined, items };
    const res = await fetch('/api/prescriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      const created = await res.json();
      router.push(`/dashboard/prescriptions/${created.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-4 text-2xl font-semibold">New Prescription</h1>
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-600">Prescriber Name</label>
              <Input value={prescriberName} onChange={(e) => setPrescriberName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Registration No</label>
              <Input value={prescriberRegNo} onChange={(e) => setPrescriberRegNo(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-gray-600">Diagnosis</label>
              <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Follow-up Date</label>
              <Input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
            </div>
          </div>

          <div className="text-sm font-medium text-gray-700">Medicines</div>
          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-4"><Input placeholder="Medicine" value={it.medicineName} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, medicineName: e.target.value } : x))} /></div>
                <div className="col-span-2"><Input placeholder="Strength" value={it.strength || ''} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, strength: e.target.value } : x))} /></div>
                <div className="col-span-2"><Input placeholder="Dosage (e.g. 1-0-1)" value={it.dosage || ''} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, dosage: e.target.value } : x))} /></div>
                <div className="col-span-2"><Input placeholder="Frequency (e.g. TID)" value={it.frequency || ''} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, frequency: e.target.value } : x))} /></div>
                <div className="col-span-1"><Input placeholder="Route" value={it.route || ''} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, route: e.target.value } : x))} /></div>
                <div className="col-span-1"><Input type="number" placeholder="Days" value={String(it.durationDays || '')} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, durationDays: Number(e.target.value) } : x))} /></div>
                <div className="col-span-12"><Input placeholder="Instructions" value={it.instructions || ''} onChange={(e) => setItems(items.map((x, idx) => idx === i ? { ...x, instructions: e.target.value } : x))} /></div>
                {items.length > 1 && (
                  <div className="col-span-12 flex justify-end">
                    <Button variant="outline" onClick={() => removeItem(i)}>Remove</Button>
                  </div>
                )}
              </div>
            ))}
            <div>
              <Button variant="outline" onClick={addItem}>Add Medicine</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-600">Advice/Notes</label>
              <Input value={advice} onChange={(e) => setAdvice(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={save} disabled={saving || !prescriberName || items.some(it => !it.medicineName)}>{saving ? 'Saving…' : 'Create Prescription'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


