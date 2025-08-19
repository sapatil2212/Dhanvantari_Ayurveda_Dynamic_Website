"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedTick } from '@/components/ui/animated-tick';
import { Trash2 } from 'lucide-react';

type Encounter = {
  id: string;
  type: string;
  date: string;
  diagnosis?: string | null;
  notes?: string | null;
};

export default function AddEncounterForm({ patientId, onCreated, encounters = [] }: { 
  patientId: string; 
  onCreated?: () => void;
  encounters?: Encounter[];
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
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
      setSuccess(true);
      onCreated?.();
      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const deleteEncounter = async (encounterId: string) => {
    setDeletingId(encounterId);
    const res = await fetch(`/api/patients/${patientId}/encounters/${encounterId}`, {
      method: 'DELETE',
    });
    setDeletingId(null);
    if (res.ok) {
      setDeleteSuccess(encounterId);
      onCreated?.();
      // Reset delete success state after 2 seconds
      setTimeout(() => setDeleteSuccess(null), 2000);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Recent Encounters List */}
      {encounters.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Recent Encounters</div>
          {encounters.map(encounter => (
            <div key={encounter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(encounter.date).toLocaleString()}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{encounter.type}</div>
                  {encounter.diagnosis && <div className="text-gray-600">Diagnosis: {encounter.diagnosis}</div>}
                  {encounter.notes && <div className="text-gray-600">Notes: {encounter.notes}</div>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteEncounter(encounter.id)}
                disabled={deletingId === encounter.id}
                className={`h-8 w-8 p-0 ${
                  deleteSuccess === encounter.id 
                    ? 'text-green-600 hover:text-green-700' 
                    : 'text-red-500 hover:text-red-700'
                }`}
                noShimmer
              >
                {deletingId === encounter.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                ) : deleteSuccess === encounter.id ? (
                  <AnimatedTick size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Encounter Form */}
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
        <Input placeholder="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
        <div className="col-span-2">
          <Input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="col-span-2 flex justify-end">
          <Button 
            onClick={submit} 
            disabled={loading}
            className={success ? 'bg-green-600 hover:bg-green-700' : ''}
            noShimmer
          >
            {loading ? 'Saving…' : success ? (
              <>
                <AnimatedTick className="mr-2" size={16} />
                Added!
              </>
            ) : 'Add encounter'}
          </Button>
        </div>
      </div>
    </div>
  );
}


