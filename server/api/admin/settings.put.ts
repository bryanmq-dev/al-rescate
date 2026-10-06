const KEYS = ['impact', 'donation', 'needs', 'social'] as const

export default defineEventHandler(async (event) => {
  const db = await useDb()
  const body = await readBody<Record<string, unknown>>(event)
  for (const key of KEYS) {
    if (body?.[key] === undefined) continue
    await db.insert(tables.settings).values({ key, value: body[key] })
      .onConflictDoUpdate({ target: tables.settings.key, set: { value: body[key] } })
  }
  return getSettings()
})
