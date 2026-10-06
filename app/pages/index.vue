<script setup lang="ts">
import { motion } from 'motion-v'

const [{ data: stories }, { data: settings }, { data: latest }] = await Promise.all([
  useFetch<Story[]>('/api/stories', { key: 'stories' }),
  useSettings(),
  useFetch('/api/updates/latest', { key: 'latest' }),
])

const featured = computed(() => (stories.value ?? []).filter(s => s.featured))
const heroStories = computed(() => featured.value.slice(0, 4))
const seekingHome = computed(() => (stories.value ?? []).filter(s => s.status === 'buscando_hogar'))
const showcaseSlug = computed(() => (stories.value ?? []).find(s => s.status === 'adoptado' && (s.updateCount ?? 0) >= 3)?.slug)
const { data: showcase } = await useFetch(() => `/api/stories/${showcaseSlug.value}`, { immediate: !!showcaseSlug.value, watch: [showcaseSlug] })

const tilts = [-2.5, 1.8, -1.2, 2.6, -1.8, 1.2, -2.2, 2]
const ease = [0.23, 1, 0.32, 1] as const

useSeoMeta({
  title: 'Al ResCate | Rescate de perros y gatos en Bolivia',
  ogTitle: 'Al ResCate',
  ogDescription: 'Sigue cada historia, desde la calle hasta un hogar.',
  ogImage: '/logo-original.png',
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-16 px-4 pt-10 pb-24 sm:px-6 md:grid-cols-[1.25fr_1fr] md:pt-12">
      <div>
        <motion.h1
          class="text-[clamp(2.5rem,5.4vw,4.4rem)] leading-[1.02] font-semibold"
          :initial="{ opacity: 0, y: 24, filter: 'blur(6px)' }"
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :transition="{ duration: 0.8, ease }"
        >
          De la calle a un hogar,
          <span class="relative inline-block text-sun">
            capítulo a capítulo.
            <svg class="absolute -bottom-3 left-0 w-full text-turq" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M2 9 C 60 2, 120 2, 170 6 S 260 11, 298 4" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                :initial="{ pathLength: 0 }" :animate="{ pathLength: 1 }" :transition="{ duration: 0.9, delay: 0.6, ease }"
              />
            </svg>
          </span>
        </motion.h1>
        <motion.p
          class="mt-8 max-w-[34rem] text-lg leading-relaxed text-leaf-soft md:text-xl"
          :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.7, delay: 0.15, ease }"
        >
          Rescatamos perros y gatos en Bolivia y te mostramos todo el camino: rescate, tratamiento, recuperación y adopción.
        </motion.p>
        <motion.div
          class="mt-10 flex flex-wrap items-center gap-4"
          :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.7, delay: 0.25, ease }"
        >
          <NuxtLink to="/donar" class="btn btn-sun"><Icon name="ph:heart-fill" class="size-5" />Donar</NuxtLink>
          <NuxtLink to="/historias" class="btn btn-ghost">Ver historias</NuxtLink>
        </motion.div>
      </div>

      <HeroStack v-if="heroStories.length" :stories="heroStories" />
    </section>

    <!-- Impact as a sentence, not a stats grid -->
    <section class="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
      <p v-if="settings" class="font-display text-[clamp(1.8rem,4.2vw,3.2rem)] leading-[1.35] font-medium text-leaf">
        Desde {{ settings.impact.since }} sacamos de la calle a
        <ImpactNumber :value="settings.impact.rescued" tone="sun" /> animales,
        esterilizamos a <ImpactNumber :value="settings.impact.sterilized" tone="turq" />
        y <ImpactNumber :value="settings.impact.adopted" tone="mint" /> ya duermen en una casa.
      </p>
      <p class="mt-6 flex items-center gap-2 font-hand text-xl text-leaf-soft">
        <Icon name="ph:paw-print-fill" class="size-5 text-turq" />
        Y cada uno tiene su historia contada aquí.
      </p>
    </section>

    <!-- Stories rail -->
    <section class="py-16">
      <div class="mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 sm:px-6">
        <h2 class="text-4xl font-semibold md:text-5xl">Historias que seguimos</h2>
        <NuxtLink to="/historias" class="group hidden items-center gap-1.5 font-display text-lg font-medium text-turq sm:inline-flex">
          Ver todas <Icon name="ph:arrow-right-bold" class="size-5 transition-transform group-hover:translate-x-1" />
        </NuxtLink>
      </div>
      <div class="rail mt-10 flex snap-x snap-mandatory gap-7 overflow-x-auto pt-6 pb-10">
        <div
          v-for="(s, i) in (stories ?? []).slice(0, 8)" :key="s.id"
          class="w-[min(72vw,280px)] shrink-0 snap-start"
        >
          <PhotoCard :story="s" :tilt="tilts[i % tilts.length]" :tape="i % 3 === 0 ? 'sun' : i % 3 === 1 ? 'turq' : null" />
        </div>
      </div>
      <NuxtLink to="/historias" class="mx-4 inline-flex items-center gap-1.5 font-display text-lg font-medium text-turq sm:hidden">
        Ver todas <Icon name="ph:arrow-right-bold" class="size-5" />
      </NuxtLink>
    </section>

    <!-- How a story looks: real preview of the timeline -->
    <section v-if="showcase" class="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div class="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div class="md:sticky md:top-28 md:self-start">
          <h2 class="text-4xl leading-tight font-semibold md:text-5xl">
            Así se ve un rescate de principio a fin
          </h2>
          <p class="mt-5 max-w-md text-lg text-leaf-soft">
            Cada animal tiene su propia línea de tiempo. Publicamos cada avance, para que veas en qué se usa cada aporte.
          </p>
          <NuxtLink :to="`/historias/${showcase.story.slug}`" class="btn btn-ghost mt-8">
            Leer la historia de {{ showcase.story.name }}
          </NuxtLink>
        </div>
        <StoryTimeline :updates="(showcase.updates as StoryUpdate[]).slice(0, 4)" :name="showcase.story.name" compact />
      </div>
    </section>

    <!-- How to help: bento -->
    <section id="ayudar" class="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
      <h2 class="max-w-2xl text-4xl font-semibold md:text-5xl">Hay muchas formas de ayudar</h2>
      <div class="mt-12 grid gap-5 md:grid-cols-6 md:grid-rows-[auto_auto]">
        <NuxtLink to="/donar" class="group relative overflow-hidden rounded-[14px] bg-sun p-7 text-ink md:col-span-4 md:row-span-2 md:p-10">
          <Icon name="ph:qr-code-bold" class="absolute -right-6 -bottom-6 size-56 text-ink/8 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-rotate-6 group-hover:scale-105" />
          <p class="font-hand text-2xl">desde Bolivia o desde cualquier país</p>
          <h3 class="mt-3 max-w-md text-4xl leading-tight font-semibold md:text-5xl">Dona con QR, transferencia o PayPal</h3>
          <p class="mt-4 max-w-md text-lg text-ink/75">Cubre veterinaria, comida, cirugías y esterilizaciones. Publicamos en qué se usa.</p>
          <span class="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-display text-lg font-semibold text-sun">
            Ver cómo donar <Icon name="ph:arrow-right-bold" class="size-5 transition-transform group-hover:translate-x-1" />
          </span>
        </NuxtLink>

        <NuxtLink to="/historias?estado=buscando_hogar" class="group relative overflow-hidden rounded-[14px] bg-forest-800 md:col-span-2">
          <div class="flex -space-x-6 p-6 pb-0">
            <img
              v-for="(s, i) in seekingHome.slice(0, 3)" :key="s.id" :src="s.cover" :alt="s.name"
              class="size-24 rounded-full border-4 border-forest-800 object-cover transition-transform duration-300 group-hover:translate-y-[-4px]"
              :style="{ transitionDelay: `${i * 40}ms` }" loading="lazy"
            >
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-semibold">Adopta</h3>
            <p class="mt-1 text-leaf-soft">{{ seekingHome.length }} {{ seekingHome.length === 1 ? 'animal busca' : 'animales buscan' }} familia ahora.</p>
          </div>
        </NuxtLink>

        <div class="rounded-[14px] bg-turq p-6 text-ink md:col-span-2">
          <Icon name="ph:hand-heart-fill" class="size-9" />
          <h3 class="mt-3 text-2xl font-semibold">Sé voluntario</h3>
          <p class="mt-1 text-ink/75">Hogar temporal, traslados al veterinario o ayuda en jornadas de esterilización.</p>
          <a v-if="settings?.social.instagram" :href="settings.social.instagram" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline">
            Escríbenos por Instagram <Icon name="ph:arrow-up-right-bold" class="size-4" />
          </a>
        </div>

        <div v-if="settings?.needs.length" class="rounded-[14px] border-2 border-dashed border-leaf/20 p-6 md:col-span-6 md:flex md:items-center md:gap-10 md:p-8">
          <div class="shrink-0">
            <h3 class="text-2xl font-semibold">Lleva insumos</h3>
            <p class="mt-1 text-leaf-soft">Lo que más nos hace falta este mes:</p>
          </div>
          <ul class="mt-5 flex flex-wrap gap-2.5 md:mt-0">
            <li v-for="n in settings.needs" :key="n.item" class="chip bg-forest-800 py-2 text-base font-medium text-leaf">
              <Icon name="ph:paw-print-fill" class="size-4 text-sun" />{{ n.item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Latest chapters feed -->
    <section v-if="latest?.length" class="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <h2 class="text-4xl font-semibold md:text-5xl">Lo último del refugio</h2>
        <a v-if="settings?.social.instagram" :href="settings.social.instagram" target="_blank" rel="noopener" class="btn btn-ghost">
          <Icon name="ph:instagram-logo" class="size-5" />Seguir en Instagram
        </a>
      </div>
      <div class="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        <div
          v-for="(u, i) in latest" :key="u.id" class="break-inside-avoid"
        >
          <NuxtLink :to="`/historias/${u.slug}`" class="photocard group transition-transform duration-300 ease-[var(--ease-out)] hover:-translate-y-1" :style="{ '--tilt': `${tilts[i]! / 2}deg` }">
            <img v-if="u.images[0]" :src="u.images[0]" :alt="`${u.name}: ${u.title}`" class="photocard-img aspect-[4/3]" loading="lazy">
            <div class="px-1.5 pt-3 pb-1" :class="`stage-${u.stage}`">
              <div class="flex items-center justify-between gap-3">
                <span class="chip bg-[var(--stage)] text-xs text-ink">{{ STAGES[u.stage as Stage] }}</span>
                <span class="font-hand text-sm text-ink-soft">{{ fmtDate(u.date) }}</span>
              </div>
              <p class="mt-2.5 font-hand text-2xl leading-tight">{{ u.name }}</p>
              <h3 class="text-lg font-semibold">{{ u.title }}</h3>
              <p class="mt-1 line-clamp-3 text-ink-soft">{{ u.body }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rail {
  scrollbar-width: none;
  --gutter: max(1rem, calc((100vw - 80rem) / 2 + 1.5rem));
  padding-inline: var(--gutter);
  scroll-padding-inline: var(--gutter);
}
.rail::-webkit-scrollbar { display: none; }
</style>
