import { NextResponse } from 'next/server';

export async function GET() {
  console.log('✅ Cron job ran at:', new Date().toISOString());
  return NextResponse.json({ success: true });
}
