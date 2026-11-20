import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import type { ComputedRef } from 'vue'
import { useState, useNuxtApp } from '#imports'
import { usePwaStore } from '~/stores/pwa'

/**
 * Chrome's non-standard install event. It is not part of lib.dom, so the shape
 * it actually exposes is declared here instead of falling back to `any`.
 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[]
  readonly userChoice: Promise<InstallChoice>
  prompt: () => Promise<void>
}

export interface InstallChoice {
  outcome: 'accepted' | 'dismissed'
  platform: string
}

/** Result of an `install()` call. */
export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable'

export interface UsePwaInstallReturn {
  /** The browser currently offers a native install prompt and the app is not installed. */
  canInstall: ComputedRef<boolean>
  /** The app is running as an installed PWA. */
  isInstalled: ComputedRef<boolean>
  /** Nothing to show: not installable, already installed, or dismissed before. */
  showBanner: ComputedRef<boolean>
  /** Triggers the native install dialog. */
  install: () => Promise<InstallOutcome>
  /** Hides the banner for good (persisted in `localStorage`). */
  dismiss: () => void
  /** Dev helper: force the banner visible to preview its UI. */
  simulateInstallPrompt: () => void
}

/**
 * Install-prompt state.
 *
 * `@vite-pwa/nuxt` already intercepts `beforeinstallprompt` when
 * `pwa.client.installPrompt` is enabled and exposes the deferred event through
 * `$pwa` (`showInstallPrompt`, `install()`, `isPWAInstalled`). This composable
 * prefers that path and falls back to its own `beforeinstallprompt` listener
 * when the module injection is unavailable (e.g. dev server, where the service
 * worker — and therefore installability — is disabled on purpose).
 */
export function usePwaInstall(): UsePwaInstallReturn {
  const nuxtApp = useNuxtApp()
  const store = usePwaStore()
  const pwa = nuxtApp.$pwa

  const deferredPrompt = shallowRef<BeforeInstallPromptEvent | null>(null)
  const appInstalled = shallowRef(false)
  const simulated = useState<boolean>('pwa:simulate-install', () => false)

  const isInstalled = computed(() => pwa?.isPWAInstalled === true || appInstalled.value)

  const canInstall = computed(
    () => !isInstalled.value && (pwa?.showInstallPrompt === true || deferredPrompt.value !== null),
  )

  const showBanner = computed(
    () => !store.installDismissed && !isInstalled.value && (canInstall.value || simulated.value),
  )

  function handleBeforeInstallPrompt(event: Event): void {
    // Prevent the mini-infobar and keep the event for `install()`.
    event.preventDefault()
    deferredPrompt.value = event as BeforeInstallPromptEvent
  }

  function handleAppInstalled(): void {
    appInstalled.value = true
    deferredPrompt.value = null
  }

  async function install(): Promise<InstallOutcome> {
    if (isInstalled.value || store.installDismissed) {
      return 'unavailable'
    }

    // Preferred path: let @vite-pwa/nuxt prompt with its own deferred event.
    if (pwa?.install && pwa.showInstallPrompt) {
      const choice = await pwa.install()
      deferredPrompt.value = null
      if (!choice) {
        return 'unavailable'
      }
      return choice.outcome === 'accepted' ? 'accepted' : 'dismissed'
    }

    // Fallback: our own captured event.
    const event = deferredPrompt.value
    if (!event) {
      return 'unavailable'
    }

    deferredPrompt.value = null
    await event.prompt()
    const choice = await event.userChoice
    return choice.outcome === 'accepted' ? 'accepted' : 'dismissed'
  }

  function dismiss(): void {
    simulated.value = false
    store.dismissInstall()
  }

  function simulateInstallPrompt(): void {
    simulated.value = !simulated.value
  }

  if (import.meta.client) {
    onMounted(() => {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.addEventListener('appinstalled', handleAppInstalled)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    })
  }

  return { canInstall, isInstalled, showBanner, install, dismiss, simulateInstallPrompt }
}
