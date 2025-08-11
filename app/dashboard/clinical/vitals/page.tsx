import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dynamic from 'next/dynamic';

const VitalsManager = dynamic(() => import('@/components/dashboard/clinical/VitalsManager'), { ssr: false });

export default async function ClinicalVitalsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Vital Signs</h1>
      <VitalsManager />
    </div>
  );
}


