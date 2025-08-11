import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function ClinicalToolsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  const links = [
    { href: '/dashboard/clinical/vitals', title: 'Vital Signs', desc: 'Record and review vital signs' },
    { href: '/dashboard/clinical/allergies', title: 'Allergies', desc: 'Manage allergy and intolerance records' },
    { href: '/dashboard/clinical/history', title: 'Medical History', desc: 'Document past medical conditions' },
    { href: '/dashboard/clinical/lifestyle', title: 'Lifestyle Assessment', desc: 'Capture lifestyle and habits' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Clinical Tools</h1>
        <p className="text-sm text-gray-500">Select a tool to manage clinical records</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="text-lg font-medium">{l.title}</div>
                <div className="text-sm text-gray-600">{l.desc}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


