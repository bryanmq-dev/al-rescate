import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = await useDb()
  const id = Number(getRouterParam(event, 'id'))
  const [row] = await db.update(tables.stories).set(storyInput(await readBody(event)))
    .where(eq(tables.stories.id, id)).returning()
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Historia no encontrada' })
  return row
})
