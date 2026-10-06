<script setup lang="ts">
// Editor for one chapter of a story. Can prefill itself from a public Instagram/Facebook post.
const props = defineProps<{ initial?: Partial<StoryUpdate>, saving?: boolean }>()
const emit = defineEmits<{ save: [Omit<StoryUpdate, 'id' | 'storyId'>], cancel: [] }>()

const today = new Date().toISOString().slice(0, 10)
const form = reactive({
  date: props.initial?.date ?? today,
  stage: (props.initial?.stage ?? 'actualizacion') as Stage,
  title: props.initial?.title ?? '',
  body: props.initial?.body ?? '',
  images: [...(props.initial?.images ?? [])],
  sourceUrl: props.initial?.sourceUrl ?? '',
})

const postUrl = ref('')
const imp = useAdminApi()
async function importPost() {
  const r = await imp.call<{ image: string, caption: string, date: string | null, sourceUrl: string }>('/api/admin/import', { method: 'POST', body: { url: postUrl.value } })
  if (!r) return
  form.images = [r.image, ...form.images]
  if (!form.body) form.body = r.caption
  if (r.date) form.date = r.date
  form.sourceUrl = r.sourceUrl
  postUrl.value = ''
}
</script>

<template>
  <form class="grid gap-5 rounded-[14px] bg-white p-5 shadow-[0_1px_2px_oklch(0.2_0.03_166/0.08)] md:p-6" @submit.prevent="emit('save', { ...form, sourceUrl: form.sourceUrl || null })">
    <div class="rounded-[12px] bg-paper-2 p-4">
      <p class="flex items-center gap-2 text-sm font-semibold"><Icon name="ph:instagram-logo-bold" class="size-4" />Traer desde un post público</p>
      <p class="mt-0.5 text-sm text-ink-soft">Pega el enlace del post de Instagram o Facebook y llenamos foto, texto y fecha.</p>
      <div class="mt-3 flex gap-2">
        <label class="flex-1">
          <span class="sr-only">Enlace del post</span>
          <input v-model="postUrl" type="url" class="input" placeholder="https://www.instagram.com/p/…" @keydown.enter.prevent="postUrl && importPost()">
        </label>
        <button type="button" class="btn bg-ink px-4! text-base! text-paper" :disabled="!postUrl || imp.busy.value" @click="importPost">
          {{ imp.busy.value ? 'Trayendo…' : 'Importar' }}
        </button>
      </div>
      <p v-if="imp.error.value" class="mt-2 text-sm font-medium text-[oklch(0.5_0.18_25)]" role="alert">{{ imp.error.value }}</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <label class="field">
        <span>Fecha</span>
        <input v-model="form.date" type="date" class="input" required>
      </label>
      <label class="field">
        <span>Etapa</span>
        <select v-model="form.stage" class="input">
          <option v-for="(label, key) in STAGES" :key="key" :value="key">{{ label }}</option>
        </select>
      </label>
    </div>
    <label class="field">
      <span>Título del capítulo</span>
      <input v-model="form.title" type="text" class="input" maxlength="140" placeholder="Ej. Primera semana en la veterinaria">
    </label>
    <label class="field">
      <span>Qué pasó</span>
      <textarea v-model="form.body" rows="5" class="input resize-y" required />
    </label>
    <div class="field">
      <span>Fotos</span>
      <AdminImagePicker v-model="form.images" />
    </div>
    <label class="field">
      <span>Enlace al post original <span class="font-normal text-ink-soft">(opcional)</span></span>
      <input v-model="form.sourceUrl" type="url" class="input" placeholder="https://www.instagram.com/p/…">
    </label>
    <div class="flex justify-end gap-2">
      <button type="button" class="btn px-5! text-base! text-ink-soft hover:text-ink" @click="emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-sun px-5! text-base!" :disabled="props.saving">{{ props.saving ? 'Guardando…' : 'Guardar capítulo' }}</button>
    </div>
  </form>
</template>
