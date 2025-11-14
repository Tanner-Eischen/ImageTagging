'use client'

import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface TagBadgeProps {
  label: string
  color?: string
  onRemove?: () => void
  size?: 'sm' | 'md'
}

const colorMap: Record<string, string> = {
  red: 'bg-red-900/30 text-red-300 hover:bg-red-900/40',
  orange: 'bg-orange-900/30 text-orange-300 hover:bg-orange-900/40',
  yellow: 'bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/40',
  green: 'bg-green-900/30 text-green-300 hover:bg-green-900/40',
  blue: 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/40',
  purple: 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/40',
}

export function TagBadge({
  label,
  color = 'blue',
  onRemove,
  size = 'md',
}: TagBadgeProps) {
  const baseClass = colorMap[color] || colorMap.blue
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'

  return (
    <Badge className={`${baseClass} ${sizeClass} gap-1 cursor-pointer transition-colors`}>
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:scale-110 transition-transform"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  )
}
