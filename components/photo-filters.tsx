'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

interface PhotoFiltersProps {
  onSearchChange?: (search: string) => void
  onStatusChange?: (status: string) => void
  onSortChange?: (sort: string) => void
}

export function PhotoFilters({
  onSearchChange,
  onStatusChange,
  onSortChange,
}: PhotoFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search photos..."
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-10 bg-input border-border/50"
        />
      </div>

      <Select onValueChange={onStatusChange} defaultValue="all">
        <SelectTrigger className="w-full sm:w-40 bg-input border-border/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="analyzed">Analyzed</SelectItem>
          <SelectItem value="analyzing">Analyzing</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onSortChange} defaultValue="newest">
        <SelectTrigger className="w-full sm:w-40 bg-input border-border/50">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
