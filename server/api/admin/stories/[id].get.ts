import { asc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  const [story] = await db.select().from(tables.stories).where(eq(tables.stories.id, id))
  if (!story) throw createError({ statusCode: 404, statusMessage: 'Historia no encontrada' })
  const updates = await db.select().from(tables.storyUpdates)
    .where(eq(tables.storyUpdates.storyId, id))
    .orderBy(asc(tables.storyUpdates.date), asc(tables.storyUpdates.id))
  return { story, updates }
})
