import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { readPhotos, addReport, updatePhotoStatus, AnalysisReport, Detection } from '@/lib/store'

export const runtime = 'nodejs'

function hashSeed(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function rand(seed: number) {
  let x = seed || 123456789
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  return (x >>> 0) / 0xffffffff
}

function makeDetections(title: string, imagePath: string, seedBase: string): { detections: Detection[]; risk: AnalysisReport['overallRisk'] } {
  const seed = hashSeed(seedBase)
  const lower = `${title} ${imagePath}`.toLowerCase()
  const detections: Detection[] = []
  let risk: AnalysisReport['overallRisk'] = 'low'
  if (lower.includes('roof')) {
    detections.push({ id: randomUUID(), type: 'Hail Impact', confidence: 0.85 + rand(seed) * 0.1, location: 'Upper left section', severity: 'high', description: 'Circular impact marks consistent with hail' })
    detections.push({ id: randomUUID(), type: 'Missing Shingles', confidence: 0.8 + rand(seed + 1) * 0.15, location: 'Center area', severity: 'medium', description: 'Exposed underlayment indicating shingle loss' })
    detections.push({ id: randomUUID(), type: 'Flashing Issues', confidence: 0.7 + rand(seed + 2) * 0.2, location: 'Chimney area', severity: 'medium', description: 'Potential gaps in flashing around penetration' })
    risk = 'high'
  } else if (lower.includes('foundation') || lower.includes('crack')) {
    detections.push({ id: randomUUID(), type: 'Structural Crack', confidence: 0.9 + rand(seed) * 0.08, location: 'Lower foundation wall', severity: 'critical', description: 'Vertical crack suggesting settlement movement' })
    detections.push({ id: randomUUID(), type: 'Efflorescence', confidence: 0.8 + rand(seed + 1) * 0.1, location: 'Crack edges', severity: 'medium', description: 'Mineral deposits indicating water ingress' })
    risk = 'critical'
  } else if (lower.includes('water')) {
    detections.push({ id: randomUUID(), type: 'Water Staining', confidence: 0.82 + rand(seed) * 0.12, location: 'Center area', severity: 'medium', description: 'Discoloration consistent with moisture exposure' })
    risk = 'medium'
  } else {
    detections.push({ id: randomUUID(), type: 'Anomaly', confidence: 0.6 + rand(seed) * 0.2, location: 'General area', severity: 'low', description: 'Pattern irregularity detected' })
    risk = 'low'
  }
  return { detections, risk }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const photoId = body?.photoId as string | undefined
  if (!photoId) return NextResponse.json({ error: 'photoId required' }, { status: 400 })
  const photos = await readPhotos()
  const photo = photos.find(p => p.id === photoId)
  if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })

  const { detections, risk } = makeDetections(photo.title, photo.image, photo.id)
  const report: AnalysisReport = {
    id: randomUUID(),
    photoId: photo.id,
    photoTitle: photo.title,
    analyzed: new Date().toISOString().split('T')[0],
    status: 'completed',
    overallRisk: risk,
    detections,
    image: photo.image,
  }
  await addReport(report)
  await updatePhotoStatus(photo.id, 'analyzed')
  return NextResponse.json({ report }, { status: 201 })
}
