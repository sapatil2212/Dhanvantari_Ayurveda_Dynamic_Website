import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function PatientsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const q = (searchParams?.q as string | undefined)?.trim();
  const page = Number((searchParams?.page as string | undefined) ?? '1');
  const take = 20;
  const skip = (page - 1) * take;
  const where: any = {};
  if (q) {
    where.OR = [
      { firstName: { contains: q } },
      { lastName: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { medicalRecordNumber: { contains: q } },
    ];
  }

  let patients: Awaited<ReturnType<typeof prisma.patient.findMany>> = [];
  let total = 0;
  try {
    [patients, total] = await Promise.all([
      prisma.patient.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip }),
      prisma.patient.count({ where }),
    ]);
  } catch {
    patients = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Patients</h1>
          <p className="text-sm text-gray-500">Complete patient information and clinical records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/api/patients/export">Export CSV</Link>
          </Button>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/dashboard/patients/new">Add Patient</Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="px-4 py-2">MRN</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">DoB</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Blood</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-2">{p.medicalRecordNumber}</td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{p.firstName} {p.lastName}</div>
                  </td>
                  <td className="px-4 py-2">{p.gender ?? '-'}</td>
                  <td className="px-4 py-2">{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2">
                    <div>{p.phone ?? '-'}</div>
                    <div className="text-xs text-gray-500">{p.email ?? '-'}</div>
                  </td>
                  <td className="px-4 py-2">{p.bloodType ?? '-'}</td>
                  <td className="px-4 py-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/patients/${p.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {patients.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">No patients yet.</div>
          )}
        </CardContent>
      </Card>
      <div className="mt-4 flex items-center justify-end gap-2">
      {page > 1 && (
        <Button variant="outline" asChild>
          <Link href={`/dashboard/patients?${new URLSearchParams({ ...(q ? { q } : {} as any), page: String(page - 1) }).toString()}`}>Previous</Link>
        </Button>
      )}
      {skip + patients.length < total && (
        <Button variant="outline" asChild>
          <Link href={`/dashboard/patients?${new URLSearchParams({ ...(q ? { q } : {} as any), page: String(page + 1) }).toString()}`}>Next</Link>
        </Button>
      )}
      <div className="text-sm text-gray-500">Page {page}</div>
      </div>
    </div>
  );
}


