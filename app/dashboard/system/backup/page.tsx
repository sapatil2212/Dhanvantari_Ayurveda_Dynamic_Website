'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function BackupRestorePage() {
  const [running, setRunning] = useState(false);

  async function triggerBackup() {
    setRunning(true);
    try {
      const res = await fetch('/api/system/backup', { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Backup started');
    } catch (e) {
      toast.error('Failed to start backup');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Backup & Restore</h1>
        <p className="text-gray-600">Create and manage data backups</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual Backup</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={triggerBackup} disabled={running}>
            {running ? 'Starting...' : 'Start Backup'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


