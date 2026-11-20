<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePwaInstall } from '~/composables/usePwaInstall'
import { usePwaUpdate } from '~/composables/usePwaUpdate'
import { usePwaStore } from '~/stores/pwa'

useSeoMeta({
  title: 'Home',
  description:
    'Status dashboard for the Nuxt 3 PWA starter: service worker, installability and offline readiness.',
})

const { canInstall, isInstalled, showBanner, install, simulateInstallPrompt } = usePwaInstall()
const {
  offlineReady,
  swActivated,
  registrationError,
  simulateUpdatePrompt,
  checkForUpdate,
  needRefresh,
} = usePwaUpdate()
const { resetDismissals } = usePwaStore()

const mounted = ref(false)
const installOutcome = ref<string | null>(null)
const updateChecked = ref<string | null>(null)

onMounted(() => {
  mounted.value = true
})

interface StatusRow {
  readonly label: string
  readonly value: string
  readonly ok: boolean
}

const statuses = computed<StatusRow[]>(() => {
  if (!mounted.value) {
    return [
      { label: 'Service Worker', value: 'Checking…', ok: false },
      { label: 'Installable', value: 'Checking…', ok: false },
      { label: 'Offline Ready', value: 'Checking…', ok: false },
    ]
  }

  return [
    {
      label: 'Service Worker',
      value: registrationError.value ? 'Failed' : swActivated.value ? 'Active' : 'Inactive',
      ok: swActivated.value,
    },
    {
      label: 'Installable',
      value: isInstalled.value ? 'Installed' : canInstall.value ? 'Yes' : 'No',
      ok: canInstall.value || isInstalled.value,
    },
    {
      label: 'Offline Ready',
      value: offlineReady.value ? 'Yes' : 'No',
      ok: offlineReady.value,
    },
  ]
})

async function handleInstall(): Promise<void> {
  const outcome = await install()
  installOutcome.value =
    outcome === 'accepted'
      ? 'Install dialog accepted.'
      : outcome === 'dismissed'
        ? 'Install dialog dismissed.'
        : 'No install prompt available right now.'
}

async function handleCheckForUpdate(): Promise<void> {
  const found = await checkForUpdate()
  updateChecked.value = found
    ? 'Asked the browser to check sw.js — watch the update toast.'
    : 'No service worker registration found (expected on the dev server).'
}
</script>

<template>
  <div class="space-y-8">
    <section class="rounded-xl border border-surface-border bg-surface p-6 shadow-card sm:p-8">
      <p
        class="bg-brand/10 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-brand"
      >
        <span class="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
        Progressive Web App
      </p>

      <h1 class="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">This is a PWA.</h1>

      <p class="mt-3 max-w-2xl text-sm leading-relaxed text-content-muted">
        Installable, offline-capable and self-updating — the manifest, Workbox service worker,
        install prompt and update flow are already wired up. Build with
        <code class="rounded bg-surface-muted px-1.5 py-0.5 text-xs">npm run build</code> and serve
        with <code class="rounded bg-surface-muted px-1.5 py-0.5 text-xs">npm run preview</code> to
        see them in action; the dev server intentionally runs without a service worker.
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/about"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-emphasis"
        >
          About this starter
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium transition hover:bg-surface-muted"
          @click="resetDismissals"
        >
          Reset dismissed prompts
        </button>
      </div>
    </section>

    <section aria-labelledby="status-heading">
      <h2
        id="status-heading"
        class="text-sm font-semibold uppercase tracking-wide text-content-muted"
      >
        PWA status
      </h2>

      <ul class="mt-3 grid gap-3 sm:grid-cols-3">
        <li
          v-for="status in statuses"
          :key="status.label"
          class="rounded-xl border border-surface-border bg-surface p-4 shadow-card"
        >
          <p class="text-xs font-medium uppercase tracking-wide text-content-muted">
            {{ status.label }}
          </p>
          <p class="mt-2 flex items-center gap-2 text-lg font-semibold">
            <span
              class="h-2.5 w-2.5 rounded-full"
              :class="status.ok ? 'bg-emerald-500' : 'bg-slate-400'"
              aria-hidden="true"
            />
            {{ status.value }}
          </p>
        </li>
      </ul>
    </section>

    <section aria-labelledby="dev-heading">
      <h2 id="dev-heading" class="text-sm font-semibold uppercase tracking-wide text-content-muted">
        Developer tools
      </h2>

      <div
        class="mt-3 space-y-4 rounded-xl border border-surface-border bg-surface p-5 shadow-card"
      >
        <p class="text-xs leading-relaxed text-content-muted">
          The install banner and update toast only appear when the browser fires their events, which
          needs the production build. Use the buttons below to preview both UIs at any time.
        </p>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            :disabled="!canInstall"
            class="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-emphasis disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleInstall"
          >
            Trigger install prompt
          </button>
          <button
            type="button"
            class="rounded-lg border border-surface-border px-3 py-2 text-sm font-medium transition hover:bg-surface-muted"
            @click="simulateInstallPrompt"
          >
            {{ showBanner ? 'Hide' : 'Show' }} install banner
          </button>
          <button
            type="button"
            class="rounded-lg border border-surface-border px-3 py-2 text-sm font-medium transition hover:bg-surface-muted"
            @click="simulateUpdatePrompt"
          >
            {{ needRefresh ? 'Hide' : 'Show' }} update prompt
          </button>
          <button
            type="button"
            class="rounded-lg border border-surface-border px-3 py-2 text-sm font-medium transition hover:bg-surface-muted"
            @click="handleCheckForUpdate"
          >
            Check for update
          </button>
        </div>

        <p v-if="installOutcome" class="text-xs text-content-muted">{{ installOutcome }}</p>
        <p v-if="updateChecked" class="text-xs text-content-muted">{{ updateChecked }}</p>
      </div>
    </section>
  </div>
</template>
