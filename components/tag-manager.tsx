'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TagBadge } from '@/components/tag-badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, Edit2 } from 'lucide-react'

interface Tag {
  id: string
  name: string
  color: string
  count: number
}

interface TagManagerProps {
  tags: Tag[]
  onAddTag?: (name: string, color: string) => void
  onDeleteTag?: (id: string) => void
  onRenameTag?: (id: string, newName: string) => void
}

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

export function TagManager({
  tags,
  onAddTag,
  onDeleteTag,
  onRenameTag,
}: TagManagerProps) {
  const [open, setOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState('blue')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAddTag?.(newTagName, selectedColor)
      setNewTagName('')
      setSelectedColor('blue')
      setOpen(false)
    }
  }

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      onRenameTag?.(id, editingName)
      setEditingId(null)
      setEditingName('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Tag Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Create New Tag
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>
              Add a new category tag for organizing your photos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tag Name</label>
              <Input
                placeholder="e.g., Roof Damage, Water Intrusion"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="mt-2 bg-input border-border/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Color</label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      selectedColor === color
                        ? 'border-foreground scale-110'
                        : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor: color === 'red' ? '#7f1d1d'
                        : color === 'orange' ? '#7c2d12'
                        : color === 'yellow' ? '#713f12'
                        : color === 'green' ? '#14532d'
                        : color === 'blue' ? '#0c2340'
                        : '#4c1d95'
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTag}
                disabled={!newTagName.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Create Tag
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tags.map((tag) => (
          <Card key={tag.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {editingId === tag.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="text-sm bg-input border-border/50"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(tag.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null)
                          setEditingName('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <TagBadge label={tag.name} color={tag.color} size="md" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {tag.count} photo(s)
                      </p>
                    </div>
                  )}
                </div>
                {editingId !== tag.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(tag.id)
                        setEditingName(tag.name)
                      }}
                      className="p-2 hover:bg-secondary rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onDeleteTag?.(tag.id)}
                      className="p-2 hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No tags created yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create tags to organize and categorize your photos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
