"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { FileDown, Plus, Search, CalendarRange, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type DateRange = { from?: Date; to?: Date };

export default function AppointmentToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [range, setRange] = useState<DateRange>(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    return { from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined };
  });
  const [downloading, setDownloading] = useState<'csv'|'docx'|'pdf'|null>(null);
  const [open, setOpen] = useState(false);

  const smallCalendarClasses = {
    months: 'flex flex-col space-y-2',
    month: 'space-y-2',
    caption: 'flex justify-center pt-0 relative items-center',
    caption_label: 'text-[0.8rem] font-medium',
    nav: 'space-x-1 flex items-center',
    nav_button: 'h-6 w-6 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-md border',
    nav_button_previous: 'absolute left-1',
    nav_button_next: 'absolute right-1',
    table: 'w-full border-collapse',
    head_row: 'flex',
    head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]',
    row: 'flex w-full mt-1',
    cell: 'h-7 w-7 text-center text-xs p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
    day: 'h-7 w-7 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent/60',
    day_selected:
      'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
    day_today: 'bg-accent text-accent-foreground',
    day_outside:
      'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
    day_disabled: 'text-muted-foreground opacity-50',
    day_range_end: 'day-range-end',
    day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
    day_hidden: 'invisible',
  } as const;

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    if (query) sp.set('q', query); else sp.delete('q');
    if (range.from) sp.set('from', range.from.toISOString().slice(0,10)); else sp.delete('from');
    if (range.to) sp.set('to', range.to.toISOString().slice(0,10)); else sp.delete('to');
    router.replace(`/dashboard/appointments?${sp.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, range.from?.getTime?.(), range.to?.getTime?.()]);

  const exportFile = async (format: 'csv' | 'docx' | 'pdf') => {
    setDownloading(format);
    try {
      const sp = new URLSearchParams();
      if (query) sp.set('q', query);
      if (range.from) sp.set('from', range.from.toISOString());
      if (range.to) sp.set('to', range.to.toISOString());
      sp.set('format', format);
      const res = await fetch(`/api/appointments/export?${sp.toString()}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments.${format === 'docx' ? 'docx' : format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8 h-9 w-64" placeholder="Search name / email / contact" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" className="h-9">
              <CalendarRange className="mr-2 h-4 w-4" /> Date:
              <span className="ml-2">{range.from ? new Date(range.from).toISOString().slice(0,10) : 'From'}</span>
              <span className="mx-1">-</span>
              {range.to ? new Date(range.to).toISOString().slice(0,10) : 'To'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="end">
            <div className="flex items-center justify-between pb-2 border-b mb-2">
              <div className="text-sm font-medium">Select date range</div>
              <button onClick={() => setOpen(false)} aria-label="Close date picker" className="rounded p-1 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-4">
              <div>
                <div className="mb-2 text-xs text-gray-500">From date</div>
                <Calendar
                  mode="single"
                  selected={range.from}
                  onSelect={(d) => setRange({ from: d ?? undefined, to: range.to })}
                  numberOfMonths={1}
                  className="p-1"
                  classNames={smallCalendarClasses as any}
                />
              </div>
              <div>
                <div className="mb-2 text-xs text-gray-500">To date</div>
                <Calendar
                  mode="single"
                  selected={range.to}
                  onSelect={(d) => setRange({ from: range.from, to: d ?? undefined })}
                  numberOfMonths={1}
                  className="p-1"
                  classNames={smallCalendarClasses as any}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setRange({ from: undefined, to: undefined })}>Clear</Button>
              <Button size="sm" onClick={() => setOpen(false)}>Done</Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button size="sm" variant="outline" className="h-9" onClick={() => exportFile('csv')} disabled={!!downloading}>
          <FileDown className="mr-2 h-4 w-4" /> CSV
        </Button>
        <Button size="sm" variant="outline" className="h-9" onClick={() => exportFile('docx')} disabled={!!downloading}>
          <FileDown className="mr-2 h-4 w-4" /> Word
        </Button>
        <Button size="sm" variant="outline" className="h-9" onClick={() => exportFile('pdf')} disabled={!!downloading}>
          <FileDown className="mr-2 h-4 w-4" /> PDF
        </Button>
        <Button size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/dashboard/appointments/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>
    </div>
  );
}


