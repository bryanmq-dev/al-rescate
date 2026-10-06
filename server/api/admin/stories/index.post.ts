import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = await useDb()
  const data = storyInput(await readBody(event))
  let slug = slugify(data.name) || 'historia'
  const [taken] = await db.select({ id: tables.stories.id }).from(tables.stories).where(eq(tables.stories.slug, slug))
  if (taken) slug += '-' + Date.now().toString(36).slice(-4)
  const [row] = await db.insert(tables.stories)
    .values({ ...data, slug, createdAt: new Date().toISOString().slice(0, 10) })
    .returning()
  return row
})
