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

async function createTask(token: string, apiPath: string, payload: any, base?: string) {
  const urlBase = base || 'https://api.deepdataspace.com'
  const url = `${urlBase}/v2/task/${apiPath}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Token: token },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('DINOX task creation failed')
  const json = await res.json()
  const uuid = json?.data?.task_uuid
  if (!uuid) throw new Error('Missing task_uuid')
  return { uuid, base: urlBase }
}

async function waitForResult(token: string, uuid: string, base?: string) {
  const urlBase = base || 'https://api.deepdataspace.com'
  const url = `${urlBase}/v2/task_status/${uuid}`
  let attempts = 0
  while (attempts < 60) {
    const res = await fetch(url, { headers: { Token: token } })
    if (!res.ok) throw new Error('DINOX status polling failed')
    const json = await res.json()
    const status = json?.data?.status
    if (status && status !== 'waiting' && status !== 'running') return json
    await new Promise(r => setTimeout(r, 1000))
    attempts++
  }
  throw new Error('DINOX polling timeout')
}

export async function analyzeWithDinox(bytes: Buffer, prompts: string[]): Promise<Detection[]> {
  const token = process.env.DINOX_TOKEN
  const apiPath = process.env.DINOX_API_PATH || 'dinox/detection'
  const base = process.env.DINOX_BASE
  if (!token) throw new Error('Missing DINOX_TOKEN')
  const base64 = bytes.toString('base64')
  const payload = { image: `data:image/jpeg;base64,${base64}`, prompts }
  const { uuid, base: usedBase } = await createTask(token, apiPath, payload, base)
  const final = await waitForResult(token, uuid, usedBase)
  const result = final?.data?.result || final?.data || final
  const items = Array.isArray(result?.detections) ? result.detections : (Array.isArray(result) ? result : [])
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
