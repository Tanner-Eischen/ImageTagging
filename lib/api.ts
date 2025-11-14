export async function listPhotos() {
  const res = await fetch('/api/photos', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to list photos')
  return res.json()
}

export async function uploadPhotos(files: File[]) {
  const form = new FormData()
  for (const f of files) form.append('files', f)
  const res = await fetch('/api/photos', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Failed to upload photos')
  return res.json()
}

export async function analyzePhoto(photoId: string) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoId }),
  })
  if (!res.ok) throw new Error('Failed to analyze photo')
  return res.json()
}

export async function listReports() {
  const res = await fetch('/api/reports', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to list reports')
  return res.json()
}
