<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: 'What the Nuxt 3 PWA starter includes, and how to test offline navigation.',
})
</script>

<template>
  <article class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">About</h1>
      <p class="text-sm text-content-muted">
        A second route, kept deliberately small — it is the page to visit while offline to prove
        that client-side navigation still works without a network.
      </p>
    </header>

    <section class="rounded-xl border border-surface-border bg-surface p-6 shadow-card">
      <h2 class="text-base font-semibold">How to test offline navigation</h2>
      <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-content-muted">
        <li>
          Build and preview the production app:
          <code class="rounded bg-surface-muted px-1.5 py-0.5 text-xs">npm run build</code> then
          <code class="rounded bg-surface-muted px-1.5 py-0.5 text-xs">npm run preview</code>.
        </li>
        <li>Load the app once so the service worker precaches the app shell.</li>
        <li>
          In DevTools, go to <strong class="text-content">Network</strong> and turn on
          <strong class="text-content">Offline</strong>.
        </li>
        <li>Navigate back to Home, then to this page. Both render from the cache.</li>
        <li>
          Reload while offline: the service worker answers with the cached shell instead of the
          browser error page, and
          <NuxtLink to="/offline" class="font-medium text-brand hover:underline">/offline</NuxtLink>
          stays reachable.
        </li>
      </ol>
    </section>

    <section class="rounded-xl border border-surface-border bg-surface p-6 shadow-card">
      <h2 class="text-base font-semibold">What is included</h2>
      <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-content-muted">
        <li>Web manifest with 192 px, 512 px and maskable icons.</li>
        <li>
          Workbox service worker with precaching, Google Fonts runtime caching and SPA fallback.
        </li>
        <li>Custom install banner backed by <code class="text-xs">beforeinstallprompt</code>.</li>
        <li>Update prompt driven by the reactive <code class="text-xs">$pwa</code> injection.</li>
        <li>Dismissal state persisted with Pinia and <code class="text-xs">localStorage</code>.</li>
      </ul>
    </section>

    <p class="text-sm">
      <NuxtLink to="/" class="font-medium text-brand hover:underline"
        >← Back to the dashboard</NuxtLink
      >
    </p>
  </article>
</template>
