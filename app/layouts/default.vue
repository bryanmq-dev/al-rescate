<script setup lang="ts">
const { data: settings } = await useSettings()
const route = useRoute()
</script>

<template>
  <div class="relative isolate min-h-dvh overflow-x-clip">
    <PawBackground />
    <header class="sticky top-0 z-30 border-b border-leaf/10 bg-forest-950/80 backdrop-blur-md">
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandMark />
        <div class="flex items-center gap-1 sm:gap-2">
          <NuxtLink to="/historias" class="rounded-full px-3 py-2 font-display font-medium text-leaf/85 transition-colors hover:text-leaf" :class="route.path.startsWith('/historias') && 'text-sun!'">
            Historias
          </NuxtLink>
          <NuxtLink to="/#ayudar" class="hidden rounded-full px-3 py-2 font-display font-medium text-leaf/85 transition-colors hover:text-leaf sm:block">
            Cómo ayudar
          </NuxtLink>
          <a v-if="settings?.social.instagram" :href="settings.social.instagram" target="_blank" rel="noopener" class="hidden rounded-full p-2 text-leaf/85 transition-colors hover:text-turq sm:block" aria-label="Instagram de Al ResCate">
            <Icon name="ph:instagram-logo" class="size-6" />
          </a>
          <NuxtLink to="/donar" class="btn btn-sun ml-1 px-4! py-2! text-base!">
            <Icon name="ph:heart-fill" class="size-4" />Donar
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-24 border-t border-leaf/10">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandMark />
          <p class="mt-4 max-w-sm text-leaf-soft">
            Rescatamos, curamos y buscamos hogar para perros y gatos de la calle en Bolivia. Cada historia la escriben ustedes con nosotros.
          </p>
        </div>
        <div>
          <h2 class="font-display text-lg font-semibold">Explora</h2>
          <ul class="mt-3 grid gap-2 text-leaf-soft">
            <li><NuxtLink to="/historias" class="hover:text-sun">Todas las historias</NuxtLink></li>
            <li><NuxtLink to="/historias?estado=buscando_hogar" class="hover:text-sun">Buscan hogar</NuxtLink></li>
            <li><NuxtLink to="/donar" class="hover:text-sun">Donar</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="font-display text-lg font-semibold">Síguenos</h2>
          <ul class="mt-3 grid gap-2 text-leaf-soft">
            <li v-if="settings?.social.instagram">
              <a :href="settings.social.instagram" target="_blank" rel="noopener" class="inline-flex items-center gap-2 hover:text-turq"><Icon name="ph:instagram-logo" class="size-5" />@kevyn_alrescate</a>
            </li>
            <li v-if="settings?.social.facebook">
              <a :href="settings.social.facebook" target="_blank" rel="noopener" class="inline-flex items-center gap-2 hover:text-turq"><Icon name="ph:facebook-logo" class="size-5" />Al ResCate</a>
            </li>
            <li v-if="settings?.social.whatsapp">
              <a :href="`https://wa.me/${settings.social.whatsapp.replace(/\D/g, '')}`" target="_blank" rel="noopener" class="inline-flex items-center gap-2 hover:text-turq"><Icon name="ph:whatsapp-logo" class="size-5" />WhatsApp</a>
            </li>
          </ul>
        </div>
      </div>
      <p class="pb-8 text-center text-sm text-leaf-soft/70">Hecho con cariño en Bolivia</p>
    </footer>
  </div>
</template>
