<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'

const props = defineProps<{ label: string, value: string }>()
const copied = ref(false)
let t: ReturnType<typeof setTimeout>
async function copy() {
  await navigator.clipboard.writeText(props.value)
  copied.value = true
  clearTimeout(t)
  t = setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <div class="flex items-center justify-between gap-4 py-3.5">
    <div class="min-w-0">
      <p class="text-sm text-ink-soft">{{ props.label }}</p>
      <p class="truncate font-display text-lg font-semibold text-ink">{{ props.value }}</p>
    </div>
    <button
      type="button" class="relative grid size-11 shrink-0 place-items-center rounded-full bg-paper-2 text-ink transition-transform active:scale-95"
      :aria-label="`Copiar ${props.label}`" @click="copy"
    >
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span
          :key="copied ? 'ok' : 'copy'" class="grid place-items-center"
          :initial="{ opacity: 0, scale: 0.6, filter: 'blur(3px)' }" :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }" :exit="{ opacity: 0, scale: 0.6, filter: 'blur(3px)' }"
          :transition="{ duration: 0.18 }"
        >
          <Icon :name="copied ? 'ph:check-bold' : 'ph:copy-bold'" class="size-5" :class="copied && 'text-turq-deep'" />
        </motion.span>
      </AnimatePresence>
    </button>
    <span class="sr-only" aria-live="polite">{{ copied ? 'Copiado' : '' }}</span>
  </div>
</template>
