<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Historias | Panel Al ResCate' })

const { data: stories, refresh } = await useFetch<Story[]>('/api/stories', { key: 'admin-stories' })
const q = ref('')
const list = computed(() => (stories.value ?? []).filter(s => s.name.toLowerCase().includes(q.value.toLowerCase())))
const { call, error } = useAdminApi()

async function remove(s: Story) {
  if (!confirm(`¿Borrar la historia de ${s.name} y todos sus capítulos? No se puede deshacer.`)) return
  await call(`/api/admin/stories/${s.id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-4xl font-semibold">Historias</h1>
        <p class="mt-1 text-ink-soft">Cada animal es una historia. Dentro de ella agregas sus capítulos: rescate, tratamiento, adopción.</p>
      </div>
      <NuxtLink to="/admin/historias/nueva" class="btn btn-sun"><Icon name="ph:plus-bold" class="size-5" />Nueva historia</NuxtLink>
    </div>

    <label class="mt-8 block max-w-xs">
      <span class="sr-only">Buscar por nombre</span>
      <input v-model="q" type="search" class="input" placeholder="Buscar por nombre">
    </label>
    <p v-if="error" class="mt-4 text-sm font-medium text-[oklch(0.5_0.18_25)]" role="alert">{{ error }}</p>

    <ul class="mt-6 grid gap-3">
      <li v-for="s in list" :key="s.id" class="flex items-center gap-4 rounded-[14px] bg-white p-3 pr-4 shadow-[0_1px_2px_oklch(0.2_0.03_166/0.08)]">
        <img :src="s.cover || '/mark.png'" alt="" class="size-16 shrink-0 rounded-[10px] bg-paper-2 object-cover">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <NuxtLink :to="`/admin/historias/${s.id}`" class="font-display text-xl font-semibold hover:text-turq-deep">{{ s.name }}</NuxtLink>
            <StatusChip :status="s.status" />
            <Icon v-if="s.featured" name="ph:star-fill" class="size-4 text-sun-deep" title="Destacada en el inicio" />
          </div>
          <p class="mt-0.5 text-sm text-ink-soft">
            {{ s.updateCount }} {{ s.updateCount === 1 ? 'capítulo' : 'capítulos' }}<template v-if="s.lastDate">, último el {{ fmtDate(s.lastDate) }}</template>
          </p>
        </div>
        <NuxtLink :to="`/historias/${s.slug}`" target="_blank" class="hidden rounded-full p-2.5 text-ink-soft hover:bg-paper-2 hover:text-ink sm:block" :aria-label="`Ver ${s.name} en el sitio`">
          <Icon name="ph:eye-bold" class="size-5" />
        </NuxtLink>
        <NuxtLink :to="`/admin/historias/${s.id}`" class="rounded-full p-2.5 text-ink-soft hover:bg-paper-2 hover:text-ink" :aria-label="`Editar ${s.name}`">
          <Icon name="ph:pencil-simple-bold" class="size-5" />
        </NuxtLink>
        <button type="button" class="rounded-full p-2.5 text-ink-soft hover:bg-[oklch(0.95_0.03_25)] hover:text-[oklch(0.5_0.18_25)]" :aria-label="`Borrar ${s.name}`" @click="remove(s)">
          <Icon name="ph:trash-bold" class="size-5" />
        </button>
      </li>
    </ul>

    <div v-if="!list.length" class="mt-6 rounded-[14px] border-2 border-dashed border-ink/15 p-12 text-center">
      <Icon name="ph:paw-print-fill" class="size-10 text-turq-deep" />
      <p class="mt-3 font-hand text-2xl">{{ q ? 'Ninguna historia con ese nombre.' : 'Todavía no hay historias.' }}</p>
      <NuxtLink v-if="!q" to="/admin/historias/nueva" class="btn btn-sun mt-5">Crear la primera</NuxtLink>
    </div>
  </div>
</template>
