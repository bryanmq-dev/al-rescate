import { createReadStream, existsSync } from 'node:fs'
import { basename, extname } from 'node:path'

const TYPES: Record<string, string> = { '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' }

export default defineEventHandler((event) => {
  const name = basename(getRouterParam(event, 'path') ?? '')
  const file = `data/uploads/${name}`
  const type = TYPES[extname(name)]
  if (!type || !existsSync(file)) throw createError({ statusCode: 404 })
  setHeaders(event, { 'content-type': type, 'cache-control': 'public, max-age=31536000, immutable' })
  return sendStream(event, createReadStream(file))
})
