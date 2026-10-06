<script setup lang="ts">
import { motion } from 'motion-v'

const { data: settings } = await useSettings()
const d = computed(() => settings.value!.donation)
const ease = [0.23, 1, 0.32, 1] as const
const noteTilts = [-2, 1.5, -1, 2, -1.5, 1]
const noteColors = ['bg-sun', 'bg-turq', 'bg-mint', 'bg-[oklch(0.86_0.09_20)]']

useSeoMeta({ title: 'Donar | Al ResCate', description: 'Dona con QR, transferencia bancaria o PayPal desde cualquier país.' })
</script>

<template>
  <div v-if="settings" class="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
    <motion.div :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.7, ease }">
      <h1 class="max-w-3xl text-5xl leading-[1.05] font-semibold md:text-6xl">Tu aporte se convierte en el próximo capítulo</h1>
      <p class="mt-5 max-w-xl text-lg text-leaf-soft">Comida, veterinaria, cirugías y esterilizaciones. Cada gasto importante lo contamos en la historia del animal que ayudaste.</p>
    </motion.div>

    <div class="mt-14 grid items-start gap-10 md:grid-cols-[0.9fr_1.1fr]">
      <!-- QR -->
      <motion.div
        class="photocard mx-auto w-full max-w-sm"
        :initial="{ opacity: 0, rotate: 6, y: 30 }" :animate="{ opacity: 1, rotate: -2, y: 0 }"
        :transition="{ type: 'spring', bounce: 0.3, duration: 0.8, delay: 0.1 }"
      >
        <span class="tape" />
        <div v-if="d.qrImage" class="rounded-[3px] bg-white p-4">
          <img :src="d.qrImage" alt="Código QR para donar a Al ResCate" class="aspect-square w-full object-contain">
        </div>
        <div v-else class="grid aspect-square place-items-center rounded-[3px] bg-paper-2 p-8 text-center">
          <div>
            <Icon name="ph:qr-code-bold" class="size-20 text-ink/40" />
            <p class="mt-3 font-hand text-xl text-ink-soft">El QR se publica muy pronto</p>
          </div>
        </div>
        <div class="px-1.5 pt-3 pb-1">
          <p class="photocard-caption text-2xl">Escanea y dona</p>
          <p class="text-sm text-ink-soft">Funciona con la app de cualquier banco boliviano.</p>
          <a v-if="d.qrImage" :href="d.qrImage" download="QR-AlResCate" class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-turq-deep hover:underline">
            <Icon name="ph:download-simple-bold" class="size-4" />Descargar QR
          </a>
        </div>
      </motion.div>

      <div class="grid gap-6">
        <!-- Bank transfer -->
        <motion.section
          class="rounded-[14px] bg-paper p-6 text-ink md:p-8"
          :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.2, ease }"
        >
          <div class="flex items-center gap-3">
            <span class="grid size-11 place-items-center rounded-full bg-sun"><Icon name="ph:bank-fill" class="size-6" /></span>
            <div>
              <h2 class="text-2xl font-semibold">Transferencia en Bolivia</h2>
              <p class="text-sm text-ink-soft">{{ d.accountType }}</p>
            </div>
          </div>
          <div class="mt-4 divide-y divide-ink/10">
            <CopyField label="Banco" :value="d.bankName" />
            <CopyField label="Titular" :value="d.accountHolder" />
            <CopyField v-if="d.accountNumber" label="Número de cuenta" :value="d.accountNumber" />
            <p v-else class="py-3.5 font-hand text-lg text-ink-soft">Número de cuenta por confirmar</p>
          </div>
        </motion.section>

        <!-- International -->
        <motion.section
          class="rounded-[14px] bg-turq p-6 text-ink md:p-8"
          :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.3, ease }"
        >
          <div class="flex items-center gap-3">
            <span class="grid size-11 place-items-center rounded-full bg-ink text-turq"><Icon name="ph:globe-hemisphere-west-fill" class="size-6" /></span>
            <h2 class="text-2xl font-semibold">Desde otro país</h2>
          </div>
          <p class="mt-3 max-w-md text-ink/80">Con PayPal puedes donar con tarjeta desde cualquier lugar del mundo, una sola vez o cada mes.</p>
          <a v-if="d.paypalUrl" :href="d.paypalUrl" target="_blank" rel="noopener" class="btn mt-5 bg-ink text-paper">
            <Icon name="ph:paypal-logo-fill" class="size-5" />Donar con PayPal
          </a>
          <p v-else class="mt-5 font-hand text-lg">Enlace de PayPal por confirmar</p>
        </motion.section>
      </div>
    </div>

    <!-- Supplies -->
    <section v-if="settings.needs.length" class="mt-28">
      <h2 class="text-4xl font-semibold md:text-5xl">También recibimos insumos</h2>
      <p class="mt-4 max-w-xl text-lg text-leaf-soft">Si prefieres ayudar en especie, esto es lo que más usamos cada semana.</p>
      <ul class="mt-12 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
        <motion.li
          v-for="(n, i) in settings.needs" :key="n.item"
          class="relative p-5 pt-7 text-ink shadow-[0_14px_30px_-12px_oklch(0.1_0.04_166/0.6)]"
          :class="noteColors[i % noteColors.length]"
          :initial="{ opacity: 0, y: 24, rotate: 0 }" :while-in-view="{ opacity: 1, y: 0, rotate: noteTilts[i % noteTilts.length] }"
          :while-hover="{ rotate: 0, scale: 1.04 }"
          :in-view-options="{ once: true }" :transition="{ type: 'spring', bounce: 0.35, duration: 0.6, delay: i * 0.05 }"
        >
          <Icon name="ph:push-pin-fill" class="absolute top-2 left-1/2 size-5 -translate-x-1/2 text-ink/50" />
          <p class="font-hand text-2xl leading-tight">{{ n.item }}</p>
          <p v-if="n.note" class="mt-1 text-sm text-ink/70">{{ n.note }}</p>
        </motion.li>
      </ul>
    </section>
  </div>
</template>
