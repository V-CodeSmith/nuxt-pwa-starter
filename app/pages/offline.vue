<script setup lang="ts">
useSeoMeta({
  title: 'Offline',
  description: 'You are offline. The app shell is still available from the service worker cache.',
})

function retry(): void {
  window.location.reload()
}
</script>

<template>
  <div class="flex flex-col items-center py-10 text-center">
    <span class="bg-brand/10 flex h-14 w-14 items-center justify-center rounded-full">
      <svg class="h-7 w-7 text-brand" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a9 9 0 0 1 4.2-2.3M12 20h.01M15.5 10.5A9 9 0 0 0 12 9"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <h1 class="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">You're offline</h1>

    <p class="mt-3 max-w-md text-sm leading-relaxed text-content-muted">
      This page was not cached and the network is unavailable. Everything that <em>is</em> cached —
      the app shell and the pages you have already visited — still works. Reconnect and try again to
      load what you were looking for.
    </p>

    <div class="mt-7 flex flex-wrap justify-center gap-3">
      <button
        type="button"
        class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-emphasis"
        @click="retry"
      >
        Try again
      </button>
      <NuxtLink
        to="/"
        class="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium transition hover:bg-surface-muted"
      >
        Go to the home page
      </NuxtLink>
    </div>
  </div>
</template>
