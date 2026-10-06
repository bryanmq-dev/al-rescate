<script setup lang="ts">
import { motion } from 'motion-v'

// A pile of photocards. Fling the top one away and it slides to the back of the pile.
const props = defineProps<{ stories: Story[] }>()
const order = ref(props.stories.map((_, i) => i))
const pose = [
  { rotate: -3, x: 0, y: 0, scale: 1 },
  { rotate: 7, x: 46, y: 14, scale: 0.96 },
  { rotate: -10, x: -42, y: 26, scale: 0.92 },
  { rotate: 4, x: 10, y: 34, scale: 0.88 },
]
const depth = (i: number) => order.value.indexOf(i)
const settled = ref(false)
onMounted(() => setTimeout(() => (settled.value = true), 900))

function sendBack() {
  order.value = [...order.value.slice(1), order.value[0]!]
}
function onDragEnd(_: unknown, info: { offset: { x: number, y: number }, velocity: { x: number } }) {
  if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) sendBack()
}
</script>

<template>
  <div class="relative mx-auto aspect-[4/5] w-[min(78vw,340px)]">
    <motion.div
      v-for="(s, i) in props.stories" :key="s.id"
      class="absolute inset-0 touch-pan-y"
      :style="{ zIndex: 10 - depth(i) }"
      :initial="{ opacity: 0, y: 80, rotate: 0 }"
      :animate="{ opacity: 1, ...pose[Math.min(depth(i), 3)] }"
      :transition="{ type: 'spring', bounce: 0.28, duration: 0.7, delay: settled ? 0 : 0.15 + i * 0.08 }"
      :drag="depth(i) === 0 ? 'x' : false"
      :drag-snap-to-origin="true"
      :drag-elastic="0.6"
      :while-drag="{ scale: 1.04, rotate: 0, cursor: 'grabbing' }"
      @drag-end="onDragEnd"
    >
      <div class="photocard h-full cursor-grab">
        <span v-if="depth(i) === 0" class="tape" />
        <img :src="s.cover" :alt="`${s.name}, rescatado por Al ResCate`" class="photocard-img pointer-events-none h-[82%] w-full" draggable="false" :loading="i === 0 ? 'eager' : 'lazy'" width="340" height="340">
        <div class="flex items-center justify-between px-1 pt-2">
          <span class="photocard-caption text-3xl">{{ s.name }}</span>
          <StatusChip :status="s.status" />
        </div>
      </div>
    </motion.div>

    <button
      type="button"
      class="absolute -right-2 -bottom-14 z-20 flex items-center gap-1.5 font-hand text-lg text-sun sm:-right-10"
      @click="sendBack"
    >
      <Icon name="ph:arrow-bend-up-left-bold" class="size-5 rotate-12" />
      desliza o toca para ver otro
    </button>
  </div>
</template>
