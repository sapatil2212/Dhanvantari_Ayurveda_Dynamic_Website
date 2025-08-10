"use client";
import { usePathname } from 'next/navigation';

export default function ClientChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard')) return null;
  return <>{children}</>;
}


