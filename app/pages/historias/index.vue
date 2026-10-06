<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'

const route = useRoute()
const router = useRouter()
const { data: stories } = await useFetch<Story[]>('/api/stories', { key: 'stories' })

const status = computed(() => (route.query.estado as Status | undefined) ?? null)
const species = computed(() => (route.query.especie as Species | undefined) ?? null)
const setFilter = (key: 'estado' | 'especie', v: string | null) =>
  router.replace({ query: { ...route.query, [key]: v ?? undefined } })

const list = computed(() => (stories.value ?? []).filter(s =>
  (!status.value || s.status === status.value) && (!species.value || s.species === species.value)))
const tilts = [-2, 1.5, -1, 2.2, -1.6, 1]

useSeoMeta({ title: 'Historias | Al ResCate', description: 'Cada perro y gato que rescatamos, con su historia completa.' })
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
    <h1 class="text-5xl font-semibold md:text-6xl">Historias</h1>
    <p class="mt-4 max-w-xl text-lg text-leaf-soft">Cada tarjeta es un animal. Ábrela para ver su camino completo, desde el día que lo encontramos.</p>

    <div class="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
      <button type="button" class="chip px-4 py-2 transition-colors" :class="!status ? 'bg-sun text-ink' : 'bg-forest-800 text-leaf hover:bg-forest-700'" :aria-pressed="!status" @click="setFilter('estado', null)">
        Todas
      </button>
      <button
        v-for="(label, key) in STATUS" :key="key" type="button" class="chip px-4 py-2 transition-colors"
        :class="status === key ? 'bg-sun text-ink' : 'bg-forest-800 text-leaf hover:bg-forest-700'"
        :aria-pressed="status === key" @click="setFilter('estado', key)"
      >
        {{ label }}
      </button>
      <span class="mx-1 hidden w-px bg-leaf/15 sm:block" />
      <button
        v-for="sp in (['perro', 'gato'] as const)" :key="sp" type="button" class="chip px-4 py-2 transition-colors"
        :class="species === sp ? 'bg-turq text-ink' : 'bg-forest-800 text-leaf hover:bg-forest-700'"
        :aria-pressed="species === sp" @click="setFilter('especie', species === sp ? null : sp)"
      >
        <Icon :name="sp === 'perro' ? 'ph:dog-fill' : 'ph:cat-fill'" class="size-4" />{{ sp === 'perro' ? 'Perros' : 'Gatos' }}
      </button>
    </div>

    <motion.div layout class="mt-12 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-x-7 gap-y-10">
      <AnimatePresence mode="popLayout">
        <motion.div
          v-for="(s, i) in list" :key="s.id" layout
          :initial="{ opacity: 0, scale: 0.95 }" :animate="{ opacity: 1, scale: 1 }" :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ type: 'spring', bounce: 0.2, duration: 0.45 }"
        >
          <PhotoCard :story="s" :tilt="tilts[i % tilts.length]" :tape="i % 4 === 0 ? 'sun' : i % 4 === 2 ? 'turq' : null" />
        </motion.div>
      </AnimatePresence>
    </motion.div>

    <div v-if="!list.length" class="mx-auto mt-6 max-w-md py-16 text-center">
      <Icon name="ph:paw-print-fill" class="size-12 text-turq" />
      <p class="mt-4 font-hand text-2xl">Por ahora no hay historias con ese filtro.</p>
      <button type="button" class="btn btn-ghost mt-6" @click="router.replace({ query: {} })">Ver todas</button>
    </div>
  </div>
</template>
