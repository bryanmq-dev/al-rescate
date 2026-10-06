<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'

definePageMeta({ layout: 'admin', middleware: 'admin' })
const route = useRoute()
const isNew = computed(() => route.params.id === 'nueva')

const { data, refresh } = await useFetch<{ story: Story, updates: StoryUpdate[] }>(
  () => `/api/admin/stories/${route.params.id}`, { immediate: !isNew.value, key: `admin-story-${route.params.id}` },
)
useSeoMeta({ title: () => `${data.value?.story.name ?? 'Nueva historia'} | Panel Al ResCate` })

const form = reactive({ name: '', species: 'perro' as Species, status: 'rescatado' as Status, summary: '', cover: [] as string[], featured: false })
watchEffect(() => {
  const s = data.value?.story
  if (s) Object.assign(form, { name: s.name, species: s.species, status: s.status, summary: s.summary, cover: s.cover ? [s.cover] : [], featured: s.featured })
})

const story = useAdminApi()
const saved = ref(false)
async function saveStory() {
  const body = { ...form, cover: form.cover[0] ?? '' }
  const res = await story.call<Story>(isNew.value ? '/api/admin/stories' : `/api/admin/stories/${route.params.id}`, { method: isNew.value ? 'POST' : 'PUT', body })
  if (!res) return
  if (isNew.value) return navigateTo(`/admin/historias/${res.id}?primera=1`)
  saved.value = true
  setTimeout(() => (saved.value = false), 1800)
  await refresh()
}

// Chapters
const chapters = useAdminApi()
const editing = ref<number | 'new' | null>(route.query.primera ? 'new' : null)
async function saveChapter(body: Omit<StoryUpdate, 'id' | 'storyId'>) {
  const id = editing.value
  const ok = id === 'new'
    ? await chapters.call(`/api/admin/stories/${route.params.id}/updates`, { method: 'POST', body })
    : await chapters.call(`/api/admin/updates/${id}`, { method: 'PUT', body })
  if (!ok) return
  editing.value = null
  // First chapter with a photo becomes the cover if there is none yet.
  if (!form.cover.length && body.images[0]) { form.cover = [body.images[0]]; await saveStory() }
  await refresh()
}
async function removeChapter(u: StoryUpdate) {
  if (!confirm('¿Borrar este capítulo?')) return
  await chapters.call(`/api/admin/updates/${u.id}`, { method: 'DELETE' })
  await refresh()
}
const updatesDesc = computed(() => [...(data.value?.updates ?? [])].reverse())
</script>

