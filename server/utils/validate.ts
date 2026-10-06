import { STATUS, STAGES, SPECIES } from '#shared/utils/labels'

const pick = <T extends object>(keys: T, v: unknown, fallback: keyof T) =>
  (typeof v === 'string' && v in keys ? v : fallback) as string
const str = (v: unknown, max = 5000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const isDate = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)
const isLocalOrHttp = (v: string) => v === '' || v.startsWith('/') || /^https?:\/\//.test(v)

export function storyInput(b: any) {
  const name = str(b?.name, 80)
  if (!name) throw createError({ statusCode: 400, statusMessage: 'El nombre es obligatorio' })
  const cover = str(b?.cover, 500)
  if (!isLocalOrHttp(cover)) throw createError({ statusCode: 400, statusMessage: 'Foto inválida' })
  return {
    name,
    species: pick(SPECIES, b?.species, 'perro'),
    status: pick(STATUS, b?.status, 'rescatado'),
    cover,
    summary: str(b?.summary, 400),
    featured: !!b?.featured,
  }
}

export function updateInput(b: any) {
  if (!isDate(b?.date)) throw createError({ statusCode: 400, statusMessage: 'Fecha inválida' })
  const images = Array.isArray(b?.images) ? b.images.map((i: unknown) => str(i, 500)).filter((i: string) => i && isLocalOrHttp(i)).slice(0, 12) : []
  const sourceUrl = str(b?.sourceUrl, 500)
  return {
    date: b.date as string,
    stage: pick(STAGES, b?.stage, 'actualizacion'),
    title: str(b?.title, 140),
    body: str(b?.body, 5000),
    images,
    sourceUrl: /^https?:\/\//.test(sourceUrl) ? sourceUrl : null,
  }
}
