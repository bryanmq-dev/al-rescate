export default defineEventHandler(async (event) => {
  const parts = (await readMultipartFormData(event)) ?? []
  const files = parts.filter(p => p.filename && p.type)
  if (!files.length) throw createError({ statusCode: 400, statusMessage: 'No llegó ninguna imagen' })
  return { urls: await Promise.all(files.slice(0, 12).map(f => saveImage(f.data, f.type!))) }
})
