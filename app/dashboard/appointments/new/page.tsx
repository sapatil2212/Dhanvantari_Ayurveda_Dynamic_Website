import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { Card, CardContent } from '@/components/ui/card';
import NewAppointmentForm from '@/components/dashboard/NewAppointmentForm';

export default async function AppointmentNewPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Appointment</h1>
        <p className="text-sm text-gray-500">Create a new appointment manually</p>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <NewAppointmentForm />
        </CardContent>
      </Card>
    </div>
  );
}

