'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DetectionViewer } from '@/components/detection-viewer'
import { Badge } from '@/components/ui/badge'
import { Download, Share2, Eye } from 'lucide-react'

interface Detection {
  id: string
  type: string
  confidence: number
  location: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
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
}

export default function AnalysisPage() {
  const [reports, setReports] = useState<AnalysisReport[]>([])
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { reports } = await (await import('@/lib/api')).listReports()
        setReports(reports)
        setSelectedReport(reports[0] ?? null)
      } catch {}
    })()
  }, [])

  const severityCount = (selectedReport?.detections || []).reduce((acc, det) => {
    acc[det.severity] = (acc[det.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analysis Results</h1>
        <p className="text-muted-foreground mt-1">
          View detailed detection analysis for your photos
        </p>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-2">
          <p className="text-sm font-medium px-1">Recent Reports</p>
          <div className="space-y-2">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedReport?.id === report.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 hover:border-primary/50'
                }`}
              >
                <p className="font-medium text-sm line-clamp-1">{report.photoTitle}</p>
                <p className="text-xs text-muted-foreground mt-1">{report.analyzed}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={`text-xs ${
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
              </button>
            ))}
          </div>
        </div>

        {/* Main viewer */}
        <div className="lg:col-span-3">
          {selectedReport ? (
            <DetectionViewer
              imageUrl={selectedReport.image}
              detections={selectedReport.detections}
              title={selectedReport.photoTitle}
            />
          ) : (
            <div className="p-6 border border-border/50 rounded-lg">No reports available</div>
          )}
        </div>
      </div>

      {/* Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analysis Summary</CardTitle>
              <CardDescription>
                {selectedReport?.photoTitle || 'No selection'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border/50 gap-2">
                <Eye className="w-4 h-4" />
                Preview Report
              </Button>
              <Button variant="outline" size="sm" className="border-border/50 gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="border-border/50 gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground">Overall Risk</p>
              {selectedReport && (
              <Badge
                className={`mt-2 ${
                  selectedReport.overallRisk === 'critical'
                    ? 'bg-red-900/30 text-red-300'
                    : selectedReport.overallRisk === 'high'
                    ? 'bg-orange-900/30 text-orange-300'
                    : selectedReport.overallRisk === 'medium'
                    ? 'bg-yellow-900/30 text-yellow-300'
                    : 'bg-green-900/30 text-green-300'
                }`}
              >
                {selectedReport.overallRisk}
              </Badge>
              )}
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground">Total Detections</p>
              <p className="text-2xl font-bold mt-2">{selectedReport?.detections.length || 0}</p>
            </div>
            {Object.entries(severityCount).map(([severity, count]) => (
              <div key={severity} className="p-4 bg-secondary rounded-lg">
                <p className="text-xs text-muted-foreground capitalize">{severity}</p>
                <p className="text-2xl font-bold mt-2">{count}</p>
              </div>
            ))}
          </div>

          {/* Detailed findings */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="font-semibold mb-4">Detailed Findings</h3>
            <div className="space-y-3">
              {(selectedReport?.detections || []).map((detection) => (
                <div key={detection.id} className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{detection.type}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{detection.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">Location: {detection.location}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`${
                          detection.severity === 'critical'
                            ? 'bg-red-900/30 text-red-300'
                            : detection.severity === 'high'
                            ? 'bg-orange-900/30 text-orange-300'
                            : detection.severity === 'medium'
                            ? 'bg-yellow-900/30 text-yellow-300'
                            : 'bg-green-900/30 text-green-300'
                        }`}
                      >
                        {detection.severity}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Confidence: {Math.round(detection.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
