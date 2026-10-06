<script setup lang="ts">
const props = defineProps<{ status: Status }>()
const tone: Record<Status, string> = {
  rescatado: 'bg-sun text-ink',
  en_tratamiento: 'bg-turq text-ink',
  en_recuperacion: 'bg-mint text-ink',
  buscando_hogar: 'bg-[oklch(0.82_0.12_20)] text-ink',
  adoptado: 'bg-forest-800 text-leaf',
  en_memoria: 'bg-[oklch(0.78_0.04_280)] text-ink',
}
const icon: Record<Status, string> = {
  rescatado: 'ph:siren-fill',
  en_tratamiento: 'ph:first-aid-fill',
  en_recuperacion: 'ph:plant-fill',
  buscando_hogar: 'ph:house-line-fill',
  adoptado: 'ph:heart-fill',
  en_memoria: 'ph:star-fill',
}
</script>

<template>
  <span class="chip text-xs" :class="tone[props.status]">
    <Icon :name="icon[props.status]" class="size-3.5" />{{ STATUS[props.status] }}
  </span>
</template>
