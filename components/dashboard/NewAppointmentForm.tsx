"use client";
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { useToast } from '@/hooks/use-toast';


export default function NewAppointmentForm() {
  const [form, setForm] = React.useState({
    consultationType: '', preferredDate: '', preferredTime: '', name: '', email: '', phone: '', age: '', gender: '', chiefComplaint: '', previousTreatment: '', medications: '', additionalNotes: '',
  });
  const [saving, setSaving] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const { toast } = useToast();

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p: any) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const missing: string[] = [];
    if (!form.consultationType?.trim()) missing.push('Consultation Type');
    if (!form.preferredDate?.trim()) missing.push('Date');
    if (!form.preferredTime?.trim()) missing.push('Time');
    if (!form.name?.trim()) missing.push('Patient Name');
    if (!form.email?.trim()) missing.push('Email');
    if (!form.phone?.trim()) missing.push('Phone');
    if (!form.chiefComplaint?.trim()) missing.push('Chief Complaint');
    return missing;
  };

  const submit = async () => {
    setSaving(true);
    try {
      const missing = validate();
      if (missing.length) {
        toast({
          title: 'Missing required fields',
          description: `Please fill: ${missing.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }
      
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed');
      }
      setSuccessOpen(true);
    } catch (error: any) {
      toast({ title: 'Failed to create appointment', description: error?.message || 'Please try again', variant: 'destructive' });
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
          <Input name="name" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <div className="text-xs text-gray-500">Email</div>
          <Input type="email" name="email" value={form.email} onChange={onChange} required />
        </div>
        <div>
          <div className="text-xs text-gray-500">Phone</div>
          <Input name="phone" value={form.phone} onChange={onChange} required />
        </div>
        <div>
          <div className="text-xs text-gray-500">Date</div>
          <Input type="date" name="preferredDate" value={form.preferredDate} onChange={onChange} required />
        </div>
        <div>
          <div className="text-xs text-gray-500">Time</div>
          <Input type="time" name="preferredTime" value={form.preferredTime} onChange={onChange} required />
        </div>
        <div>
          <div className="text-xs text-gray-500">Consultation Type</div>
          <Input name="consultationType" value={form.consultationType} onChange={onChange} required />
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Chief Complaint</div>
        <Textarea name="chiefComplaint" value={form.chiefComplaint} onChange={onChange} required />
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
        <Button variant="outline" onClick={() => (window.location.href = '/dashboard/appointments')} noShimmer>Cancel</Button>
        <Button onClick={submit} disabled={saving} noShimmer>{saving ? 'Creating...' : 'Create'}</Button>
      </div>
    </div>
    <SuccessModal
      isOpen={successOpen}
      onClose={() => setSuccessOpen(false)}
      title="Appointment Created!"
      message="Appointment created successfully. A confirmation email has been sent."
      duration={3000}
    />


  </>
  );
}


