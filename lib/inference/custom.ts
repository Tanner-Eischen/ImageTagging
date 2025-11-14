import type { Detection, AnalysisReport } from '@/lib/store'

function sev(c: number): AnalysisReport['overallRisk'] {
  if (c >= 0.9) return 'high'
  if (c >= 0.8) return 'medium'
  return 'low'
}

export async function analyzeWithCustom(bytes: Buffer): Promise<Detection[]> {
  const url = process.env.CUSTOM_INFERENCE_URL
  if (!url) throw new Error('Missing CUSTOM_INFERENCE_URL')
  const base64 = bytes.toString('base64')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: `data:image/jpeg;base64,${base64}` }),
  })
  if (!res.ok) throw new Error('Custom inference failed')
  const data = await res.json()
  const items = Array.isArray(data.detections) ? data.detections : data
  const detections: Detection[] = []
  for (const it of items) {
    const label = it.label || it.class || it.type || 'Unknown'
    const conf = typeof it.confidence === 'number' ? it.confidence : (typeof it.score === 'number' ? it.score : 0)
    const b = it.box || it.bbox || it.boundingBox
    detections.push({
      id: `${label}-${Math.random().toString(36).slice(2)}`,
      type: label,
      confidence: conf,
      location: 'Detected region',
      severity: sev(conf),
      description: label,
      box: b ? { left: b.left ?? b.x ?? 0, top: b.top ?? b.y ?? 0, width: b.width ?? b.w ?? 0, height: b.height ?? b.h ?? 0 } : undefined,
    })
  }
  return detections
}
