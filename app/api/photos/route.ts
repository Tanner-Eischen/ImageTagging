import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { addPhoto, readPhotos, Photo } from '@/lib/store'

export const runtime = 'nodejs'

export async function GET() {
  const photos = await readPhotos()
  return NextResponse.json({ photos })
}

export async function POST(req: Request) {
  const form = await req.formData()
  const files: File[] = []
  for (const entry of form.entries()) {
    const [, value] = entry
    if (value instanceof File && value.type.startsWith('image/')) {
      files.push(value)
    }
  }
  if (files.length === 0) {
    return NextResponse.json({ error: 'No image files provided' }, { status: 400 })
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })

  const created: Photo[] = []
  for (const file of files) {
    const id = randomUUID()
    const ext = (file.name.split('.').pop() || 'png').toLowerCase()
    const safeName = `${id}.${ext}`
    const destPath = path.join(uploadsDir, safeName)
    const buf = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(destPath, buf)
    const photo: Photo = {
      id,
      title: file.name.replace(/\.[^/.]+$/, ''),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      image: `/uploads/${safeName}`,
    }
    await addPhoto(photo)
    created.push(photo)
  }

  return NextResponse.json({ photos: created }, { status: 201 })
}
