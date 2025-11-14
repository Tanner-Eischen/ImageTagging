import { promises as fs } from 'fs'
import path from 'path'

export type PhotoStatus = 'analyzed' | 'analyzing' | 'pending'
export type Risk = 'critical' | 'high' | 'medium' | 'low'

export interface Detection {
  id: string
  type: string
  confidence: number
  location: string
  severity: Risk
  description: string
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
}

const DATA_DIR = path.join(process.cwd(), 'data')
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json')
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json')

async function ensureDataFiles() {
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

export async function readPhotos(): Promise<Photo[]> {
  await ensureDataFiles()
  const raw = await fs.readFile(PHOTOS_FILE, 'utf8')
  return JSON.parse(raw)
}

export async function writePhotos(photos: Photo[]): Promise<void> {
  await ensureDataFiles()
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
  const raw = await fs.readFile(REPORTS_FILE, 'utf8')
  return JSON.parse(raw)
}

export async function writeReports(reports: AnalysisReport[]): Promise<void> {
  await ensureDataFiles()
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf8')
}

export async function addReport(report: AnalysisReport): Promise<void> {
  const reports = await readReports()
  reports.unshift(report)
  await writeReports(reports)
}
