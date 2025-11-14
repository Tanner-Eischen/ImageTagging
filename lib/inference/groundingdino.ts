import type { Detection, AnalysisReport } from '@/lib/store'

function sev(c: number): AnalysisReport['overallRisk'] {
  if (c >= 0.9) return 'high'
  if (c >= 0.8) return 'medium'
  return 'low'
}

function normalizeBox(b: any): { left: number; top: number; width: number; height: number } | undefined {
  if (!b) return undefined
  if (typeof b.left === 'number' && typeof b.top === 'number' && typeof b.width === 'number' && typeof b.height === 'number') {
    return { left: b.left, top: b.top, width: b.width, height: b.height }
  }
  if (Array.isArray(b) && b.length === 4 && typeof b[0] === 'number') {
    const [x1, y1, x2, y2] = b
    const meta: any = b as any
    const w = (meta.imageWidth || meta.imgW || meta.w) || undefined
    const h = (meta.imageHeight || meta.imgH || meta.h) || undefined
    if (typeof w === 'number' && typeof h === 'number' && w > 0 && h > 0) {
      return { left: x1 / w, top: y1 / h, width: (x2 - x1) / w, height: (y2 - y1) / h }
    }
  }
  return undefined
}

export async function analyzeWithGroundingDINO(bytes: Buffer, prompts: string[]): Promise<Detection[]> {
  const url = process.env.GROUNDDINO_URL
  if (!url) throw new Error('Missing GROUNDDINO_URL')
  const base64 = bytes.toString('base64')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: `data:image/jpeg;base64,${base64}`, prompts }),
  })
  if (!res.ok) throw new Error('GroundingDINO inference failed')
  const data = await res.json()
  const items = Array.isArray(data.detections) ? data.detections : data
  const detections: Detection[] = []
  for (const it of items) {
    const label = it.label || it.text || it.class || it.type || 'Unknown'
    const conf = typeof it.confidence === 'number' ? it.confidence : (typeof it.score === 'number' ? it.score : 0)
    const b = normalizeBox(it.box || it.bbox || it.boundingBox)
    detections.push({
      id: `${label}-${Math.random().toString(36).slice(2)}`,
      type: label,
      confidence: conf,
      location: 'Detected region',
      severity: sev(conf),
      description: label,
      box: b,
    })
  }
  return detections
}
