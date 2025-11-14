import { NextResponse } from 'next/server'
import { readReports } from '@/lib/store'

export const runtime = 'nodejs'

export async function GET() {
  const reports = await readReports()
  return NextResponse.json({ reports })
}
