<script setup lang="ts">
const route = useRoute()

useSeoMeta({
  title: 'Page not found',
  description: 'The page you were looking for does not exist.',
  robots: 'noindex',
})

// Answer with a real 404 status when server-rendered, while still rendering
// this page (not Nuxt's default error screen).
if (import.meta.server) {
  const event = useRequestEvent()
  if (event) {
    setResponseStatus(event, 404)
  }
}
</script>

<template>
  <div class="flex flex-col items-center py-10 text-center">
    <p class="text-sm font-semibold uppercase tracking-widest text-content-muted">Error 404</p>
    <h1 class="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Page not found</h1>

    <p class="mt-3 max-w-md text-sm leading-relaxed text-content-muted">
      Nothing lives at
      <code class="rounded bg-surface-muted px-1.5 py-0.5 text-xs">{{ route.fullPath }}</code>. It
      may have moved, or the link may be wrong.
    </p>

    <div class="mt-7 flex flex-wrap justify-center gap-3">
      <NuxtLink
        to="/"
        class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-emphasis"
      >
        Back to the home page
      </NuxtLink>
      <NuxtLink
        to="/about"
        class="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium transition hover:bg-surface-muted"
      >
        Read about this starter
      </NuxtLink>
    </div>
  </div>
</template>
