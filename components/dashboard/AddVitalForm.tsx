"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedTick } from '@/components/ui/animated-tick';
import { Trash2 } from 'lucide-react';

type Vital = {
  id: string;
  recordedAt: string;
  systolicMmHg?: number | null;
  diastolicMmHg?: number | null;
  pulseBpm?: number | null;
  temperatureC?: number | null;
};

export default function AddVitalForm({ patientId, onCreated, vitals = [] }: { 
  patientId: string; 
  onCreated?: () => void;
  vitals?: Vital[];
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
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
      setSuccess(true);
      onCreated?.();
      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const deleteVital = async (vitalId: string) => {
    setDeletingId(vitalId);
    const res = await fetch(`/api/patients/${patientId}/vitals/${vitalId}`, {
      method: 'DELETE',
    });
    setDeletingId(null);
    if (res.ok) {
      setDeleteSuccess(vitalId);
      onCreated?.();
      // Reset delete success state after 2 seconds
      setTimeout(() => setDeleteSuccess(null), 2000);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Recent Vitals List */}
      {vitals.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Recent Vitals</div>
          {vitals.map(vital => (
            <div key={vital.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(vital.recordedAt).toLocaleString()}
                </div>
                <div className="text-sm">
                  BP: {vital.systolicMmHg ?? '-'} / {vital.diastolicMmHg ?? '-'} mmHg · 
                  Pulse: {vital.pulseBpm ?? '-'} bpm · 
                  Temp: {vital.temperatureC ?? '-'} °C
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteVital(vital.id)}
                disabled={deletingId === vital.id}
                className={`h-8 w-8 p-0 ${
                  deleteSuccess === vital.id 
                    ? 'text-green-600 hover:text-green-700' 
                    : 'text-red-500 hover:text-red-700'
                }`}
              >
                {deletingId === vital.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                ) : deleteSuccess === vital.id ? (
                  <AnimatedTick size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Vital Form */}
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Systolic (mmHg)" value={form.systolicMmHg} onChange={(e) => setForm({ ...form, systolicMmHg: e.target.value })} />
        <Input placeholder="Diastolic (mmHg)" value={form.diastolicMmHg} onChange={(e) => setForm({ ...form, diastolicMmHg: e.target.value })} />
        <Input placeholder="Pulse (bpm)" value={form.pulseBpm} onChange={(e) => setForm({ ...form, pulseBpm: e.target.value })} />
        <Input placeholder="Temperature (°C)" value={form.temperatureC} onChange={(e) => setForm({ ...form, temperatureC: e.target.value })} />
        <div className="col-span-2 flex justify-end">
          <Button 
            onClick={submit} 
            disabled={loading}
            className={success ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {loading ? 'Saving…' : success ? (
              <>
                <AnimatedTick className="mr-2" size={16} />
                Added!
              </>
            ) : 'Add vitals'}
          </Button>
        </div>
      </div>
    </div>
  );
}


