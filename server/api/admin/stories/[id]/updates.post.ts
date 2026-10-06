export default defineEventHandler(async (event) => {
  const db = await useDb()
  const storyId = Number(getRouterParam(event, 'id'))
  const [row] = await db.insert(tables.storyUpdates)
    .values({ ...updateInput(await readBody(event)), storyId }).returning()
  return row
})
