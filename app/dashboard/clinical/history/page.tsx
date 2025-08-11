import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dynamic from 'next/dynamic';

const MedicalHistoryManager = dynamic(() => import('@/components/dashboard/clinical/MedicalHistoryManager'), { ssr: false });

export default async function ClinicalHistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Medical History</h1>
      <MedicalHistoryManager />
    </div>
  );
}


