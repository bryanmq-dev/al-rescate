<script setup lang="ts">
import { motion } from 'motion-v'

const route = useRoute()
const { data, error } = await useFetch(`/api/stories/${route.params.slug}`)
const { data: settings } = await useSettings()
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Historia no encontrada', fatal: true })
const story = computed(() => data.value!.story as Story)
const updates = computed(() => data.value!.updates as StoryUpdate[])
const needsHelp = computed(() => ['rescatado', 'en_tratamiento', 'en_recuperacion'].includes(story.value.status))
const ease = [0.23, 1, 0.32, 1] as const

useSeoMeta({
  title: () => `${story.value.name} | Al ResCate`,
  description: () => story.value.summary,
  ogImage: () => story.value.cover,
})
</script>

<template>
  <article>
    <header class="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-20 sm:px-6 md:grid-cols-[1fr_1.1fr] md:pt-16">
      <motion.div
        class="photocard mx-auto w-[min(80vw,380px)]"
        :initial="{ opacity: 0, rotate: -8, y: 30 }" :animate="{ opacity: 1, rotate: -2.5, y: 0 }"
        :transition="{ type: 'spring', bounce: 0.3, duration: 0.8 }"
      >
        <span class="tape" />
        <img :src="story.cover" :alt="`${story.name}, ${SPECIES[story.species].toLowerCase()}`" class="photocard-img aspect-[4/5]" width="380" height="475">
        <p class="photocard-caption px-1 pt-3 text-center text-4xl">{{ story.name }}</p>
      </motion.div>

      <motion.div :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.7, delay: 0.1, ease }">
        <NuxtLink to="/historias" class="inline-flex items-center gap-1.5 font-display font-medium text-leaf-soft hover:text-leaf">
          <Icon name="ph:arrow-left-bold" class="size-4" />Todas las historias
        </NuxtLink>
        <div class="mt-6"><StatusChip :status="story.status" /></div>
        <h1 class="mt-4 text-6xl font-semibold md:text-7xl">{{ story.name }}</h1>
        <p class="mt-5 max-w-lg text-xl leading-relaxed text-leaf-soft">{{ story.summary }}</p>
        <p class="mt-6 font-hand text-lg text-sun">
          {{ updates.length }} {{ updates.length === 1 ? 'capítulo' : 'capítulos' }} desde {{ fmtDate(updates[0]?.date ?? story.createdAt) }}
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <NuxtLink v-if="needsHelp" to="/donar" class="btn btn-sun"><Icon name="ph:heart-fill" class="size-5" />Ayuda a {{ story.name }}</NuxtLink>
          <a v-else-if="story.status === 'buscando_hogar' && settings?.social.instagram" :href="settings.social.instagram" target="_blank" rel="noopener" class="btn btn-sun"><Icon name="ph:house-line-fill" class="size-5" />Quiero adoptar</a>
        </div>
      </motion.div>
    </header>

    <section class="px-4 sm:px-6" aria-label="Línea de tiempo">
      <StoryTimeline v-if="updates.length" :updates="updates" :name="story.name" />
      <p v-else class="mx-auto max-w-md text-center font-hand text-2xl text-leaf-soft">Pronto publicaremos el primer capítulo.</p>
    </section>

    <aside class="mx-auto mt-28 max-w-3xl px-4 text-center sm:px-6">
      <Icon name="ph:paw-print-fill" class="size-10 text-turq" />
      <h2 class="mt-4 text-4xl font-semibold">La próxima historia la escribes tú</h2>
      <p class="mx-auto mt-4 max-w-lg text-lg text-leaf-soft">Con cada aporte rescatamos a otro animal y le damos su propio capítulo uno.</p>
      <NuxtLink to="/donar" class="btn btn-sun mt-8"><Icon name="ph:heart-fill" class="size-5" />Donar</NuxtLink>
    </aside>
  </article>
</template>
