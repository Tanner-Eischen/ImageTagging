'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface ProcessingTask {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  startTime: string
  estimatedTime: string
  details?: string
}

interface StatusTrackerProps {
  tasks?: ProcessingTask[]
}

export function StatusTracker({ tasks = [] }: StatusTrackerProps) {
  const mockTasks: ProcessingTask[] = tasks.length > 0 ? tasks : [
    {
      id: '1',
      name: 'Roof Damage Photo Analysis',
      status: 'processing',
      progress: 65,
      startTime: '2:45 PM',
      estimatedTime: '3 min',
      details: 'Detecting roof damage patterns...',
    },
    {
      id: '2',
      name: 'Foundation Crack Detection',
      status: 'pending',
      progress: 0,
      startTime: '—',
      estimatedTime: '5 min',
    },
    {
      id: '3',
      name: 'Water Damage Assessment',
      status: 'completed',
      progress: 100,
      startTime: '2:30 PM',
      estimatedTime: '2:38 PM',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-400 animate-spin" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 text-green-300'
      case 'processing':
        return 'bg-blue-900/30 text-blue-300'
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-300'
      case 'failed':
        return 'bg-red-900/30 text-red-300'
      default:
        return 'bg-gray-900/30 text-gray-300'
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Processing Status</CardTitle>
        <CardDescription>
          Real-time tracking of analysis tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 border border-border/50 rounded-lg space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{task.name}</p>
                  {task.details && (
                    <p className="text-xs text-muted-foreground truncate">
                      {task.details}
                    </p>
                  )}
                </div>
              </div>
              <Badge className={`text-xs whitespace-nowrap ${getStatusBadge(task.status)}`}>
                {task.status}
              </Badge>
            </div>

            {task.progress > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span className="text-muted-foreground">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Started: {task.startTime}</span>
              <span>ETA: {task.estimatedTime}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
