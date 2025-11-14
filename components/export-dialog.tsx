'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, FileText, Image } from 'lucide-react'

interface ExportDialogProps {
  photoCount?: number
  onExport?: (options: ExportOptions) => void
}

interface ExportOptions {
  format: 'pdf' | 'excel' | 'json'
  includeImages: boolean
  includeAnalysis: boolean
  includeRawData: boolean
  reportTitle: string
}

export function ExportDialog({ photoCount = 1, onExport }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeImages: true,
    includeAnalysis: true,
    includeRawData: false,
    reportTitle: `Analysis Report ${new Date().toLocaleDateString()}`,
  })
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500))
    onExport?.(options)
    setExporting(false)
    setOpen(false)
  }

  const formatInfo = {
    pdf: {
      label: 'PDF Report',
      description: 'Professional PDF with images and analysis',
      icon: FileText,
    },
    excel: {
      label: 'Excel Spreadsheet',
      description: 'Data in spreadsheet format for analysis',
      icon: FileText,
    },
    json: {
      label: 'JSON Data',
      description: 'Raw data in JSON format for integration',
      icon: FileText,
    },
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border/50 gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Configure export settings for {photoCount} photo(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Export Format</label>
            <div className="space-y-2">
              {['pdf', 'excel', 'json'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOptions({ ...options, format: fmt as any })}
                  className={`w-full p-3 border rounded-lg text-left transition-colors ${
                    options.format === fmt
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-sm">{formatInfo[fmt as keyof typeof formatInfo].label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatInfo[fmt as keyof typeof formatInfo].description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Report Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">Report Title</label>
            <Input
              value={options.reportTitle}
              onChange={(e) => setOptions({ ...options, reportTitle: e.target.value })}
              className="bg-input border-border/50"
            />
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Include in Export</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-images"
                  checked={options.includeImages}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeImages: checked as boolean })
                  }
                />
                <label htmlFor="include-images" className="text-sm cursor-pointer">
                  Original photos
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-analysis"
                  checked={options.includeAnalysis}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeAnalysis: checked as boolean })
                  }
                />
                <label htmlFor="include-analysis" className="text-sm cursor-pointer">
                  Analysis results & detections
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-raw"
                  checked={options.includeRawData}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeRawData: checked as boolean })
                  }
                />
                <label htmlFor="include-raw" className="text-sm cursor-pointer">
                  Raw detection data
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={exporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={exporting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
