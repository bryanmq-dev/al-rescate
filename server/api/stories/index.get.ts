import { desc, eq, sql } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = await useDb()
  const { stories, storyUpdates } = tables
  return db.select({
    id: stories.id, slug: stories.slug, name: stories.name, species: stories.species,
    status: stories.status, cover: stories.cover, summary: stories.summary,
    featured: stories.featured, createdAt: stories.createdAt,
    updateCount: sql<number>`count(${storyUpdates.id})`,
    lastDate: sql<string | null>`max(${storyUpdates.date})`,
  })
    .from(stories)
    .leftJoin(storyUpdates, eq(storyUpdates.storyId, stories.id))
    .groupBy(stories.id)
    .orderBy(desc(sql`coalesce(max(${storyUpdates.date}), ${stories.createdAt})`))
})
