import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { addPhoto, readPhotos, Photo } from '@/lib/store'
import { put } from '@vercel/blob'

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

  const token = process.env.BLOB_READ_WRITE_TOKEN
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!token) {
    await fs.mkdir(uploadsDir, { recursive: true })
  }

  const created: Photo[] = []
  for (const file of files) {
    const id = randomUUID()
    const ext = (file.name.split('.').pop() || 'png').toLowerCase()
    const safeName = `${id}.${ext}`
    const buf = Buffer.from(await file.arrayBuffer())
    let imageUrl = `/uploads/${safeName}`
    if (token) {
      const res = await put(`uploads/${safeName}`, buf, { access: 'public', contentType: file.type || 'image/jpeg', token })
      imageUrl = res.url
    } else {
      const destPath = path.join(uploadsDir, safeName)
      await fs.writeFile(destPath, buf)
    }
    const photo: Photo = {
      id,
      title: file.name.replace(/\.[^/.]+$/, ''),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      image: imageUrl,
    }
    await addPhoto(photo)
    created.push(photo)
  }

  return NextResponse.json({ photos: created }, { status: 201 })
}
