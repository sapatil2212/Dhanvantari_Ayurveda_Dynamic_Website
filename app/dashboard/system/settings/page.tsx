'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Setting = {
  id: string;
  key: string;
  value: string;
  description?: string | null;
  category?: string | null;
};

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetch('/api/system/settings');
      if (!res.ok) throw new Error('Failed to load settings');
      const data = await res.json();
      setSettings(data.items);
    } catch (e) {
      toast.error('Failed to load settings');
    }
  }

  async function save(setting: Setting) {
    setSaving(setting.id);
    try {
      const res = await fetch(`/api/system/settings/${setting.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: setting.value }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Setting saved');
    } catch (e) {
      toast.error('Failed to save setting');
    } finally {
      setSaving(null);
    }
  }

  async function addSetting() {
    const key = prompt('Key?');
    if (!key) return;
    const value = prompt('Value?') ?? '';
    const description = prompt('Description?') ?? '';
    const category = prompt('Category?') ?? '';
    try {
      const res = await fetch('/api/system/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, description, category }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Setting created');
      load();
    } catch {
      toast.error('Failed to create setting');
    }
  }

  async function deleteSetting(id: string) {
    if (!confirm('Delete this setting?')) return;
    try {
      const res = await fetch(`/api/system/settings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Setting deleted');
      setSettings((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error('Failed to delete setting');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-600">Configure application-wide settings</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Settings</CardTitle>
          <Button onClick={addSetting}>Add</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.length === 0 ? (
            <p className="text-gray-600">No settings found</p>
          ) : (
            settings.map((s) => (
              <div key={s.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div>
                  <div className="font-medium">{s.key}</div>
                  {s.description && <div className="text-sm text-gray-500">{s.description}</div>}
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Input
                    value={s.value}
                    onChange={(e) => setSettings((prev) => prev.map((it) => it.id === s.id ? { ...it, value: e.target.value } : it))}
                  />
                  <Button onClick={() => save(s)} disabled={saving === s.id}>{saving === s.id ? 'Saving...' : 'Save'}</Button>
                  <Button variant="destructive" onClick={() => deleteSetting(s.id)}>Delete</Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}


