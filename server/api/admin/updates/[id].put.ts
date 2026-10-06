import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  const [row] = await db.update(tables.storyUpdates).set(updateInput(await readBody(event)))
    .where(eq(tables.storyUpdates.id, id)).returning()
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Publicación no encontrada' })
  return row
})