<template>
  <div>
    <NuxtLink to="/admin" class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink">
      <Icon name="ph:arrow-left-bold" class="size-4" />Historias
    </NuxtLink>

    <div class="mt-4 grid items-start gap-8 lg:grid-cols-[360px_1fr]">
      <!-- Story card -->
      <form class="grid gap-5 rounded-[14px] bg-white p-5 shadow-[0_1px_2px_oklch(0.2_0.03_166/0.08)] md:p-6 lg:sticky lg:top-24" @submit.prevent="saveStory">
        <h1 class="text-3xl font-semibold">{{ isNew ? 'Nueva historia' : form.name || 'Historia' }}</h1>
        <div class="field">
          <span>Foto de portada</span>
          <AdminImagePicker v-model="form.cover" :multiple="false" />
        </div>
        <label class="field">
          <span>Nombre</span>
          <input v-model="form.name" type="text" class="input" maxlength="80" required placeholder="Ej. Canela">
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="field">
            <span>Especie</span>
            <select v-model="form.species" class="input">
              <option v-for="(label, key) in SPECIES" :key="key" :value="key">{{ label }}</option>
            </select>
          </label>
          <label class="field">
            <span>Estado</span>
            <select v-model="form.status" class="input">
              <option v-for="(label, key) in STATUS" :key="key" :value="key">{{ label }}</option>
            </select>
          </label>
        </div>
        <label class="field">
          <span>Resumen corto</span>
          <textarea v-model="form.summary" rows="3" class="input resize-y" maxlength="400" placeholder="Una o dos frases que aparecen en la tarjeta." />
        </label>
        <label class="flex items-center gap-3 text-sm font-semibold">
          <input v-model="form.featured" type="checkbox" class="size-5 accent-[var(--color-turq-deep)]">
          Destacar en la página de inicio
        </label>
        <p v-if="story.error.value" class="text-sm font-medium text-[oklch(0.5_0.18_25)]" role="alert">{{ story.error.value }}</p>
        <button type="submit" class="btn btn-sun text-base!" :disabled="story.busy.value">
          <Icon v-if="saved" name="ph:check-bold" class="size-5" />
          {{ story.busy.value ? 'Guardando…' : saved ? 'Guardado' : isNew ? 'Crear historia' : 'Guardar cambios' }}
        </button>
      </form>

      <!-- Timeline editor -->
      <section v-if="!isNew">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-3xl font-semibold">Línea de tiempo</h2>
            <p class="text-ink-soft">Cada capítulo aparece en orden de fecha en la página pública.</p>
          </div>
          <button v-if="editing !== 'new'" type="button" class="btn bg-ink text-base! text-paper" @click="editing = 'new'">
            <Icon name="ph:plus-bold" class="size-5" />Agregar capítulo
          </button>
        </div>

        <AnimatePresence>
          <motion.div
            v-if="editing === 'new'" key="new" class="mt-6"
            :initial="{ opacity: 0, y: -8 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -8 }" :transition="{ duration: 0.2 }"
          >
            <AdminUpdateForm :saving="chapters.busy.value" @save="saveChapter" @cancel="editing = null" />
          </motion.div>
        </AnimatePresence>
        <p v-if="chapters.error.value" class="mt-4 text-sm font-medium text-[oklch(0.5_0.18_25)]" role="alert">{{ chapters.error.value }}</p>

        <ol class="relative mt-8 grid gap-5 border-l-2 border-ink/10 pl-6">
          <li v-for="u in updatesDesc" :key="u.id" class="relative" :class="`stage-${u.stage}`">
            <span class="absolute top-5 -left-[33px] size-4 rounded-full border-4 border-paper-2 bg-[var(--stage)]" />
            <AdminUpdateForm v-if="editing === u.id" :initial="u" :saving="chapters.busy.value" @save="saveChapter" @cancel="editing = null" />
            <div v-else class="flex gap-4 rounded-[14px] bg-white p-4 shadow-[0_1px_2px_oklch(0.2_0.03_166/0.08)]">
              <img v-if="u.images[0]" :src="u.images[0]" alt="" class="size-20 shrink-0 rounded-[10px] object-cover">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2 text-sm">
                  <span class="chip bg-[var(--stage)] text-xs text-ink">{{ STAGES[u.stage] }}</span>
                  <span class="text-ink-soft">{{ fmtDate(u.date) }}</span>
                  <span v-if="u.images.length > 1" class="text-ink-soft">{{ u.images.length }} fotos</span>
                  <Icon v-if="u.sourceUrl" name="ph:link-bold" class="size-4 text-ink-soft" title="Enlazado a un post" />
                </div>
                <p class="mt-1 font-display text-lg font-semibold">{{ u.title || 'Sin título' }}</p>
                <p class="line-clamp-2 text-sm text-ink-soft">{{ u.body }}</p>
              </div>
              <div class="flex shrink-0 flex-col gap-1">
                <button type="button" class="rounded-full p-2 text-ink-soft hover:bg-paper-2 hover:text-ink" aria-label="Editar capítulo" @click="editing = u.id">
                  <Icon name="ph:pencil-simple-bold" class="size-5" />
                </button>
                <button type="button" class="rounded-full p-2 text-ink-soft hover:bg-[oklch(0.95_0.03_25)] hover:text-[oklch(0.5_0.18_25)]" aria-label="Borrar capítulo" @click="removeChapter(u)">
                  <Icon name="ph:trash-bold" class="size-5" />
                </button>
              </div>
            </div>
          </li>
        </ol>
        <div v-if="!updatesDesc.length && editing !== 'new'" class="rounded-[14px] border-2 border-dashed border-ink/15 p-10 text-center">
          <p class="font-hand text-2xl">Esta historia todavía no tiene capítulos.</p>
          <button type="button" class="btn btn-sun mt-4 text-base!" @click="editing = 'new'">Agregar el rescate</button>
        </div>
      </section>
    </div>
  </div>
</template>
