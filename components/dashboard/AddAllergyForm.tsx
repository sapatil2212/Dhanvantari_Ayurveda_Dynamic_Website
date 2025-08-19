"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedTick } from '@/components/ui/animated-tick';
import { Trash2 } from 'lucide-react';

type Allergy = {
  id: string;
  substance: string;
  reaction?: string | null;
  severity?: string | null;
  createdAt: string;
};

export default function AddAllergyForm({ patientId, onCreated, allergies = [] }: { 
  patientId: string; 
  onCreated?: () => void;
  allergies?: Allergy[];
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
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
      setSuccess(true);
      onCreated?.();
      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const deleteAllergy = async (allergyId: string) => {
    setDeletingId(allergyId);
    const res = await fetch(`/api/patients/${patientId}/allergies/${allergyId}`, {
      method: 'DELETE',
    });
    setDeletingId(null);
    if (res.ok) {
      setDeleteSuccess(allergyId);
      onCreated?.();
      // Reset delete success state after 2 seconds
      setTimeout(() => setDeleteSuccess(null), 2000);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Recent Allergies List */}
      {allergies.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Recent Allergies</div>
          {allergies.map(allergy => (
            <div key={allergy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(allergy.createdAt).toLocaleString()}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{allergy.substance} {allergy.severity ? `· ${allergy.severity}` : ''}</div>
                  {allergy.reaction && <div className="text-gray-600">Reaction: {allergy.reaction}</div>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteAllergy(allergy.id)}
                disabled={deletingId === allergy.id}
                className={`h-8 w-8 p-0 ${
                  deleteSuccess === allergy.id 
                    ? 'text-green-600 hover:text-green-700' 
                    : 'text-red-500 hover:text-red-700'
                }`}
                noShimmer
              >
                {deletingId === allergy.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                ) : deleteSuccess === allergy.id ? (
                  <AnimatedTick size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Allergy Form */}
      <div className="grid grid-cols-3 gap-2">
        <Input placeholder="Substance" value={substance} onChange={(e) => setSubstance(e.target.value)} />
        <Input placeholder="Reaction" value={reaction} onChange={(e) => setReaction(e.target.value)} />
        <Input placeholder="Severity" value={severity} onChange={(e) => setSeverity(e.target.value)} />
        <div className="col-span-3 flex justify-end">
          <Button 
            onClick={submit} 
            disabled={loading || !substance}
            className={success ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-gray-800'}
            noShimmer
          >
            {loading ? 'Saving…' : success ? (
              <>
                <AnimatedTick className="mr-2" size={16} />
                Added!
              </>
            ) : 'Add allergy'}
          </Button>
        </div>
      </div>
    </div>
  );
}


