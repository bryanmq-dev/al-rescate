import { mkdirSync } from 'node:fs'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../db/schema'
import { seedStories, defaultSettings } from '../db/seed'
import type { Settings } from '#shared/utils/labels'

export const tables = schema

mkdirSync('data/uploads', { recursive: true })
const client = createClient({ url: process.env.DATABASE_URL || 'file:data/alrescate.db' })
export const db = drizzle(client, { schema })

let ready: Promise<void> | undefined

// Creates tables and seeds sample content on first use.
export function useDb() {
  ready ??= (async () => {
    await client.execute('PRAGMA foreign_keys = ON')
    for (const sql of schema.DDL) await client.execute(sql)
    const { rows } = await client.execute('SELECT count(*) AS n FROM stories')
    if (Number(rows[0]!.n) > 0) return
    for (const s of seedStories) {
      const [row] = await db.insert(schema.stories).values({
        slug: slugify(s.name), name: s.name, species: s.species, status: s.status,
        cover: s.cover, summary: s.summary, featured: !!s.featured,
        createdAt: s.updates[0]![0],
      }).returning()
      await db.insert(schema.storyUpdates).values(s.updates.map(([date, stage, title, body, images]) => ({
        storyId: row!.id, date, stage, title, body, images: images ?? [],
      })))
    }
    await db.insert(schema.settings).values(
      Object.entries(defaultSettings).map(([key, value]) => ({ key, value })),
    ).onConflictDoNothing()
  })()
  return ready.then(() => db)
}

export async function getSettings(): Promise<Settings> {
  const d = await useDb()
  const rows = await d.select().from(schema.settings)
  const out = structuredClone(defaultSettings) as any
  for (const r of rows) out[r.key] = { ...out[r.key], ...(r.value as object) }
  out.needs = rows.find(r => r.key === 'needs')?.value ?? out.needs
  return out
}
