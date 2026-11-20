import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useState, useNuxtApp } from '#imports'
import { usePwaStore } from '~/stores/pwa'

export interface UsePwaUpdateReturn {
  /** A new service worker is installed and waiting; a reload applies it. */
  needRefresh: ComputedRef<boolean>
  /** The precache finished on the first visit: the app works offline now. */
  offlineReady: ComputedRef<boolean>
  /** The service worker reached the `activated` state. */
  swActivated: ComputedRef<boolean>
  /** Registering the service worker failed. */
  registrationError: ComputedRef<boolean>
  /** The update toast should be visible. */
  showUpdatePrompt: ComputedRef<boolean>
  /** Activates the waiting service worker and optionally reloads the page. */
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  /** Hides the prompt for this version (persisted in `localStorage`). */
  closePrompt: () => Promise<void>
  /** Asks the browser to check `sw.js` for a new version right now. */
  checkForUpdate: () => Promise<boolean>
  /** Dev helper: force the update toast visible to preview its UI. */
  simulateUpdatePrompt: () => void
}

/**
 * Service-worker lifecycle state, read from the `$pwa` injection that
 * `@vite-pwa/nuxt` provides through its client plugin.
 *
 * Note: in `@vite-pwa/nuxt` v2 the "dismiss" helper is named `cancelPrompt`
 * (`closePrompt()` here, matching the template API) and `needRefresh` /
 * `offlineReady` are reactive on `$pwa`.
 */
export function usePwaUpdate(): UsePwaUpdateReturn {
  const nuxtApp = useNuxtApp()
  const pwa = nuxtApp.$pwa
  const store = usePwaStore()
  const simulated = useState<boolean>('pwa:simulate-update', () => false)

  const needRefresh = computed(() => pwa?.needRefresh === true || simulated.value)
  const offlineReady = computed(() => pwa?.offlineReady === true)
  const swActivated = computed(() => pwa?.swActivated === true)
  const registrationError = computed(() => pwa?.registrationError === true)

  const showUpdatePrompt = computed(() => needRefresh.value && !store.updateDismissed)

  async function updateServiceWorker(reloadPage = true): Promise<void> {
    simulated.value = false

    if (pwa?.updateServiceWorker) {
      await pwa.updateServiceWorker(reloadPage)
      return
    }

    // No service worker support (or dev server): just reload if asked.
    if (reloadPage && import.meta.client) {
      window.location.reload()
    }
  }

  async function closePrompt(): Promise<void> {
    simulated.value = false
    store.dismissUpdate()
    await pwa?.cancelPrompt()
  }

  async function checkForUpdate(): Promise<boolean> {
    if (!import.meta.client || !('serviceWorker' in navigator)) {
      return false
    }

    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      return false
    }

    try {
      await registration.update()
      return true
    } catch {
      return false
    }
  }

  function simulateUpdatePrompt(): void {
    simulated.value = !simulated.value
  }

  return {
    needRefresh,
    offlineReady,
    swActivated,
    registrationError,
    showUpdatePrompt,
    updateServiceWorker,
    closePrompt,
    checkForUpdate,
    simulateUpdatePrompt,
  }
}
