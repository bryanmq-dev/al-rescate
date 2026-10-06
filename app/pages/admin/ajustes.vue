<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Donaciones y datos | Panel Al ResCate' })

const { data } = await useSettings()
const s = reactive(structuredClone(toRaw(data.value!)))
const qr = computed({ get: () => (s.donation.qrImage ? [s.donation.qrImage] : []), set: v => (s.donation.qrImage = v[0] ?? '') })
const { call, error, busy } = useAdminApi()
const saved = ref(false)

async function save() {
  s.needs = s.needs.filter(n => n.item.trim())
  const res = await call<Settings>('/api/admin/settings', { method: 'PUT', body: s })
  if (!res) return
  data.value = res
  saved.value = true
  setTimeout(() => (saved.value = false), 1800)
}
</script>

<template>
  <form class="grid gap-8" @submit.prevent="save">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-4xl font-semibold">Donaciones y datos</h1>
        <p class="mt-1 text-ink-soft">Lo que cambies aquí se ve en el inicio y en la página Donar.</p>
      </div>
      <button type="submit" class="btn btn-sun" :disabled="busy">
        <Icon v-if="saved" name="ph:check-bold" class="size-5" />{{ busy ? 'Guardando…' : saved ? 'Guardado' : 'Guardar todo' }}
      </button>
    </div>
    <p v-if="error" class="text-sm font-medium text-[oklch(0.5_0.18_25)]" role="alert">{{ error }}</p>

    <div class="grid gap-8 lg:grid-cols-2">
      <section class="grid content-start gap-5 rounded-[14px] bg-white p-6">
        <h2 class="text-2xl font-semibold">Pago por QR y transferencia</h2>
        <div class="field">
          <span>Imagen del QR</span>
          <AdminImagePicker v-model="qr" :multiple="false" />
          <small class="text-ink-soft">Descarga el QR desde la app de tu banco y súbelo aquí.</small>
        </div>
        <label class="field"><span>Banco</span><input v-model="s.donation.bankName" class="input"></label>
        <label class="field"><span>Titular</span><input v-model="s.donation.accountHolder" class="input"></label>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="field"><span>Número de cuenta</span><input v-model="s.donation.accountNumber" class="input" inputmode="numeric"></label>
          <label class="field"><span>Tipo de cuenta</span><input v-model="s.donation.accountType" class="input"></label>
        </div>
        <label class="field">
          <span>Enlace de PayPal <span class="font-normal text-ink-soft">(donaciones internacionales)</span></span>
          <input v-model="s.donation.paypalUrl" type="url" class="input" placeholder="https://www.paypal.com/donate/?hosted_button_id=…">
        </label>
      </section>

      <div class="grid content-start gap-8">
        <section class="grid gap-5 rounded-[14px] bg-white p-6">
          <h2 class="text-2xl font-semibold">Números de impacto</h2>
          <p class="-mt-3 text-sm text-ink-soft">Aparecen como frase en el inicio. Actualízalos cuando cambien.</p>
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="field"><span>Desde el año</span><input v-model="s.impact.since" class="input" inputmode="numeric"></label>
            <label class="field"><span>Animales rescatados</span><input v-model.number="s.impact.rescued" type="number" min="0" class="input"></label>
            <label class="field"><span>Esterilizados</span><input v-model.number="s.impact.sterilized" type="number" min="0" class="input"></label>
            <label class="field"><span>Adoptados</span><input v-model.number="s.impact.adopted" type="number" min="0" class="input"></label>
          </div>
        </section>

        <section class="grid gap-5 rounded-[14px] bg-white p-6">
          <h2 class="text-2xl font-semibold">Redes</h2>
          <label class="field"><span>Instagram</span><input v-model="s.social.instagram" type="url" class="input"></label>
          <label class="field"><span>Facebook</span><input v-model="s.social.facebook" type="url" class="input"></label>
          <label class="field"><span>WhatsApp <span class="font-normal text-ink-soft">(con código de país)</span></span><input v-model="s.social.whatsapp" type="tel" class="input" placeholder="+591 7…"></label>
        </section>
      </div>
    </div>

    <section class="rounded-[14px] bg-white p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-semibold">Insumos que necesitamos</h2>
          <p class="text-sm text-ink-soft">Se muestran como notas en Donar y como lista en el inicio.</p>
        </div>
        <button type="button" class="btn bg-ink px-4! text-base! text-paper" @click="s.needs.push({ item: '', note: '' })">
          <Icon name="ph:plus-bold" class="size-4" />Agregar
        </button>
      </div>
      <ul class="mt-5 grid gap-3">
        <li v-for="(n, i) in s.needs" :key="i" class="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label class="field"><span :class="i && 'sm:sr-only'">Insumo</span><input v-model="n.item" class="input" placeholder="Ej. Alimento para gatos"></label>
          <label class="field"><span :class="i && 'sm:sr-only'">Detalle</span><input v-model="n.note" class="input" placeholder="Ej. Sacos de 10 kg"></label>
          <button type="button" class="mb-1 justify-self-start rounded-full p-2.5 text-ink-soft hover:bg-[oklch(0.95_0.03_25)] hover:text-[oklch(0.5_0.18_25)]" :aria-label="`Quitar ${n.item || 'insumo'}`" @click="s.needs.splice(i, 1)">
            <Icon name="ph:trash-bold" class="size-5" />
          </button>
        </li>
      </ul>
    </section>
  </form>
</template>
