import { NextResponse } from 'next/server'
import { readReports } from '@/lib/store'

export const runtime = 'nodejs'

export async function GET(_req: Request, context: any) {
  const reports = await readReports()
  const id = context?.params?.id as string | undefined
  if (!id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const report = reports.find(r => r.id === id)
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ report })
}
