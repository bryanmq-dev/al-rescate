<script setup lang="ts">
// Upload one or many photos. v-model is the list of URLs.
const props = withDefaults(defineProps<{ multiple?: boolean }>(), { multiple: true })
const model = defineModel<string[]>({ required: true })
const { call, error, busy } = useAdminApi()
const dragging = ref(false)
const input = ref<HTMLInputElement>()

async function upload(files: FileList | File[] | null | undefined) {
  const list = Array.from(files ?? []).filter(f => f.type.startsWith('image/'))
  if (!list.length) return
  const form = new FormData()
  for (const f of props.multiple ? list : list.slice(0, 1)) form.append('file', f)
  const res = await call<{ urls: string[] }>('/api/admin/upload', { method: 'POST', body: form })
  if (res) model.value = props.multiple ? [...model.value, ...res.urls] : res.urls
  if (input.value) input.value.value = ''
}
const remove = (i: number) => (model.value = model.value.filter((_, k) => k !== i))
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-3">
      <div v-for="(src, i) in model" :key="src" class="group relative">
        <img :src="src" alt="" class="size-24 rounded-[10px] bg-paper-2 object-cover">
        <span v-if="i === 0 && props.multiple && model.length > 1" class="absolute bottom-1 left-1 rounded-full bg-ink/75 px-2 py-0.5 text-[11px] font-semibold text-paper">Principal</span>
        <button type="button" class="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-ink text-paper shadow transition-transform active:scale-90" aria-label="Quitar foto" @click="remove(i)">
          <Icon name="ph:x-bold" class="size-3.5" />
        </button>
      </div>
      <label
        v-if="props.multiple || !model.length"
        class="grid size-24 cursor-pointer place-items-center rounded-[10px] border-2 border-dashed text-center text-xs font-semibold transition-colors"
        :class="dragging ? 'border-turq-deep bg-turq/10 text-turq-deep' : 'border-ink/20 text-ink-soft hover:border-turq-deep hover:text-turq-deep'"
        @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="dragging = false; upload($event.dataTransfer?.files)"
      >
        <span v-if="busy" class="animate-pulse">Subiendo…</span>
        <span v-else class="grid place-items-center gap-1"><Icon name="ph:image-square-bold" class="size-6" />{{ props.multiple ? 'Agregar fotos' : 'Subir foto' }}</span>
        <input ref="input" type="file" accept="image/*" class="sr-only" :multiple="props.multiple" @change="upload(($event.target as HTMLInputElement).files)">
      </label>
    </div>
    <p v-if="error" class="mt-2 text-sm font-medium text-[oklch(0.5_0.18_25)]" role="alert">{{ error }}</p>
  </div>
</template>
