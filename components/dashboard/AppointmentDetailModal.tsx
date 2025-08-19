"use client";
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SuccessModal } from '@/components/ui/SuccessModal';

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string | null;
  age: number | null;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  chiefComplaint: string;
  previousTreatment: string | null;
  medications: string | null;
  additionalNotes: string | null;
  createdAt: string;
};

export default function AppointmentDetailModal({ id, open, onOpenChange, mode = 'view', onSaved }: { id: string | null; open: boolean; onOpenChange: (v: boolean) => void; mode?: 'view' | 'edit'; onSaved?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Appointment | null>(null);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!open || !id) return;
    setIsEditing(mode === 'edit');
    setLoading(true);
    fetch(`/api/appointments/${id}`)
      .then(async (r) => (r.ok ? r.json() : Promise.reject(await r.json())))
      .then((d) => {
        setData(d);
        setForm({
          name: d.name ?? '',
          email: d.email ?? '',
          phone: d.phone ?? '',
          gender: d.gender ?? '',
          age: d.age ?? '',
          consultationType: d.consultationType ?? '',
          preferredDate: new Date(d.preferredDate).toISOString().slice(0, 10),
          preferredTime: d.preferredTime ?? '',
          status: d.status ?? 'PENDING',
          chiefComplaint: d.chiefComplaint ?? '',
          previousTreatment: d.previousTreatment ?? '',
          medications: d.medications ?? '',
          additionalNotes: d.additionalNotes ?? '',
        });
      })
      .finally(() => setLoading(false));
  }, [open, id, mode]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p: any) => ({ ...p, [name]: value }));
  };

  const onSelectChange = (name: string) => (value: string) => setForm((p: any) => ({ ...p, [name]: value }));

  const save = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      const updated = await res.json();
      setData(updated);
      setIsEditing(false);
      onSaved?.();
      setShowSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[96vw] max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Appointment Detail</DialogTitle>
          <DialogDescription>View patient and schedule information</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading...</div>
        ) : data ? (
          <div className="space-y-5 text-sm">
            {/* Header line with name and status */}
            <div className="flex items-start justify-between">
              {isEditing ? (
                <div className="w-full">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Patient Name</div>
                      <Input name="name" value={form.name} onChange={onChange} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Status</div>
                      <Select value={form.status} onValueChange={onSelectChange('status')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="MISSED">Missed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Patient</div>
                    <div className="text-base font-semibold text-gray-900">{data.name}</div>
                    <div className="text-xs text-gray-500">{data.gender ?? '-'}{data.age ? ` · ${data.age}y` : ''}</div>
                  </div>
                  <Badge className={
                    data.status === 'CONFIRMED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : data.status === 'CANCELLED'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }>
                    {data.status}
                  </Badge>
                </>
              )}
            </div>

            {/* Quick info or form fields */}
            {isEditing ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Email</div>
                  <Input type="email" name="email" value={form.email} onChange={onChange} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Phone</div>
                  <Input name="phone" value={form.phone} onChange={onChange} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Gender</div>
                  <Select value={form.gender} onValueChange={onSelectChange('gender')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Age</div>
                  <Input type="number" name="age" value={form.age} onChange={onChange} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Consultation Type</div>
                  <Input name="consultationType" value={form.consultationType} onChange={onChange} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Date</div>
                    <Input type="date" name="preferredDate" value={form.preferredDate} onChange={onChange} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Time</div>
                    <Input type="time" name="preferredTime" value={form.preferredTime} onChange={onChange} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md border bg-slate-50/60 p-3">
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                  <div><span className="text-gray-500">Consultation: </span><span className="font-medium">{data.consultationType}</span></div>
                  <div><span className="text-gray-500">Schedule: </span><span className="font-medium">{new Date(data.preferredDate).toLocaleDateString()} · {data.preferredTime}</span></div>
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border p-3">
                <div className="text-xs uppercase tracking-wide text-gray-500">Contact</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">{data.phone}</div>
                  <div className="text-xs text-gray-500">{data.email}</div>
                </div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs uppercase tracking-wide text-gray-500">Status</div>
                <div className="mt-1">
                  <Badge className={
                    data.status === 'CONFIRMED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : data.status === 'CANCELLED'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }>
                    {data.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Medical (side-by-side) */}
            {isEditing ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Chief Complaint</div>
                  <Textarea name="chiefComplaint" value={form.chiefComplaint} onChange={onChange} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Previous Treatments</div>
                  <Textarea name="previousTreatment" value={form.previousTreatment} onChange={onChange} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Medications</div>
                  <Textarea name="medications" value={form.medications} onChange={onChange} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Additional Notes</div>
                  <Textarea name="additionalNotes" value={form.additionalNotes} onChange={onChange} />
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Chief Complaint</div>
                  <div className="mt-1 leading-relaxed">{data.chiefComplaint || '-'}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Previous Treatments</div>
                  <div className="mt-1 leading-relaxed">{data.previousTreatment || '-'}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Medications</div>
                  <div className="mt-1 leading-relaxed">{data.medications || '-'}</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Additional Notes</div>
                  <div className="mt-1 leading-relaxed">{data.additionalNotes || '-'}</div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="mt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} noShimmer>Cancel</Button>
                <Button onClick={save} disabled={saving} noShimmer>{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-sm text-red-600">Failed to load appointment.</div>
        )}
      </DialogContent>
    </Dialog>

    {/* Success Modal */}
    <SuccessModal
      isOpen={showSuccess}
      onClose={() => setShowSuccess(false)}
      title="Appointment Updated!"
      message="The appointment details have been saved successfully."
      duration={3000}
    />
  </>
  );
}


