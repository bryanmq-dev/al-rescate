import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = await useDb()
  await db.delete(tables.storyUpdates).where(eq(tables.storyUpdates.id, Number(getRouterParam(event, 'id'))))
  return { ok: true }
})
