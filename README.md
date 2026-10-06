# Al ResCate

Landing de impacto + mini CMS de historias para Al ResCate (Bolivia). Nuxt 4 fullstack, SQLite (libsql + Drizzle).

```bash
pnpm install
pnpm dev            # http://localhost:3000, admin en /admin (contraseña por defecto: alrescate)
```

- **Historia** = un animal (nombre, especie, estado, portada). Dentro tiene **capítulos** (rescate, tratamiento, recuperación, adopción…) que forman su línea de tiempo pública.
- En cada capítulo se puede **importar un post público** de Instagram/Facebook pegando su enlace (trae foto, texto y fecha).
- `/admin/ajustes`: QR, cuenta bancaria, PayPal, números de impacto, insumos y redes.
- La base se crea y se llena con ejemplos al primer arranque en `data/alrescate.db`; las fotos subidas van a `data/uploads/`. Borra `data/` para empezar de cero.

Producción: define `NUXT_ADMIN_PASSWORD` y `NUXT_SESSION_PASSWORD` (32+ caracteres), luego `pnpm build && node .output/server/index.mjs`.
