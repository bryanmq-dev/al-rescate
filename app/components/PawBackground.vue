<script setup lang="ts">
// Trails of paw prints that "walk" across the page background, plus a few loose prints.
// Pure CSS animation: runs off the main thread and stops under reduced motion.
const trails = [
  { top: '12%', left: '-4%', rot: 18, delay: 0, icon: 'ph:paw-print-fill', color: 'var(--color-turq)' },
  { top: '58%', left: '62%', rot: -28, delay: 5, icon: 'ph:paw-print-fill', color: 'var(--color-sun)' },
  { top: '82%', left: '8%', rot: 4, delay: 9, icon: 'ph:paw-print-fill', color: 'var(--color-mint)' },
]
const steps = 9
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div class="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_85%_-10%,oklch(0.36_0.07_190/0.55),transparent),radial-gradient(50rem_40rem_at_-10%_110%,oklch(0.34_0.07_120/0.45),transparent)]" />
    <div
      v-for="(t, i) in trails" :key="i" class="absolute flex gap-7"
      :style="{ top: t.top, left: t.left, transform: `rotate(${t.rot}deg)` }"
    >
      <Icon
        v-for="s in steps" :key="s" :name="t.icon" class="paw-step size-7"
        :style="{ color: t.color, '--i': s, '--d': `${t.delay}s`, translate: `0 ${s % 2 ? -14 : 14}px`, rotate: '90deg' }"
      />
    </div>
  </div>
</template>

<style scoped>
.paw-step {
  opacity: 0;
  animation: step 14s linear infinite;
  animation-delay: calc(var(--d) + var(--i) * 0.45s);
}
@keyframes step {
  0% { opacity: 0; scale: 0.8; }
  3% { opacity: 0.22; scale: 1; }
  40% { opacity: 0.12; }
  60%, 100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .paw-step { animation: none; opacity: 0.08; }
}
</style>
