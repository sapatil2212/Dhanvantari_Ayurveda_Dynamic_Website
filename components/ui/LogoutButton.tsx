"use client";
import { signOut } from 'next-auth/react';
import { Button } from './button';

export function LogoutButton() {
  return (
    <Button variant="secondary" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
      Logout
    </Button>
  );
}


