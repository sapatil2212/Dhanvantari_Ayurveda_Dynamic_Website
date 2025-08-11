import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dynamic from 'next/dynamic';

const LifestyleManager = dynamic(() => import('@/components/dashboard/clinical/LifestyleManager'), { ssr: false });

export default async function ClinicalLifestylePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Lifestyle Assessment</h1>
      <LifestyleManager />
    </div>
  );
}


