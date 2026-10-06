import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const stories = sqliteTable('stories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  species: text('species').notNull().default('perro'),
  status: text('status').notNull().default('rescatado'),
  cover: text('cover').notNull().default(''),
  summary: text('summary').notNull().default(''),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
})

export const storyUpdates = sqliteTable('story_updates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  storyId: integer('story_id').notNull().references(() => stories.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  stage: text('stage').notNull().default('actualizacion'),
  title: text('title').notNull().default(''),
  body: text('body').notNull().default(''),
  images: text('images', { mode: 'json' }).$type<string[]>().notNull().default([]),
  sourceUrl: text('source_url'),
})

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value', { mode: 'json' }).notNull(),
})

// ponytail: tables created with plain SQL on boot instead of drizzle-kit migrations; add drizzle-kit when the schema starts changing in production
export const DDL = [
  `CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    species TEXT NOT NULL DEFAULT 'perro',
    status TEXT NOT NULL DEFAULT 'rescatado',
    cover TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    featured INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS story_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'actualizacion',
    title TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    source_url TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS story_updates_story ON story_updates(story_id, date)`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
]
