import type { Pinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/**
 * Registers `pinia-plugin-persistedstate` on the Pinia instance created by
 * `@pinia/nuxt`. Client-only: `localStorage` does not exist on the server.
 */
export default defineNuxtPlugin((nuxtApp) => {
  // `@pinia/nuxt` injects `$pinia`; its runtime augmentation is not part of the
  // package's public types, so narrow it to Pinia's own type here.
  const pinia = nuxtApp.$pinia as Pinia
  pinia.use(piniaPluginPersistedstate)
})
