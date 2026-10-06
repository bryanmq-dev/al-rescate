export const STATUS = {
  rescatado: 'Recién rescatado',
  en_tratamiento: 'En tratamiento',
  en_recuperacion: 'Recuperándose',
  buscando_hogar: 'Busca hogar',
  adoptado: 'Adoptado',
  en_memoria: 'En nuestra memoria',
} as const

export const STAGES = {
  rescate: 'Rescate',
  tratamiento: 'Tratamiento',
  recuperacion: 'Recuperación',
  adopcion: 'Adopción',
  actualizacion: 'Novedades',
  memoria: 'Despedida',
} as const

export const SPECIES = { perro: 'Perro', gato: 'Gato', otro: 'Otro' } as const

export type Status = keyof typeof STATUS
export type Stage = keyof typeof STAGES
export type Species = keyof typeof SPECIES

export interface Story {
  id: number
  slug: string
  name: string
  species: Species
  status: Status
  cover: string
  summary: string
  featured: boolean
  createdAt: string
  updateCount?: number
  lastDate?: string | null
}

export interface StoryUpdate {
  id: number
  storyId: number
  date: string
  stage: Stage
  title: string
  body: string
  images: string[]
  sourceUrl: string | null
}

export interface Settings {
  impact: { rescued: number, sterilized: number, adopted: number, since: string }
  donation: {
    qrImage: string
    bankName: string
    accountHolder: string
    accountNumber: string
    accountType: string
    paypalUrl: string
  }
  needs: { item: string, note: string }[]
  social: { instagram: string, facebook: string, whatsapp: string }
}

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const fmtDate = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })
