"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Clock3, CalendarPlus, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog';
import { SuccessModal } from '@/components/ui/SuccessModal';
import AppointmentDetailModal from './AppointmentDetailModal';

export default function AppointmentActions({ id, currentStatus }: { id: string; currentStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'MISSED' }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [reschedule, setReschedule] = useState<{ date: string; time: string }>({ date: '', time: '' });
  const [updating, setUpdating] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [successKind, setSuccessKind] = useState<'success' | 'danger'>('success');

  const updateStatus = async (next: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'MISSED') => {
    setLoading(true);
    setUpdating(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus(next);
      setSuccessText(`Status updated to ${next}`);
      setSuccessKind(next === 'CANCELLED' || next === 'MISSED' ? 'danger' : 'success');
      setSuccessOpen(true);
      // toast notification-like feedback via success modal already shown
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const remove = async () => {
    setLoading(true);
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setDeleteSuccess(true);
    } finally {
      setLoading(false);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button size="sm" className="h-8 px-2 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200" variant="outline" disabled={loading || status === 'CONFIRMED'} onClick={() => updateStatus('CONFIRMED')}>Confirm</Button>
      <Button size="sm" className="h-8 px-2 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200" variant="outline" disabled={loading || status === 'PENDING'} onClick={() => updateStatus('PENDING')}>Pending</Button>
      <Button size="sm" className="h-8 px-2 text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200" variant="outline" disabled={loading || status === 'CANCELLED'} onClick={() => updateStatus('CANCELLED')}>Cancel</Button>
      <Button size="sm" className="h-8 px-2 text-xs bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200" variant="outline" disabled={loading || status === 'MISSED'} onClick={() => updateStatus('MISSED')}>
        <Clock3 className="mr-1 h-3.5 w-3.5" /> Missed
      </Button>

      <Button size="icon" className="h-8 w-8" variant="ghost" aria-label="View" title="View" onClick={() => setViewOpen(true)}>
        <Eye className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" className="h-8 w-8" variant="ghost" aria-label="Edit" title="Edit" onClick={() => setEditOpen(true)}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" className="h-8 w-8" variant="destructive" aria-label="Delete" title="Delete" onClick={() => setConfirmDelete(true)} disabled={loading}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" className="h-8 w-8" variant="ghost" aria-label="Reschedule" title="Reschedule" onClick={() => setRescheduleOpen(true)}>
        <CalendarPlus className="h-3.5 w-3.5" />
      </Button>
      <AppointmentDetailModal id={id} open={viewOpen} onOpenChange={setViewOpen} />
      <AppointmentDetailModal id={id} open={editOpen} onOpenChange={setEditOpen} mode="edit" onSaved={() => window.location.reload()} />

      {/* Reschedule Modal */}
      {rescheduleOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-md bg-white p-4 shadow-lg">
            <div className="mb-3 text-base font-semibold">Reschedule Appointment</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500">New Date</div>
                <input type="date" className="mt-1 h-9 w-full rounded-md border px-2 text-sm" value={reschedule.date} onChange={(e) => setReschedule((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <div className="text-xs text-gray-500">New Time</div>
                <input type="time" className="mt-1 h-9 w-full rounded-md border px-2 text-sm" value={reschedule.time} onChange={(e) => setReschedule((p) => ({ ...p, time: e.target.value }))} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="h-9 rounded-md border px-3 text-sm" onClick={() => setRescheduleOpen(false)}>Cancel</button>
              <button
                className="h-9 rounded-md bg-emerald-600 px-3 text-sm text-white hover:bg-emerald-700"
                disabled={!reschedule.date || !reschedule.time || loading}
                onClick={async () => {
                  setLoading(true);
                  setUpdating(true);
                  try {
                    // Fetch current appointment to include old schedule in email
                    const current = await fetch(`/api/appointments/${id}`).then((r) => r.json());
                    const res = await fetch(`/api/appointments/${id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ preferredDate: reschedule.date, preferredTime: reschedule.time, status: 'CONFIRMED' }),
                    });
                    if (!res.ok) throw new Error('Failed');
                    // Fire reschedule email in background
                    fetch('/api/appointments/reschedule-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        to: current.email,
                        name: current.name,
                        consultationType: current.consultationType,
                        oldDate: current.preferredDate,
                        oldTime: current.preferredTime,
                        newDate: reschedule.date,
                        newTime: reschedule.time,
                        status: 'CONFIRMED',
                      }),
                    }).catch(() => {});
                    setSuccessText('Appointment rescheduled successfully');
                    setSuccessKind('success');
                    setSuccessOpen(true);
                  } finally {
                    setLoading(false);
                    setUpdating(false);
                    setRescheduleOpen(false);
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updating modal */}
      <Dialog open={updating}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Processing</DialogTitle>
            <DialogDescription>Please wait while we update the appointment...</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <div className="text-sm text-gray-600">Updating...</div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success modal */}
      <SuccessModal
        isOpen={successOpen}
        onClose={() => { setSuccessOpen(false); window.location.reload(); }}
        title="Success!"
        message={successText || 'Operation completed successfully.'}
        duration={3000}
      />

      {/* Success modal for delete */}
      <SuccessModal
        isOpen={deleteSuccess}
        onClose={() => { setConfirmDelete(false); setDeleteSuccess(false); window.location.reload(); }}
        title="Appointment Deleted!"
        message="Appointment deleted successfully."
        duration={3000}
      />

      {/* Delete confirm modal */}
      <AlertDialog open={confirmDelete}>
        <AlertDialogContent className="max-w-xs">
          {deleteSuccess ? null : (
            <>
              <AlertDialogHeader className="text-center sm:text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <AlertTriangle className="h-9 w-9" />
                </div>
                <AlertDialogTitle className="text-lg">Delete appointment?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mt-3 flex justify-center gap-2">
                <button className="h-9 rounded-md border px-3 text-sm" onClick={() => setConfirmDelete(false)} disabled={deleteLoading}>Cancel</button>
                <button className="h-9 rounded-md bg-rose-600 px-3 text-sm text-white hover:bg-rose-700 disabled:opacity-60" onClick={remove} disabled={deleteLoading}>
                  <span className="inline-flex items-center gap-2">
                    {deleteLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </span>
                </button>
              </div>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


