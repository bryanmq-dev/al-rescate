import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(tables.storyUpdates).where(eq(tables.storyUpdates.storyId, id))
  await db.delete(tables.stories).where(eq(tables.stories.id, id))
  return { ok: true }
})
