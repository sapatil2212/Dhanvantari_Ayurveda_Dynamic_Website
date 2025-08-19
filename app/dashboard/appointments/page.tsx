import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import Toolbar from '@/components/dashboard/AppointmentToolbar';
import AppointmentActions from '@/components/dashboard/AppointmentActions';

export default async function AppointmentsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const q = (searchParams?.q as string | undefined)?.trim();
  const fromStr = searchParams?.from as string | undefined;
  const toStr = searchParams?.to as string | undefined;
  const from = fromStr ? new Date(fromStr) : undefined;
  const to = toStr ? new Date(toStr) : undefined;

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
    ];
  }
  if (from || to) {
    where.preferredDate = {};
    if (from) where.preferredDate.gte = from;
    if (to) where.preferredDate.lte = to;
  }

  let appointments: Awaited<ReturnType<typeof prisma.appointment.findMany>> = [];
  try {
    appointments = await prisma.appointment.findMany({ where, orderBy: { preferredDate: 'asc' } });
  } catch (e) {
    // Likely the migration hasn't run yet; show empty state gracefully
    appointments = [];
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">Appointments</h1>
        <p className="text-xs sm:text-sm text-gray-500">Manage and track patient appointments</p>
      </div>

      <Toolbar />

      <Card className="shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm">Patient</th>
                <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm">Contact</th>
                <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm">Consultation</th>
                <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm">Date</th>
                <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm">Time</th>
                <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm">Status</th>
                <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-slate-50">
                  <td className="px-2 sm:px-4 py-2">
                    <div className="font-medium text-xs sm:text-sm">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.gender ?? '-'}{a.age ? ` · ${a.age}y` : ''}</div>
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    <div className="text-xs sm:text-sm">{a.phone}</div>
                    <div className="text-xs text-gray-500">{a.email}</div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{a.consultationType}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{new Date(a.preferredDate).toLocaleDateString()}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{a.preferredTime}</td>
                  <td className="px-2 sm:px-4 py-2">
                    <span className={`rounded-full px-1.5 sm:px-2.5 py-0.5 text-xs font-medium border ${
                      a.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : a.status === 'CANCELLED'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : a.status === 'MISSED'
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    <AppointmentActions id={a.id} currentStatus={a.status as any} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className="p-6 text-center text-xs sm:text-sm text-gray-500">No appointments yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


