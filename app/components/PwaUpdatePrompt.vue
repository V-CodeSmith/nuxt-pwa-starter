<script setup lang="ts">
import { ref } from 'vue'
import { usePwaUpdate } from '~/composables/usePwaUpdate'

const { showUpdatePrompt, updateServiceWorker, closePrompt } = usePwaUpdate()
const isUpdating = ref(false)

async function handleUpdate(): Promise<void> {
  isUpdating.value = true
  try {
    await updateServiceWorker(true)
  } finally {
    isUpdating.value = false
  }
}

async function handleLater(): Promise<void> {
  await closePrompt()
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="-translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-4 opacity-0"
  >
    <div
      v-if="showUpdatePrompt"
      class="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-xl p-3 sm:px-4"
      role="status"
      aria-live="polite"
    >
      <div
        class="flex flex-wrap items-center gap-3 rounded-xl border border-surface-border bg-surface p-4 shadow-card"
      >
        <span class="bg-brand/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
          <svg
            class="h-5 w-5 text-brand"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5h-2.25v-3.75Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>

        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold">A new version is available</p>
          <p class="text-xs text-content-muted">Reload to get the latest features and fixes.</p>
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-sm font-medium text-content-muted transition hover:bg-surface-muted hover:text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            @click="handleLater"
          >
            Later
          </button>
          <button
            type="button"
            :disabled="isUpdating"
            class="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-emphasis focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
            @click="handleUpdate"
          >
            {{ isUpdating ? 'Updating…' : 'Update' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
