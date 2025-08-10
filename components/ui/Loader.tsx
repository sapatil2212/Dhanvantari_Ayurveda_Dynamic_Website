"use client";
import React from 'react';

export function Spinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-emerald-600 border-t-transparent ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-white p-6 shadow-xl">
        <Spinner size={28} />
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}


