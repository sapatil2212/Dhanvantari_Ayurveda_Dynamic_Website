"use client";
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SuccessModal } from '@/components/ui/SuccessModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function NewAppointmentForm() {
  const [form, setForm] = React.useState({
    consultationType: '', preferredDate: '', preferredTime: '', name: '', email: '', phone: '', age: '', gender: '', chiefComplaint: '', previousTreatment: '', medications: '', additionalNotes: '',
  });
  const [saving, setSaving] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [confirmDupOpen, setConfirmDupOpen] = React.useState(false);
  const [dupMessage, setDupMessage] = React.useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p: any) => ({ ...p, [name]: value }));
  };

  const submit = async () => {
    setSaving(true);
    try {
      // Check for existing appointments by email/name/phone
      const params = new URLSearchParams();
      if (form.email) params.set('email', form.email);
      if (form.phone) params.set('phone', form.phone);
      if (form.name) params.set('name', form.name);
      const existingRes = await fetch(`/api/appointments?${params.toString()}`, { cache: 'no-store' });
      const existing = existingRes.ok ? await existingRes.json() : { items: [] };
      if (existing.items && existing.items.length > 0) {
        setDupMessage(`We found ${existing.items.length} appointment(s) with the same details. Proceed with another booking?`);
        setConfirmDupOpen(true);
        return;
      }
      
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setSuccessOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const confirmSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setConfirmDupOpen(false);
      setSuccessOpen(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-xs text-gray-500">Patient Name</div>
          <Input name="name" value={form.name} onChange={onChange} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Email</div>
          <Input type="email" name="email" value={form.email} onChange={onChange} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Phone</div>
          <Input name="phone" value={form.phone} onChange={onChange} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Date</div>
          <Input type="date" name="preferredDate" value={form.preferredDate} onChange={onChange} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Time</div>
          <Input type="time" name="preferredTime" value={form.preferredTime} onChange={onChange} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Consultation Type</div>
          <Input name="consultationType" value={form.consultationType} onChange={onChange} />
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Chief Complaint</div>
        <Textarea name="chiefComplaint" value={form.chiefComplaint} onChange={onChange} />
      </div>
      <div>
        <div className="text-xs text-gray-500">Previous Treatments</div>
        <Textarea name="previousTreatment" value={form.previousTreatment} onChange={onChange} />
      </div>
      <div>
        <div className="text-xs text-gray-500">Medications</div>
        <Textarea name="medications" value={form.medications} onChange={onChange} />
      </div>
      <div>
        <div className="text-xs text-gray-500">Additional Notes</div>
        <Textarea name="additionalNotes" value={form.additionalNotes} onChange={onChange} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (window.location.href = '/dashboard/appointments')}>Cancel</Button>
        <Button onClick={submit} disabled={saving}>{saving ? 'Creating...' : 'Create'}</Button>
      </div>
    </div>
    <SuccessModal
      isOpen={successOpen}
      onClose={() => setSuccessOpen(false)}
      title="Appointment Created!"
      message="Appointment created successfully. A confirmation email has been sent."
      duration={3000}
    />

    {/* Duplicate confirm modal */}
    <AlertDialog open={confirmDupOpen}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-lg">Possible duplicate</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">{dupMessage || 'An appointment with the same details exists. Proceed with another booking?'}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-3 flex justify-center gap-2">
          <AlertDialogCancel onClick={() => setConfirmDupOpen(false)}>No</AlertDialogCancel>
          <AlertDialogAction onClick={confirmSubmit}>Yes, proceed</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
}


