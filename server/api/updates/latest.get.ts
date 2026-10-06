import { desc, eq } from 'drizzle-orm'

// Latest chapters across all stories, for the home feed.
export default defineEventHandler(async () => {
  const db = await useDb()
  const { stories, storyUpdates } = tables
  return db.select({
    id: storyUpdates.id, date: storyUpdates.date, stage: storyUpdates.stage, title: storyUpdates.title,
    body: storyUpdates.body, images: storyUpdates.images, sourceUrl: storyUpdates.sourceUrl,
    slug: stories.slug, name: stories.name, cover: stories.cover,
  })
    .from(storyUpdates)
    .innerJoin(stories, eq(stories.id, storyUpdates.storyId))
    .orderBy(desc(storyUpdates.date), desc(storyUpdates.id))
    .limit(6)
})
