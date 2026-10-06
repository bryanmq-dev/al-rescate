import { randomBytes } from 'node:crypto'
import { writeFile } from 'node:fs/promises'

const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
export const MAX_UPLOAD = 8 * 1024 * 1024

// ponytail: local disk under data/uploads, move to R2/S3 when deploying serverless
export async function saveImage(data: Uint8Array, type: string) {
  const ext = EXT[type]
  if (!ext) throw createError({ statusCode: 415, statusMessage: 'Solo se aceptan imágenes JPG, PNG, WEBP o GIF' })
  if (data.byteLength > MAX_UPLOAD) throw createError({ statusCode: 413, statusMessage: 'La imagen pesa más de 8 MB' })
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString('hex')}.${ext}`
  await writeFile(`data/uploads/${name}`, data)
  return `/uploads/${name}`
}
