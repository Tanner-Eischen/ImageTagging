'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Detection {
  id: string
  type: string
  confidence: number
  location: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  box?: { left: number; top: number; width: number; height: number }
}

interface AnalysisReport {
  id: string
  photoId: string
  photoTitle: string
  analyzed: string
  status: 'completed' | 'in-progress'
  overallRisk: 'critical' | 'high' | 'medium' | 'low'
  detections: Detection[]
  image: string
  estimates?: { id: string; material: string; quantity: number; units: string; method: string; confidence: number }[]
}

export default function AnalysisPreviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [report, setReport] = useState<AnalysisReport | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/reports/${params.id}`)
        if (!res.ok) return
        const json = await res.json()
        setReport(json.report)
      } catch {}
    })()
  }, [params.id])

  useEffect(() => {
    if (searchParams.get('print') === '1') {
      const t = setTimeout(() => window.print(), 500)
      return () => clearTimeout(t)
    }
  }, [searchParams])

  const severityCount = (report?.detections || []).reduce((acc, det) => {
    acc[det.severity] = (acc[det.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analysis Report</h1>
          <p className="text-muted-foreground mt-1">Printable summary</p>
        </div>
        <Button onClick={() => window.print()} variant="outline" className="border-border/50">Print</Button>
      </div>

      {report ? (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{report.photoTitle}</CardTitle>
            <CardDescription>{report.analyzed}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img src={report.image || '/placeholder.svg'} alt={report.photoTitle} className="w-full rounded-lg border border-border/50" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground">Overall Risk</p>
                    <Badge
                      className={`mt-2 ${
                        report.overallRisk === 'critical'
                          ? 'bg-red-900/30 text-red-300'
                          : report.overallRisk === 'high'
                          ? 'bg-orange-900/30 text-orange-300'
                          : report.overallRisk === 'medium'
                          ? 'bg-yellow-900/30 text-yellow-300'
                          : 'bg-green-900/30 text-green-300'
                      }`}
                    >
                      {report.overallRisk}
                    </Badge>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Detections</p>
                    <p className="text-2xl font-bold mt-2">{report.detections.length}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(severityCount).map(([sev, count]) => (
                    <div key={sev} className="p-4 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground capitalize">{sev}</p>
                      <p className="text-2xl font-bold mt-2">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Findings</h3>
                <div className="space-y-3">
                  {report.detections.map((d) => (
                    <div key={d.id} className="p-4 border border-border/50 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{d.type}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{d.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">Location: {d.location}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`$${''}
                            ${
                              d.severity === 'critical'
                                ? 'bg-red-900/30 text-red-300'
                                : d.severity === 'high'
                                ? 'bg-orange-900/30 text-orange-300'
                                : d.severity === 'medium'
                                ? 'bg-yellow-900/30 text-yellow-300'
                                : 'bg-green-900/30 text-green-300'
                            }`}
                          >
                            {d.severity}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-2">Confidence: {Math.round(d.confidence * 100)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {report.estimates && report.estimates.length > 0 && (
              <div className="pt-6 border-t border-border/50">
                <h3 className="font-semibold mb-4">Material Estimates</h3>
                <div className="space-y-3">
                  {report.estimates.map((e) => (
                    <div key={e.id} className="p-4 border border-border/50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{e.material}</p>
                        <p className="text-xs text-muted-foreground mt-1">Method: {e.method}</p>
                      </div>
                      <Badge>{e.quantity} {e.units}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="p-6 border border-border/50 rounded-lg">Loading...</div>
      )}
    </div>
  )
}
