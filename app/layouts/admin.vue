<script setup lang="ts">
const { clear } = useUserSession()
const route = useRoute()
async function logout() {
  await $fetch('/api/logout', { method: 'POST' })
  await clear()
  navigateTo('/admin/login')
}
const links = [
  { to: '/admin', label: 'Historias', icon: 'ph:paw-print-fill', exact: true },
  { to: '/admin/ajustes', label: 'Donaciones y datos', icon: 'ph:gear-six-fill' },
]
const active = (l: typeof links[number]) => l.exact ? route.path === l.to || route.path.startsWith('/admin/historias') : route.path.startsWith(l.to)
</script>

<template>
  <div class="min-h-dvh bg-paper-2 text-ink">
    <header class="sticky top-0 z-30 bg-forest-950 text-leaf">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div class="flex items-center gap-6">
          <BrandMark />
          <nav class="hidden gap-1 sm:flex">
            <NuxtLink
              v-for="l in links" :key="l.to" :to="l.to"
              class="inline-flex items-center gap-2 rounded-full px-4 py-2 font-display font-medium transition-colors"
              :class="active(l) ? 'bg-forest-800 text-sun' : 'text-leaf/80 hover:text-leaf'"
            >
              <Icon :name="l.icon" class="size-4" />{{ l.label }}
            </NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink to="/" target="_blank" class="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-leaf/80 hover:text-leaf md:inline-flex">
            Ver sitio <Icon name="ph:arrow-up-right-bold" class="size-4" />
          </NuxtLink>
          <button type="button" class="rounded-full px-3 py-2 text-sm text-leaf/80 hover:text-leaf" @click="logout">Salir</button>
        </div>
      </div>
      <nav class="flex gap-1 px-4 pb-3 sm:hidden">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="rounded-full px-3 py-1.5 text-sm font-medium" :class="active(l) ? 'bg-forest-800 text-sun' : 'text-leaf/80'">{{ l.label }}</NuxtLink>
      </nav>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <slot />
    </main>
  </div>
</template>
