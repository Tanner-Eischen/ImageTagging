'use client'

import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MATERIALS, areaFromBoxFraction, cubicYardsFromAreaAndDepth } from '@/lib/materials'

interface Detection {
  id: string
  type: string
  confidence: number
  location: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  box?: { left: number; top: number; width: number; height: number }
}

interface EstimateDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  reportId: string
  detections: Detection[]
}

export function EstimationDialog({ open, onOpenChange, reportId, detections }: EstimateDialogProps) {
  const [scaleFtPerImageWidth, setScaleFtPerImageWidth] = useState<number>(20)
  const [depthInches, setDepthInches] = useState<number>(3)
  const [saving, setSaving] = useState(false)

  const materialDetections = useMemo(() => {
    return detections.filter(d => {
      const t = d.type.toLowerCase()
      return t.includes('plywood') || t.includes('osb') || t.includes('shingle') || t.includes('bundle') || t.includes('felt') || t.includes('gravel') || t.includes('mulch') || t.includes('lumber') || t.includes('drywall')
    })
  }, [detections])

  const estimates = useMemo(() => {
    const est: { id: string; material: string; quantity: number; units: string; method: string; confidence: number }[] = []
    const imgWft = scaleFtPerImageWidth
    const imgHft = imgWft * (9 / 16)
    for (const d of materialDetections) {
      const label = d.type
      const m = (MATERIALS as Record<string, any>)[label] || MATERIALS['Plywood']
      if ((label.toLowerCase().includes('gravel') || label.toLowerCase().includes('mulch')) && d.box) {
        const area = areaFromBoxFraction(imgWft, imgHft, d.box)
        const yards = cubicYardsFromAreaAndDepth(area, depthInches)
        est.push({ id: d.id, material: label, quantity: Math.round(yards * 100) / 100, units: 'cubic yards', method: 'box-area-depth', confidence: d.confidence })
      } else if ((label.toLowerCase().includes('shingle') || label.toLowerCase().includes('bundle')) && d.box) {
        const area = areaFromBoxFraction(imgWft, imgHft, d.box)
        const bundles = m?.coverage_ft2 ? Math.max(1, Math.round(area / m.coverage_ft2)) : Math.max(1, Math.round(area / 33.3))
        est.push({ id: d.id, material: 'Shingle Bundle', quantity: bundles, units: 'bundles', method: 'area-coverage', confidence: d.confidence })
      } else if ((label.toLowerCase().includes('plywood') || label.toLowerCase().includes('osb')) && d.box) {
        const area = areaFromBoxFraction(imgWft, imgHft, d.box)
        const sheets = Math.max(1, Math.round(area / (m?.area_ft2 || 32)))
        est.push({ id: d.id, material: label.includes('OSB') ? 'OSB' : 'Plywood', quantity: sheets, units: 'sheets', method: 'area-tile', confidence: d.confidence })
      } else if (label.toLowerCase().includes('felt') && d.box) {
        const area = areaFromBoxFraction(imgWft, imgHft, d.box)
        const rolls = m?.coverage_ft2 ? Math.max(1, Math.round(area / m.coverage_ft2)) : Math.max(1, Math.round(area / 200))
        est.push({ id: d.id, material: 'Roofing felt', quantity: rolls, units: 'rolls', method: 'area-coverage', confidence: d.confidence })
      }
    }
    return est
  }, [materialDetections, scaleFtPerImageWidth, depthInches])

  const save = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/reports/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, estimates }),
      })
      setSaving(false)
      if (!res.ok) return
      onOpenChange(false)
    } catch {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Estimate Quantities</DialogTitle>
          <DialogDescription>Adjust scale and confirm estimates</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Image width scale (ft)</p>
              <Input type="number" value={scaleFtPerImageWidth} onChange={(e) => setScaleFtPerImageWidth(parseFloat(e.target.value || '0'))} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Depth for loose materials (in)</p>
              <Input type="number" value={depthInches} onChange={(e) => setDepthInches(parseFloat(e.target.value || '0'))} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Detected materials ({materialDetections.length})</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {estimates.map((e) => (
                <div key={e.id} className="p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{e.material}</p>
                      <p className="text-xs text-muted-foreground">Method: {e.method}</p>
                    </div>
                    <Badge>{e.quantity} {e.units}</Badge>
                  </div>
                </div>
              ))}
              {estimates.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground border border-border/50 rounded-lg">No materials detected with boxes</div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving || estimates.length === 0}>{saving ? 'Saving...' : 'Confirm Estimates'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
