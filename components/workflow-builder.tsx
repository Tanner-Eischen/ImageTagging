'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'

interface WorkflowStep {
  id: string
  name: string
  enabled: boolean
  params?: Record<string, string>
}

interface WorkflowBuilderProps {
  onSave?: (name: string, steps: WorkflowStep[]) => void
}

const availableSteps = [
  { id: 'upload', name: 'Upload Photos', description: 'Import photos' },
  { id: 'analyze', name: 'Run Analysis', description: 'AI detection' },
  { id: 'tag', name: 'Auto-Tag', description: 'Apply tags' },
  { id: 'review', name: 'Manual Review', description: 'QA review' },
  { id: 'export', name: 'Export Report', description: 'Generate report' },
]

export function WorkflowBuilder({ onSave }: WorkflowBuilderProps) {
  const [workflowName, setWorkflowName] = useState('New Workflow')
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: '1', name: 'Upload Photos', enabled: true },
    { id: '2', name: 'Run Analysis', enabled: true },
  ])

  const addStep = (stepName: string, stepId: string) => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: stepName,
      enabled: true,
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id))
  }

  const toggleStep = (id: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Workflow Configuration</CardTitle>
          <CardDescription>Build custom processing workflows</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Workflow Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Workflow Name</label>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="bg-input border-border/50"
            />
          </div>

          {/* Steps */}
          <div>
            <label className="text-sm font-medium mb-3 block">Workflow Steps</label>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="border-border/50">
                      {index + 1}
                    </Badge>
                    <Checkbox
                      checked={step.enabled}
                      onCheckedChange={() => toggleStep(step.id)}
                    />
                    <div>
                      <p className={`text-sm font-medium ${!step.enabled ? 'opacity-50' : ''}`}>
                        {step.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="p-2 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Step */}
          <div>
            <label className="text-sm font-medium mb-2 block">Add Step</label>
            <div className="grid grid-cols-2 gap-2">
              {availableSteps.map((step) => (
                <Button
                  key={step.id}
                  onClick={() => addStep(step.name, step.id)}
                  variant="outline"
                  className="text-xs h-auto py-2 flex flex-col gap-1 border-border/50"
                >
                  <span className="font-medium">{step.name}</span>
                  <span className="text-xs text-muted-foreground">{step.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Save */}
          <Button
            onClick={() => onSave?.(workflowName, steps)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Workflow
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
