'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Database, HardDriveDownload } from 'lucide-react';

export default function SystemIndexPage() {
  const tiles = [
    { href: '/dashboard/system/users', title: 'Users & Roles', icon: Shield, description: 'Manage users, roles and access' },
    { href: '/dashboard/system/settings', title: 'System Settings', icon: Settings, description: 'Configure global settings' },
    { href: '/dashboard/system/audit-logs', title: 'Audit Logs', icon: Database, description: 'View system activity' },
    { href: '/dashboard/system/backup', title: 'Backup & Restore', icon: HardDriveDownload, description: 'Backup and restore data' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-gray-600">Manage users, settings, logs and backups</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiles.map((tile) => (
          <Card key={tile.href}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{tile.title}</CardTitle>
              <tile.icon className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{tile.description}</p>
              <Button asChild>
                <Link href={tile.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


