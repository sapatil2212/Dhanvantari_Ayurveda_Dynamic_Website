import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';

export default async function AppointmentViewPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const a = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!a) redirect('/dashboard/appointments');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Appointment Detail</h1>
        <p className="text-sm text-gray-500">Review the full appointment information</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-4 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-gray-500">Patient</div>
              <div className="font-medium">{a.name}</div>
              <div className="text-xs text-gray-500">{a.gender ?? '-'}{a.age ? ` · ${a.age}y` : ''}</div>
            </div>
            <div>
              <div className="text-gray-500">Contact</div>
              <div>{a.phone}</div>
              <div className="text-xs text-gray-500">{a.email}</div>
            </div>
            <div>
              <div className="text-gray-500">Consultation</div>
              <div>{a.consultationType}</div>
            </div>
            <div>
              <div className="text-gray-500">Schedule</div>
              <div>{new Date(a.preferredDate).toLocaleDateString()} · {a.preferredTime}</div>
            </div>
            <div>
              <div className="text-gray-500">Status</div>
              <div>{a.status}</div>
            </div>
            <div>
              <div className="text-gray-500">Created</div>
              <div>{new Date(a.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div>
            <div className="text-gray-500">Chief Complaint</div>
            <div>{a.chiefComplaint}</div>
          </div>
          {a.previousTreatment && (
            <div>
              <div className="text-gray-500">Previous Treatments</div>
              <div>{a.previousTreatment}</div>
            </div>
          )}
          {a.medications && (
            <div>
              <div className="text-gray-500">Medications</div>
              <div>{a.medications}</div>
            </div>
          )}
          {a.additionalNotes && (
            <div>
              <div className="text-gray-500">Additional Notes</div>
              <div>{a.additionalNotes}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


