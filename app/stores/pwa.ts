import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Persistent PWA UI state.
 *
 * Only dismissal flags live here: whether the install banner and the update
 * prompt were dismissed by the user. Both are persisted to `localStorage` by
 * `pinia-plugin-persistedstate` (registered in `plugins/pinia-persist.client.ts`)
 * so the prompts never nag on later visits.
 */
export const usePwaStore = defineStore(
  'pwa',
  () => {
    /** The user chose "Not now" on the install banner. */
    const installDismissed = ref(false)

    /** The user chose "Later" on the "new version available" prompt. */
    const updateDismissed = ref(false)

    function dismissInstall(): void {
      installDismissed.value = true
    }

    function dismissUpdate(): void {
      updateDismissed.value = true
    }

    /** Clears both flags so the prompts can appear again (used while developing). */
    function resetDismissals(): void {
      installDismissed.value = false
      updateDismissed.value = false
    }

    return {
      installDismissed,
      updateDismissed,
      dismissInstall,
      dismissUpdate,
      resetDismissals,
    }
  },
  {
    persist: {
      key: 'nuxt-pwa-starter:pwa',
      pick: ['installDismissed', 'updateDismissed'],
    },
  },
)
