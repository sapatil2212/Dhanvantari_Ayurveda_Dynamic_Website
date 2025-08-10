'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal('').transform(() => undefined)),
  phone: z.string().optional().or(z.literal('').transform(() => undefined)),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodType: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setLoading(false);
    if (res.ok) {
      const created = await res.json();
      router.push(`/dashboard/patients/${created.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold">Add Patient</h1>
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm text-gray-600">First name</label>
              <Input {...register('firstName')} />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">First name is required</p>}
            </div>
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm text-gray-600">Last name</label>
              <Input {...register('lastName')} />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">Last name is required</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Email</label>
              <Input type="email" {...register('email')} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Phone</label>
              <Input {...register('phone')} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Gender</label>
              <Select onValueChange={(value) => {
                const event = { target: { value } };
                register('gender').onChange(event);
              }}>
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
              <Input type="date" {...register('dateOfBirth')} max={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Blood type</label>
              <Select onValueChange={(value) => {
                const event = { target: { value } };
                register('bloodType').onChange(event);
              }}>
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
              <Input {...register('addressLine1')} placeholder="Street address, P.O. box, company name" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-gray-600">Address Line 2</label>
              <Input {...register('addressLine2')} placeholder="Apartment, suite, unit, building, floor, etc." />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">City</label>
              <Input {...register('city')} placeholder="City" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">State/Province</label>
              <Input {...register('state')} placeholder="State or province" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Postal Code</label>
              <Input {...register('postalCode')} placeholder="ZIP or postal code" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">Country</label>
              <Input {...register('country')} placeholder="Country" />
            </div>
            <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


