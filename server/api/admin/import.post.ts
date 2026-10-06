// Imports a public Instagram/Facebook post by URL.
// Meta serves Open Graph tags (image + caption) to link-preview crawlers without login,
// the same data WhatsApp uses to preview a shared post.
// ponytail: one post at a time; switch to the Instagram Graph API for automatic sync once there is a Business token
const CRAWLER_UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'

const decode = (s: string) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

const meta = (html: string, prop: string) =>
  html.match(new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`, 'i'))?.[1]
  ?? html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="${prop}"`, 'i'))?.[1]

// Instagram og:description looks like: `123 likes, 4 comments - user on March 2, 2026: "caption"`
function parseCaption(desc: string) {
  const m = desc.match(/ on ([A-Z][a-z]+ \d{1,2}, \d{4}): ["“]([\s\S]*)["”]\.?$/)
  if (!m) return { caption: desc, date: null }
  const d = new Date(m[1] + ' 12:00 UTC')
  return { caption: m[2]!, date: Number.isNaN(+d) ? null : d.toISOString().slice(0, 10) }
}

export default defineEventHandler(async (event) => {
  const { url } = await readBody<{ url?: string }>(event)
  let u: URL
  try { u = new URL(String(url)) }
  catch { throw createError({ statusCode: 400, statusMessage: 'Pega el enlace completo del post' }) }
  if (!/(^|\.)(instagram\.com|facebook\.com|fb\.watch)$/.test(u.hostname))
    throw createError({ statusCode: 400, statusMessage: 'Solo enlaces de Instagram o Facebook' })

  const html = await $fetch<string>(u.href, { headers: { 'user-agent': CRAWLER_UA }, responseType: 'text' })
    .catch(() => { throw createError({ statusCode: 502, statusMessage: 'No pudimos abrir el post. ¿Es público?' }) })
  const image = meta(html, 'og:image')
  if (!image) throw createError({ statusCode: 422, statusMessage: 'El post no expone imagen pública' })

  const img = await $fetch.raw<ArrayBuffer>(decode(image), { responseType: 'arrayBuffer' })
  const local = await saveImage(new Uint8Array(img._data!), img.headers.get('content-type')?.split(';')[0] ?? '')
  const { caption, date } = parseCaption(decode(meta(html, 'og:description') ?? ''))
  return { image: local, caption, date, sourceUrl: u.origin + u.pathname }
})
