<script setup lang="ts">
import { motion, useScroll, useTransform } from 'motion-v'

const props = defineProps<{ updates: StoryUpdate[], name: string, compact?: boolean }>()
const root = ref<HTMLElement>()
// The thread draws itself as the reader scrolls through the story.
const { scrollYProgress } = useScroll({ target: root, offset: ['start 70%', 'end 60%'] })
const thread = useTransform(scrollYProgress, [0, 1], [0, 1])

const stageIcon: Record<Stage, string> = {
  rescate: 'ph:siren-fill',
  tratamiento: 'ph:first-aid-fill',
  recuperacion: 'ph:plant-fill',
  adopcion: 'ph:house-line-fill',
  actualizacion: 'ph:chat-circle-dots-fill',
  memoria: 'ph:star-fill',
}
const tilt = (i: number) => (i % 2 ? 1.6 : -1.4)
const isInstagram = (u: string) => u.includes('instagram.com')
</script>

<template>
  <ol ref="root" :class="['relative mx-auto grid max-w-5xl gap-14', !props.compact && 'md:gap-20']">
    <!-- thread -->
    <div class="absolute top-2 bottom-2 left-[18px] w-1 rounded-full bg-leaf/10" :class="!props.compact && 'md:left-1/2 md:-translate-x-1/2'" aria-hidden="true">
      <motion.div class="h-full w-full origin-top rounded-full bg-gradient-to-b from-sun via-turq to-mint" :style="{ scaleY: thread }" />
    </div>

    <li
      v-for="(u, i) in props.updates" :key="u.id"
      class="relative grid gap-4 pl-14"
      :class="[`stage-${u.stage}`, !props.compact && 'md:grid-cols-2 md:gap-16 md:pl-0']"
    >
      <!-- node -->
      <motion.span
        class="absolute top-0 left-0 grid size-10 place-items-center rounded-full bg-[var(--stage)] text-ink shadow-[0_0_0_6px_var(--color-forest-950)]"
        :class="!props.compact && 'md:left-1/2 md:-translate-x-1/2'"
        :initial="{ scale: 0.6, opacity: 0 }"
        :while-in-view="{ scale: 1, opacity: 1 }"
        :in-view-options="{ once: true, amount: 0.8 }"
        :transition="{ type: 'spring', bounce: 0.5, duration: 0.5 }"
      >
        <Icon :name="stageIcon[u.stage]" class="size-5" />
      </motion.span>

      <!-- date + stage, opposite side of the card on desktop -->
      <div :class="!props.compact && (i % 2 ? 'md:order-2 md:pl-12 md:pt-1' : 'md:pr-12 md:pt-1 md:text-right')">
        <p class="font-hand text-xl text-sun">{{ fmtDate(u.date) }}</p>
        <p class="mt-1 inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide text-[var(--stage)]">
          {{ STAGES[u.stage] }}
        </p>
      </div>

      <motion.article
        class="photocard"
        :class="!props.compact && i % 2 ? 'md:order-1' : ''"
        :style="{ '--tilt': '0deg' }"
        :initial="{ opacity: 0, x: i % 2 ? -40 : 40, rotate: tilt(i) * 3 }"
        :while-in-view="{ opacity: 1, x: 0, rotate: tilt(i) }"
        :in-view-options="{ once: true, amount: 0.25 }"
        :transition="{ type: 'spring', bounce: 0.25, duration: 0.8 }"
      >
        <span class="tape" :class="i % 2 && 'tape-turq'" />
        <div v-if="u.images.length" class="grid gap-1.5" :class="u.images.length > 1 ? 'grid-cols-2' : ''">
          <img
            v-for="(src, k) in u.images.slice(0, 4)" :key="src"
            :src="src" :alt="`${props.name}: ${u.title || STAGES[u.stage]}${u.images.length > 1 ? `, foto ${k + 1}` : ''}`"
            class="photocard-img" :class="u.images.length > 1 ? 'aspect-square' : 'aspect-[4/3]'"
            loading="lazy"
          >
        </div>
        <div class="px-1.5 pt-3 pb-1">
          <h3 v-if="u.title" class="text-xl font-semibold text-ink">{{ u.title }}</h3>
          <p class="mt-1.5 leading-relaxed whitespace-pre-line text-ink-soft">{{ u.body }}</p>
          <a
            v-if="u.sourceUrl" :href="u.sourceUrl" target="_blank" rel="noopener"
            class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-turq-deep hover:underline"
          >
            <Icon :name="isInstagram(u.sourceUrl) ? 'ph:instagram-logo' : 'ph:facebook-logo'" class="size-4" />
            Ver la publicación original
          </a>
        </div>
      </motion.article>
    </li>
  </ol>
</template>
