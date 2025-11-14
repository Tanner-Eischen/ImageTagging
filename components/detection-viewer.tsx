'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Detection {
  id: string
  type: string
  confidence: number
  location: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  box?: { left: number; top: number; width: number; height: number }
}

interface DetectionViewerProps {
  imageUrl: string
  detections: Detection[]
  title: string
}

export function DetectionViewer({
  imageUrl,
  detections,
  title,
}: DetectionViewerProps) {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [dims, setDims] = useState({ contW: 0, contH: 0, natW: 0, natH: 0 })

  const severityColors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#eab308',
    low: '#22c55e',
  }

  const severityData = [
    { name: 'Critical', value: detections.filter(d => d.severity === 'critical').length, fill: severityColors.critical },
    { name: 'High', value: detections.filter(d => d.severity === 'high').length, fill: severityColors.high },
    { name: 'Medium', value: detections.filter(d => d.severity === 'medium').length, fill: severityColors.medium },
    { name: 'Low', value: detections.filter(d => d.severity === 'low').length, fill: severityColors.low },
  ].filter(d => d.value > 0)

  const confidenceData = detections.map(d => ({
    name: d.type.substring(0, 10),
    confidence: Math.round(d.confidence * 100),
  }))

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current
      if (!c) return
      const rect = c.getBoundingClientRect()
      setDims(prev => ({ ...prev, contW: rect.width, contH: rect.height }))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const onImgLoad = () => {
    const img = imgRef.current
    if (!img) return
    setDims(prev => ({ ...prev, natW: img.naturalWidth, natH: img.naturalHeight }))
  }

  const boxStyle = (d: Detection) => {
    if (!d.box || dims.contW === 0 || dims.contH === 0 || dims.natW === 0 || dims.natH === 0) {
      return {
        left: `${Math.random() * 60 + 10}%`,
        top: `${Math.random() * 60 + 10}%`,
        width: '15%',
        height: '15%',
      }
    }
    const scale = Math.min(dims.contW / dims.natW, dims.contH / dims.natH)
    const dispW = dims.natW * scale
    const dispH = dims.natH * scale
    const offsetX = (dims.contW - dispW) / 2
    const offsetY = (dims.contH - dispH) / 2
    const left = offsetX + d.box.left * dispW
    const top = offsetY + d.box.top * dispH
    const width = d.box.width * dispW
    const height = d.box.height * dispH
    return { left, top, width, height }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Image with overlays */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="border-border/50 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>
              {detections.length} detection(s) found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div ref={containerRef} className="relative bg-secondary aspect-video overflow-auto">
              <img
                ref={imgRef}
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-contain"
                onLoad={onImgLoad}
              />
              {/* Detection boxes overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {detections.map((detection, index) => (
                  <div
                    key={detection.id}
                    className="absolute border-2 opacity-75"
                    style={{
                      ...boxStyle(detection),
                      borderColor: severityColors[detection.severity],
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setSelectedDetection(detection)}
                    onMouseLeave={() => setSelectedDetection(null)}
                  >
                    <div className="absolute -top-6 left-0 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {detection.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detections list */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Detections ({detections.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {detections.map((detection) => (
                <div
                  key={detection.id}
                  onClick={() => setSelectedDetection(detection)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedDetection?.id === detection.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{detection.type}</p>
                      <p className="text-xs text-muted-foreground">{detection.location}</p>
                    </div>
                    <Badge
                      variant={
                        detection.severity === 'critical'
                          ? 'destructive'
                          : 'secondary'
                      }
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
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Confidence: {Math.round(detection.confidence * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics sidebar */}
      <div className="space-y-4">
        {/* Selected detection details */}
        {selectedDetection && (
          <Card className="border-border/50 border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Selected Detection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium">{selectedDetection.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{selectedDetection.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Severity</p>
                <Badge
                  className={`${
                    selectedDetection.severity === 'critical'
                      ? 'bg-red-900/30 text-red-300'
                      : selectedDetection.severity === 'high'
                      ? 'bg-orange-900/30 text-orange-300'
                      : selectedDetection.severity === 'medium'
                      ? 'bg-yellow-900/30 text-yellow-300'
                      : 'bg-green-900/30 text-green-300'
                  }`}
                >
                  {selectedDetection.severity}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Confidence</p>
                <div className="mt-1 bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${selectedDetection.confidence * 100}%` }}
                  />
                </div>
                <p className="text-sm font-medium mt-1">
                  {Math.round(selectedDetection.confidence * 100)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{selectedDetection.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Severity distribution */}
        {severityData.length > 0 && (
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {severityData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confidence chart */}
        {confidenceData.length > 0 && (
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Detection Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="confidence" fill="currentColor" className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
