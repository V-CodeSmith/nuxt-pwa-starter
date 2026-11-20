<script setup lang="ts">
import { ref } from 'vue'
import { usePwaInstall } from '~/composables/usePwaInstall'

const { showBanner, install, dismiss } = usePwaInstall()
const isInstalling = ref(false)

async function handleInstall(): Promise<void> {
  isInstalling.value = true
  try {
    await install()
  } finally {
    isInstalling.value = false
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-6 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-6 opacity-0"
  >
    <div
      v-if="showBanner"
      class="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-xl p-3 sm:bottom-4 sm:px-4"
      role="dialog"
      aria-live="polite"
      aria-label="Install this app"
    >
      <div
        class="flex flex-wrap items-center gap-3 rounded-xl border border-surface-border bg-surface p-4 shadow-card"
      >
        <img
          src="/icons/icon-192x192.png"
          alt=""
          width="40"
          height="40"
          class="h-10 w-10 shrink-0 rounded-lg"
        />

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold">Install this app</p>
          <p class="text-xs text-content-muted">
            Add it to your home screen for faster, offline access.
          </p>
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-sm font-medium text-content-muted transition hover:bg-surface-muted hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            @click="dismiss"
          >
            Not now
          </button>
          <button
            type="button"
            :disabled="isInstalling"
            class="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-emphasis focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
            @click="handleInstall"
          >
            {{ isInstalling ? 'Opening…' : 'Install' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
