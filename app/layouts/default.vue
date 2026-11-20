<script setup lang="ts">
const navigation: ReadonlyArray<{ readonly label: string; readonly to: string }> = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
]

const linkClasses =
  'rounded-lg px-3 py-1.5 text-sm font-medium text-content-muted transition hover:bg-surface-muted hover:text-content'
const activeClasses = 'bg-surface-muted text-content'
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="border-b border-surface-border bg-surface">
      <div class="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
          <img
            src="/icons/icon-192x192.png"
            alt=""
            width="28"
            height="28"
            class="h-7 w-7 rounded-md"
          />
          <span class="text-sm sm:text-base">Nuxt PWA Starter</span>
        </NuxtLink>

        <nav class="ml-auto flex items-center gap-1" aria-label="Main">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            :class="linkClasses"
            :exact-active-class="activeClasses"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <slot />
    </main>

    <footer class="border-t border-surface-border bg-surface">
      <div
        class="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-content-muted"
      >
        <p>Nuxt 3 PWA Starter · MIT licensed</p>
        <p>
          <NuxtLink to="/about" class="font-medium text-brand hover:underline">About</NuxtLink>
          <span aria-hidden="true"> · </span>
          <NuxtLink to="/offline" class="font-medium text-brand hover:underline">Offline</NuxtLink>
        </p>
      </div>
    </footer>

    <!-- Global PWA surfaces: install banner (bottom) and update toast (top). -->
    <PwaInstallBanner />
    <PwaUpdatePrompt />
  </div>
</template>
