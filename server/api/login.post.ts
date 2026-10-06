export default defineEventHandler(async (event) => {
  const { password } = await readBody<{ password?: string }>(event)
  if (!password || password !== useRuntimeConfig(event).adminPassword)
    throw createError({ statusCode: 401, statusMessage: 'Contraseña incorrecta' })
  await setUserSession(event, { user: { name: 'Equipo Al ResCate' } })
  return { ok: true }
})
