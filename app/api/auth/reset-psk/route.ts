import { NextResponse } from 'next/server';

export async function GET() {
  // This route exists to help verify env variables are loaded (no real PSK reset here)
  if (!process.env.AGENCY_PSK) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}


