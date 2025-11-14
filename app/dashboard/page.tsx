'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, ImageIcon } from 'lucide-react'
import { PhotoUploadDialog } from '@/components/photo-upload-dialog'
import { PhotoFilters } from '@/components/photo-filters'

interface Photo {
  id: number
  title: string
  date: string
  status: 'analyzed' | 'analyzing' | 'pending'
  image: string
}

export default function GalleryPage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: 1,
      title: 'Roof Damage - Property A',
      date: '2024-11-14',
      status: 'analyzed',
      image: '/roof-damage-construction.jpg'
    },
    {
      id: 2,
      title: 'Foundation Crack - Property B',
      date: '2024-11-13',
      status: 'pending',
      image: '/foundation-crack.png'
    },
    {
      id: 3,
      title: 'Water Damage - Property C',
      date: '2024-11-12',
      status: 'analyzing',
      image: '/water-damage-construction.jpg'
    },
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const handleUpload = (files: File[]) => {
    const newPhotos: Photo[] = files.map((file, index) => ({
      id: Math.max(...photos.map(p => p.id), 0) + index + 1,
      title: file.name.replace(/\.[^/.]+$/, ''),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      image: URL.createObjectURL(file),
    }))
    setPhotos([...newPhotos, ...photos])
  }

  const filteredPhotos = photos
    .filter((photo) => {
      if (searchTerm && !photo.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (statusFilter !== 'all' && photo.status !== statusFilter) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'name-asc':
          return a.title.localeCompare(b.title)
        case 'name-desc':
          return b.title.localeCompare(a.title)
        case 'newest':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Photo Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Manage and analyze your construction photos
          </p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Photos
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{photos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">In gallery</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {photos.filter(p => p.status === 'analyzed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready to export</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {photos.filter(p => p.status === 'analyzing' || p.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <PhotoFilters
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onSortChange={setSortBy}
      />

      {/* Gallery Grid */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>
            {filteredPhotos.length} photo(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group border border-border/50 rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <div className="relative aspect-video bg-secondary overflow-hidden">
                    <img
                      src={photo.image || "/placeholder.svg"}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          photo.status === 'analyzed'
                            ? 'bg-green-900/30 text-green-300'
                            : photo.status === 'analyzing'
                            ? 'bg-blue-900/30 text-blue-300'
                            : 'bg-yellow-900/30 text-yellow-300'
                        }`}
                      >
                        {photo.status.charAt(0).toUpperCase() + photo.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-card">
                    <h3 className="font-medium text-sm line-clamp-2">{photo.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2">{photo.date}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-border/50"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No photos found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <PhotoUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
      />
    </div>
  )
}
