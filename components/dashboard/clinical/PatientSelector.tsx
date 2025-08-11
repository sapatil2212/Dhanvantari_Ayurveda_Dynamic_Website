'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  medicalRecordNumber: string;
};

export function PatientSelector({ onSelect }: { onSelect: (patient: Patient | null) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);
  const controller = useRef<AbortController | null>(null);

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    controller.current?.abort();
    controller.current = new AbortController();
    const signal = controller.current.signal;
    setLoading(true);
    fetch(`/api/patients?q=${encodeURIComponent(debouncedQuery)}&take=10`, { signal })
      .then(async (res) => (res.ok ? res.json() : Promise.reject(await res.text())))
      .then((data) => {
        setResults(data.items || []);
      })
      .catch(() => {/* ignore */})
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const select = (p: Patient) => {
    setSelected(p);
    setResults([]);
    setQuery('');
    onSelect(p);
  };

  const clear = () => {
    setSelected(null);
    onSelect(null);
  };

  const selectedLabel = useMemo(() => {
    if (!selected) return '';
    return `${selected.firstName} ${selected.lastName} · ${selected.medicalRecordNumber}`;
  }, [selected]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search patient by name, MRN, email or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {selected && (
          <Button variant="outline" onClick={clear}>Clear</Button>
        )}
      </div>
      {selected && (
        <div className="text-sm text-gray-600">Selected: <span className="font-medium">{selectedLabel}</span></div>
      )}
      {results.length > 0 && (
        <div className="rounded-md border bg-white shadow-sm">
          {results.map((p) => (
            <div
              key={p.id}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => select(p)}
            >
              <div className="font-medium">{p.firstName} {p.lastName}</div>
              <div className="text-xs text-gray-500">{p.medicalRecordNumber}</div>
            </div>
          ))}
        </div>
      )}
      {loading && <div className="text-xs text-gray-500">Searching…</div>}
    </div>
  );
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export type { Patient };


