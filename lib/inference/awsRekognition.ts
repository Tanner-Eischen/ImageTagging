import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition'
import type { Detection, AnalysisReport } from '@/lib/store'

function severityFromConfidence(c: number): AnalysisReport['overallRisk'] {
  if (c >= 0.9) return 'high'
  if (c >= 0.8) return 'medium'
  return 'low'
}

function mapLabelToType(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('crack')) return 'Structural Crack'
  if (n.includes('roof')) return 'Roof Surface'
  if (n.includes('shingle')) return 'Shingle'
  if (n.includes('water') || n.includes('leak') || n.includes('stain')) return 'Water Staining'
  if (n.includes('chimney')) return 'Flashing Area'
  if (n.includes('plywood')) return 'Plywood'
  if (n.includes('gravel') || n.includes('mulch')) return 'Loose Material'
  return name
}

export async function analyzeWithRekognition(bytes: Buffer): Promise<Detection[]> {
  const region = process.env.AWS_REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  if (!region || !accessKeyId || !secretAccessKey) throw new Error('Missing AWS credentials')

  const client = new RekognitionClient({ region, credentials: { accessKeyId, secretAccessKey } })
  const cmd = new DetectLabelsCommand({ Image: { Bytes: bytes }, MinConfidence: 70, Features: ['GENERAL_LABELS'] as any })
  const res = await client.send(cmd)

  const detections: Detection[] = []
  for (const label of res.Labels || []) {
    const type = mapLabelToType(label.Name || 'Unknown')
    const conf = (label.Confidence || 0) / 100
    const sev = severityFromConfidence(conf)
    if (label.Instances && label.Instances.length > 0) {
      for (const inst of label.Instances) {
        const b = inst.BoundingBox
        detections.push({
          id: `${label.Name}-${Math.random().toString(36).slice(2)}`,
          type,
          confidence: conf,
          location: 'Detected region',
          severity: sev,
          description: type,
          box: b
            ? { left: b.Left || 0, top: b.Top || 0, width: b.Width || 0, height: b.Height || 0 }
            : undefined,
        })
      }
    } else {
      detections.push({
        id: `${label.Name}-${Math.random().toString(36).slice(2)}`,
        type,
        confidence: conf,
        location: 'Scene',
        severity: sev,
        description: type,
      })
    }
  }
  return detections
}
