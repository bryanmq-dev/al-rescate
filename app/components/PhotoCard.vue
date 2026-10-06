<script setup lang="ts">
import { motion } from 'motion-v'

const props = withDefaults(defineProps<{ story: Story, tilt?: number, tape?: 'sun' | 'turq' | null, eager?: boolean }>(), { tilt: 0, tape: null })
const species = computed(() => props.story.species === 'gato' ? 'ph:cat-fill' : 'ph:dog-fill')
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y: 24, rotate: props.tilt * 2 }"
    :while-in-view="{ opacity: 1, y: 0, rotate: props.tilt }"
    :in-view-options="{ once: true, amount: 0.2 }"
    :while-hover="{ rotate: 0, y: -8, scale: 1.02 }"
    :while-press="{ scale: 0.98 }"
    :transition="{ type: 'spring', bounce: 0.3, duration: 0.6 }"
    class="relative"
  >
    <NuxtLink :to="`/historias/${props.story.slug}`" class="photocard group" :aria-label="`Historia de ${props.story.name}`">
      <span v-if="props.tape" class="tape" :class="props.tape === 'turq' && 'tape-turq'" />
      <div class="relative overflow-hidden rounded-[3px]">
        <img
          :src="props.story.cover" :alt="`${props.story.name}, ${SPECIES[props.story.species].toLowerCase()} rescatado por Al ResCate`"
          class="photocard-img aspect-[4/5] transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]"
          :loading="props.eager ? 'eager' : 'lazy'" width="400" height="500"
        >
      </div>
      <div class="flex items-start justify-between gap-2 px-1 pt-2.5">
        <div class="min-w-0">
          <p class="photocard-caption text-[1.65rem]">{{ props.story.name }}</p>
          <p class="mt-0.5 line-clamp-2 text-sm leading-snug text-ink-soft">{{ props.story.summary }}</p>
        </div>
        <Icon :name="species" class="mt-1.5 size-5 shrink-0 text-ink/30" />
      </div>
      <div class="mt-2.5 flex items-center justify-between px-1">
        <StatusChip :status="props.story.status" />
        <span v-if="props.story.updateCount" class="font-hand text-sm text-ink-soft">
          {{ props.story.updateCount }} {{ props.story.updateCount === 1 ? 'capítulo' : 'capítulos' }}
        </span>
      </div>
    </NuxtLink>
  </motion.div>
</template>
