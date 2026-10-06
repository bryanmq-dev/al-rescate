<script setup lang="ts">
definePageMeta({ layout: false })
const password = ref('')
const { call, error, busy } = useAdminApi()
const { fetch: refreshSession } = useUserSession()
async function submit() {
  const ok = await call('/api/login', { method: 'POST', body: { password: password.value } })
  if (!ok) return
  await refreshSession()
  navigateTo('/admin')
}
</script>

<template>
  <div class="relative isolate grid min-h-dvh place-items-center px-4">
    <PawBackground />
    <form class="photocard w-full max-w-sm p-8!" style="--tilt: -1.5deg" @submit.prevent="submit">
      <span class="tape" />
      <img src="/mark.png" alt="" class="mx-auto h-16 w-auto">
      <h1 class="mt-4 text-center text-3xl font-semibold">Panel del equipo</h1>
      <p class="mt-1 text-center text-ink-soft">Entra para publicar historias.</p>
      <label class="field mt-6">
        <span>Contraseña</span>
        <input v-model="password" type="password" class="input" autocomplete="current-password" required autofocus>
      </label>
      <p v-if="error" class="mt-2 text-sm font-medium text-[oklch(0.5_0.18_25)]" role="alert">{{ error }}</p>
      <button type="submit" class="btn btn-sun mt-6 w-full" :disabled="busy">{{ busy ? 'Entrando…' : 'Entrar' }}</button>
    </form>
  </div>
</template>
