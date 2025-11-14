import { promises as fs } from 'fs'
import path from 'path'
import { put, list } from '@vercel/blob'

export type PhotoStatus = 'analyzed' | 'analyzing' | 'pending'
export type Risk = 'critical' | 'high' | 'medium' | 'low'

export interface Detection {
  id: string
  type: string
  confidence: number
  location: string
  severity: Risk
  description: string
  box?: { left: number; top: number; width: number; height: number }
}

export interface Photo {
  id: string
  title: string
  date: string
  status: PhotoStatus
  image: string
}

export interface AnalysisReport {
  id: string
  photoId: string
  photoTitle: string
  analyzed: string
  status: 'completed' | 'in-progress'
  overallRisk: Risk
  detections: Detection[]
  image: string
  estimates?: Estimate[]
}

export interface Estimate {
  id: string
  material: string
  quantity: number
  units: string
  method: string
  confidence: number
}

const DATA_DIR = path.join(process.cwd(), 'data')
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json')
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json')
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const PHOTOS_BLOB_KEY = 'data/photos.json'
const REPORTS_BLOB_KEY = 'data/reports.json'

async function ensureDataFiles() {
  if (BLOB_TOKEN) return
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(PHOTOS_FILE)
  } catch {
    await fs.writeFile(PHOTOS_FILE, '[]', 'utf8')
  }
  try {
    await fs.access(REPORTS_FILE)
  } catch {
    await fs.writeFile(REPORTS_FILE, '[]', 'utf8')
  }
}

async function readJsonFromBlob<T>(key: string): Promise<T> {
  const items = await list({ prefix: key, token: BLOB_TOKEN! })
  const latest = items.blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]
  if (!latest) return JSON.parse('[]')
  const res = await fetch(latest.url)
  const txt = await res.text()
  return JSON.parse(txt)
}

async function writeJsonToBlob(key: string, data: unknown): Promise<void> {
  await put(key, JSON.stringify(data), { access: 'public', contentType: 'application/json', token: BLOB_TOKEN! })
}

export async function readPhotos(): Promise<Photo[]> {
  await ensureDataFiles()
  if (BLOB_TOKEN) {
    return await readJsonFromBlob<Photo[]>(PHOTOS_BLOB_KEY)
  }
  const raw = await fs.readFile(PHOTOS_FILE, 'utf8')
  return JSON.parse(raw)
}

export async function writePhotos(photos: Photo[]): Promise<void> {
  await ensureDataFiles()
  if (BLOB_TOKEN) {
    await writeJsonToBlob(PHOTOS_BLOB_KEY, photos)
    return
  }
  await fs.writeFile(PHOTOS_FILE, JSON.stringify(photos, null, 2), 'utf8')
}

export async function addPhoto(photo: Photo): Promise<void> {
  const photos = await readPhotos()
  photos.unshift(photo)
  await writePhotos(photos)
}

export async function updatePhotoStatus(photoId: string, status: PhotoStatus): Promise<void> {
  const photos = await readPhotos()
  const idx = photos.findIndex(p => p.id === photoId)
  if (idx !== -1) {
    photos[idx].status = status
    await writePhotos(photos)
  }
}

export async function readReports(): Promise<AnalysisReport[]> {
  await ensureDataFiles()
  if (BLOB_TOKEN) {
    return await readJsonFromBlob<AnalysisReport[]>(REPORTS_BLOB_KEY)
  }
  const raw = await fs.readFile(REPORTS_FILE, 'utf8')
  return JSON.parse(raw)
}

export async function writeReports(reports: AnalysisReport[]): Promise<void> {
  await ensureDataFiles()
  if (BLOB_TOKEN) {
    await writeJsonToBlob(REPORTS_BLOB_KEY, reports)
    return
  }
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf8')
}

export async function addReport(report: AnalysisReport): Promise<void> {
  const reports = await readReports()
  reports.unshift(report)
  await writeReports(reports)
}

export async function updateReportEstimates(reportId: string, estimates: Estimate[]): Promise<AnalysisReport | null> {
  const reports = await readReports()
  const idx = reports.findIndex(r => r.id === reportId)
  if (idx === -1) return null
  reports[idx].estimates = estimates
  await writeReports(reports)
  return reports[idx]
}
