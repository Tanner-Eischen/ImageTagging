'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExportDialog } from '@/components/export-dialog'
import { WorkflowBuilder } from '@/components/workflow-builder'
import { Download, Clock, CheckCircle, FileText } from 'lucide-react'

interface Export {
  id: string
  name: string
  format: string
  photoCount: number
  date: string
  status: 'completed' | 'in-progress' | 'failed'
  size: string
}

interface Workflow {
  id: string
  name: string
  steps: number
  lastRun: string
  status: 'active' | 'inactive'
}

export default function ExportsPage() {
  const [exports, setExports] = useState<Export[]>([
    {
      id: '1',
      name: 'Analysis Report - Property A',
      format: 'PDF',
      photoCount: 3,
      date: '2024-11-14',
      status: 'completed',
      size: '15.2 MB',
    },
    {
      id: '2',
      name: 'Foundation Issues Export',
      format: 'Excel',
      photoCount: 2,
      date: '2024-11-13',
      status: 'completed',
      size: '2.4 MB',
    },
    {
      id: '3',
      name: 'November Review Report',
      format: 'PDF',
      photoCount: 8,
      date: '2024-11-12',
      status: 'in-progress',
      size: '-',
    },
  ])

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Standard Analysis Workflow',
      steps: 4,
      lastRun: '2024-11-14',
      status: 'active',
    },
    {
      id: '2',
      name: 'Quick Review Workflow',
      steps: 2,
      lastRun: '2024-11-10',
      status: 'active',
    },
  ])

  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false)

  const handleExport = (options: any) => {
    const newExport: Export = {
      id: Date.now().toString(),
      name: options.reportTitle,
      format: options.format.toUpperCase(),
      photoCount: 1,
      date: new Date().toLocaleDateString(),
      status: 'completed',
      size: `${Math.random() * 20 + 5}MB`,
    }
    setExports([newExport, ...exports])
  }

  const handleSaveWorkflow = (name: string, steps: any) => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name,
      steps: steps.length,
      lastRun: '-',
      status: 'active',
    }
    setWorkflows([newWorkflow, ...workflows])
    setShowWorkflowBuilder(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Exports & Workflows</h1>
        <p className="text-muted-foreground mt-1">
          Manage exports and automated workflows
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Export */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Quick Export</CardTitle>
              <CardDescription>
                Export selected photos in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportDialog photoCount={3} onExport={handleExport} />
            </CardContent>
          </Card>

          {/* Export History */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>
                Recent exports and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exports.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <p className="font-medium text-sm truncate">{exp.name}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{exp.format}</span>
                        <span>•</span>
                        <span>{exp.photoCount} photo(s)</span>
                        <span>•</span>
                        <span>{exp.date}</span>
                        {exp.size !== '-' && (
                          <>
                            <span>•</span>
                            <span>{exp.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`text-xs ${
                          exp.status === 'completed'
                            ? 'bg-green-900/30 text-green-300'
                            : exp.status === 'in-progress'
                            ? 'bg-blue-900/30 text-blue-300'
                            : 'bg-red-900/30 text-red-300'
                        }`}
                      >
                        {exp.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : exp.status === 'in-progress' ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : null}
                        {exp.status}
                      </Badge>
                      {exp.status === 'completed' && (
                        <Button size="sm" variant="ghost" className="gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflows Sidebar */}
        <div className="space-y-6">
          {/* Workflows */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Workflows</CardTitle>
              <CardDescription>Automated processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="p-3 border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium text-sm">{wf.name}</p>
                    <Badge
                      className={
                        wf.status === 'active'
                          ? 'bg-green-900/30 text-green-300 text-xs'
                          : 'bg-gray-900/30 text-gray-300 text-xs'
                      }
                    >
                      {wf.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {wf.steps} step(s)
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Last run: {wf.lastRun}
                  </p>
                  <Button size="sm" variant="outline" className="w-full text-xs border-border/50">
                    Run Now
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Workflow Builder */}
          {showWorkflowBuilder ? (
            <WorkflowBuilder onSave={handleSaveWorkflow} />
          ) : (
            <Button
              onClick={() => setShowWorkflowBuilder(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create Workflow
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
