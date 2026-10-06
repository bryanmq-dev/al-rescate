<script setup lang="ts">
import { useInView } from 'motion-v'

const props = defineProps<{ value: number, tone: 'sun' | 'turq' | 'mint' }>()
const el = ref<HTMLElement>()
const inView = useInView(el, { once: true })
const shown = ref(props.value)

onMounted(() => { shown.value = 0 })
watch(inView, (v) => {
  if (!v) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return void (shown.value = props.value)
  const start = performance.now()
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / 1400)
    shown.value = Math.round(props.value * (1 - Math.pow(1 - p, 4)))
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
const bg = { sun: 'var(--color-sun)', turq: 'var(--color-turq)', mint: 'var(--color-mint)' }
</script>

<template>
  <span ref="el" class="marker tabular-nums" :style="{ '--marker': bg[props.tone] }">{{ shown.toLocaleString('es-BO') }}</span>
</template>

<style scoped>
.marker {
  position: relative;
  padding-inline: 0.15em;
  white-space: nowrap;
  color: var(--color-ink);
  background: linear-gradient(transparent 8%, var(--marker) 8%, var(--marker) 92%, transparent 92%);
  border-radius: 0.25em 0.5em 0.3em 0.6em;
  box-decoration-break: clone;
}
</style>
