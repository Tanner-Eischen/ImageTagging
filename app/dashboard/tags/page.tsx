'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TagManager } from '@/components/tag-manager'
import { TagBadge } from '@/components/tag-badge'
import { Search } from 'lucide-react'

interface Tag {
  id: string
  name: string
  color: string
  count: number
}

interface PhotoTag {
  photoId: number
  photoTitle: string
  tags: Tag[]
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'Roof Damage', color: 'red', count: 5 },
    { id: '2', name: 'Water Intrusion', color: 'blue', count: 3 },
    { id: '3', name: 'Foundation Issues', color: 'orange', count: 2 },
    { id: '4', name: 'Approved', color: 'green', count: 8 },
    { id: '5', name: 'Pending Review', color: 'yellow', count: 4 },
  ])

  const [photoTags, setPhotoTags] = useState<PhotoTag[]>([
    {
      photoId: 1,
      photoTitle: 'Roof Damage - Property A',
      tags: [tags[0], tags[3]],
    },
    {
      photoId: 2,
      photoTitle: 'Foundation Crack - Property B',
      tags: [tags[2]],
    },
    {
      photoId: 3,
      photoTitle: 'Water Damage - Property C',
      tags: [tags[1], tags[4]],
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const handleAddTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      color,
      count: 0,
    }
    setTags([...tags, newTag])
  }

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id))
  }

  const handleRenameTag = (id: string, newName: string) => {
    setTags(tags.map(t => t.id === id ? { ...t, name: newName } : t))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tag Management</h1>
        <p className="text-muted-foreground mt-1">
          Organize and categorize your photos with custom tags
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tagged Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{photoTags.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {photoTags.reduce((sum, pt) => sum + pt.tags.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tag Manager */}
        <div className="lg:col-span-1">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Create and manage category tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagManager
                tags={tags}
                onAddTag={handleAddTag}
                onDeleteTag={handleDeleteTag}
                onRenameTag={handleRenameTag}
              />
            </CardContent>
          </Card>
        </div>

        {/* Tagged Photos */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Tagged Photos</CardTitle>
              <CardDescription>
                Photos organized by tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border/50"
                />
              </div>

              <div className="space-y-3">
                {photoTags.map((pt) => (
                  <div
                    key={pt.photoId}
                    className="p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-2">{pt.photoTitle}</h4>
                    <div className="flex flex-wrap gap-2">
                      {pt.tags.length > 0 ? (
                        pt.tags.map((tag) => (
                          <TagBadge
                            key={tag.id}
                            label={tag.name}
                            color={tag.color}
                            size="sm"
                          />
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">No tags assigned</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
