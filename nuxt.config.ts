import type { ModuleOptions } from '@vite-pwa/nuxt'

/**
 * Brand colours are declared once and reused by the PWA manifest,
 * the Nuxt `app.head` theme-color meta tag and `tailwind.config.ts`.
 */
const THEME_COLOR = '#4f46e5'
const BACKGROUND_COLOR = '#0f172a'

const pwa = {
  /**
   * 'autoUpdate' installs a waiting service worker immediately after it is
   * fetched, so users are never stuck on an old build. The UI layer
   * (`usePwaUpdate`) still surfaces the "new version available" prompt from
   * `$pwa.needRefresh` so users can choose when to reload.
   */
  registerType: 'autoUpdate',

  manifest: {
    name: 'Nuxt PWA Starter',
    short_name: 'PWA Starter',
    description:
      'A production-ready Nuxt 3 starter with an installable, offline-capable PWA out of the box.',
    lang: 'en',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: THEME_COLOR,
    background_color: BACKGROUND_COLOR,
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: 'icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },

  /**
   * Workbox `generateSW` options. In @vite-pwa/nuxt v2 this replaced the
   * deprecated `workbox` key (same object shape).
   */
  generateSW: {
    // Precache the whole app shell: JS, CSS, HTML, images, fonts.
    globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
    // SPA navigation falls back to the app shell so client routing works offline.
    navigateFallback: '/',
    // Never answer API calls with the HTML shell.
    navigateFallbackDenylist: [/^\/api\//],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-stylesheets',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-webfonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },

  client: {
    // Intercept `beforeinstallprompt` so `usePwaInstall()` can trigger the
    // native install dialog from our own UI.
    installPrompt: true,
    // Check for a new service worker at most once per hour.
    periodicSyncForUpdates: 3600,
  },

  // Emits the web manifest from route rules so static/edge hosting serves it
  // with the correct content type even when the manifest file is not copied.
  registerWebManifestInRouteRules: true,

  // The service worker is intentionally disabled on the dev server: Vite serves
  // unbundled modules and a cached dev shell hides your changes. Use
  // `npm run build && npm run preview` to exercise the PWA.
  devOptions: {
    enabled: false,
    type: 'module',
    suppressWarnings: true,
  },
} satisfies Partial<ModuleOptions>

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  modules: ['@vite-pwa/nuxt', '@pinia/nuxt', '@nuxtjs/tailwindcss'],

  // @nuxtjs/tailwindcss injects this file as the Tailwind entry point, so it
  // must not also be listed in `css` or the utilities would be emitted twice.
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Prerender the app shell and the demo routes so the service worker has real
  // HTML documents to precache: an offline reload is served from the cache
  // instead of falling through to the browser's network error page.
  nitro: {
    prerender: {
      routes: ['/', '/about', '/offline'],
      crawlLinks: false,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Nuxt PWA Starter',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: THEME_COLOR },
        {
          name: 'description',
          content:
            'A production-ready Nuxt 3 starter with an installable, offline-capable PWA out of the box.',
        },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'PWA Starter' },
      ],
      link: [
        // @vite-pwa/nuxt writes the manifest and serves it via a route rule, but
        // an SSR build has no index.html for it to inject into: link it here.
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png', sizes: '180x180' },
      ],
    },
  },

  pwa,
})
