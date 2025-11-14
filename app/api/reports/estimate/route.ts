import { NextResponse } from 'next/server'
import { updateReportEstimates } from '@/lib/store'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const reportId = body?.reportId as string | undefined
  const estimates = body?.estimates as any[] | undefined
  if (!reportId || !Array.isArray(estimates)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  const updated = await updateReportEstimates(reportId, estimates as any)
  if (!updated) return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  return NextResponse.json({ report: updated })
}
