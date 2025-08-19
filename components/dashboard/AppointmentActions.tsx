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
    <div className="flex items-center gap-0.5 sm:gap-1">
      <Button size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200" variant="outline" disabled={loading || status === 'CONFIRMED'} onClick={() => updateStatus('CONFIRMED')} noShimmer>
        <span className="hidden sm:inline">Confirm</span>
        <span className="sm:hidden">✓</span>
      </Button>
      <Button size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200" variant="outline" disabled={loading || status === 'PENDING'} onClick={() => updateStatus('PENDING')} noShimmer>
        <span className="hidden sm:inline">Pending</span>
        <span className="sm:hidden">⏳</span>
      </Button>
      <Button size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200" variant="outline" disabled={loading || status === 'CANCELLED'} onClick={() => updateStatus('CANCELLED')} noShimmer>
        <span className="hidden sm:inline">Cancel</span>
        <span className="sm:hidden">✕</span>
      </Button>
      <Button size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-xs bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200" variant="outline" disabled={loading || status === 'MISSED'} onClick={() => updateStatus('MISSED')} noShimmer>
        <Clock3 className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" /> 
        <span className="hidden sm:inline">Missed</span>
        <span className="sm:hidden">⏰</span>
      </Button>

      <Button size="icon" className="h-6 w-6 sm:h-8 sm:w-8" variant="ghost" aria-label="View" title="View" onClick={() => setViewOpen(true)} noShimmer>
        <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </Button>
      <Button size="icon" className="h-6 w-6 sm:h-8 sm:w-8" variant="ghost" aria-label="Edit" title="Edit" onClick={() => setEditOpen(true)} noShimmer>
        <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </Button>
      <Button size="icon" className="h-6 w-6 sm:h-8 sm:w-8" variant="destructive" aria-label="Delete" title="Delete" onClick={() => setConfirmDelete(true)} disabled={loading} noShimmer>
        <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </Button>
      <Button size="icon" className="h-6 w-6 sm:h-8 sm:w-8" variant="ghost" aria-label="Reschedule" title="Reschedule" onClick={() => setRescheduleOpen(true)} noShimmer>
        <CalendarPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </Button>
      <AppointmentDetailModal id={id} open={viewOpen} onOpenChange={setViewOpen} />
      <AppointmentDetailModal id={id} open={editOpen} onOpenChange={setEditOpen} mode="edit" onSaved={() => window.location.reload()} />

      {/* Reschedule Modal */}
      {rescheduleOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-4 shadow-lg">
            <div className="mb-3 text-sm sm:text-base font-semibold">Reschedule Appointment</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500">New Date</div>
                <input type="date" className="mt-1 h-8 sm:h-9 w-full rounded-md border px-2 text-xs sm:text-sm" value={reschedule.date} onChange={(e) => setReschedule((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <div className="text-xs text-gray-500">New Time</div>
                <input type="time" className="mt-1 h-8 sm:h-9 w-full rounded-md border px-2 text-xs sm:text-sm" value={reschedule.time} onChange={(e) => setReschedule((p) => ({ ...p, time: e.target.value }))} />
              </div>
            </div>
                         <div className="mt-4 flex justify-end gap-2">
               <Button variant="outline" className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm" onClick={() => setRescheduleOpen(false)} noShimmer>Cancel</Button>
               <Button
                 className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700"
                 disabled={!reschedule.date || !reschedule.time || loading}
                 noShimmer
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
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* Updating modal */}
      <Dialog open={updating}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-base">Processing</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">Please wait while we update the appointment...</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-2">
            <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <div className="text-xs sm:text-sm text-gray-600">Updating...</div>
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
                <div className="mx-auto mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <AlertTriangle className="h-7 w-7 sm:h-9 sm:w-9" />
                </div>
                <AlertDialogTitle className="text-base sm:text-lg">Delete appointment?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm">This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mt-3 flex justify-center gap-2">
                <Button variant="outline" className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm" onClick={() => setConfirmDelete(false)} disabled={deleteLoading} noShimmer>Cancel</Button>
                <Button className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm bg-rose-600 hover:bg-rose-700 disabled:opacity-60" onClick={remove} disabled={deleteLoading} noShimmer>
                  <span className="inline-flex items-center gap-2">
                    {deleteLoading && <span className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </span>
                </Button>
              </div>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


