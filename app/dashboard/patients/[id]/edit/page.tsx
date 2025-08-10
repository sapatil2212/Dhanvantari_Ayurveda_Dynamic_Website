'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  email?: string | null;
  phone?: string | null;
  bloodType?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [p, setP] = useState<Patient | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/patients/${id}`);
      if (!res.ok) {
        router.push('/dashboard/patients');
        return;
      }
      const data = await res.json();
      setP({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : null,
        email: data.email,
        phone: data.phone,
        bloodType: data.bloodType,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
      });
      setLoading(false);
    })();
  }, [id]);

  const save = async () => {
    if (!p) return;
    setSaving(true);
    const res = await fetch(`/api/patients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, dateOfBirth: p.dateOfBirth || null }),
    });
    setSaving(false);
    if (res.ok) router.push(`/dashboard/patients/${id}`);
  };

  if (loading || !p) return <div className="p-6">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold">Edit Patient</h1>
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-600">First name</label>
              <Input value={p.firstName} onChange={(e) => setP({ ...p, firstName: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Last name</label>
              <Input value={p.lastName} onChange={(e) => setP({ ...p, lastName: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Gender</label>
              <Select value={p.gender ?? ''} onValueChange={(value) => setP({ ...p, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Date of birth</label>
              <Input 
                type="date" 
                value={p.dateOfBirth ?? ''} 
                onChange={(e) => setP({ ...p, dateOfBirth: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Email</label>
              <Input type="email" value={p.email ?? ''} onChange={(e) => setP({ ...p, email: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Phone</label>
              <Input value={p.phone ?? ''} onChange={(e) => setP({ ...p, phone: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Blood type</label>
              <Select value={p.bloodType ?? ''} onValueChange={(value) => setP({ ...p, bloodType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-gray-600">Address Line 1</label>
              <Input value={p.addressLine1 ?? ''} onChange={(e) => setP({ ...p, addressLine1: e.target.value })} placeholder="Street address, P.O. box, company name" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-gray-600">Address Line 2</label>
              <Input value={p.addressLine2 ?? ''} onChange={(e) => setP({ ...p, addressLine2: e.target.value })} placeholder="Apartment, suite, unit, building, floor, etc." />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">City</label>
              <Input value={p.city ?? ''} onChange={(e) => setP({ ...p, city: e.target.value })} placeholder="City" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">State/Province</label>
              <Input value={p.state ?? ''} onChange={(e) => setP({ ...p, state: e.target.value })} placeholder="State or province" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Postal Code</label>
              <Input value={p.postalCode ?? ''} onChange={(e) => setP({ ...p, postalCode: e.target.value })} placeholder="ZIP or postal code" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Country</label>
              <Input value={p.country ?? ''} onChange={(e) => setP({ ...p, country: e.target.value })} placeholder="Country" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


