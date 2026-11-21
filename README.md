# Nuxt PWA Starter

[![CI](https://github.com/V-CodeSmith/nuxt-pwa-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/V-CodeSmith/nuxt-pwa-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt&logoColor=white)](https://nuxt.com)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/explore/progressive-web-apps)

A production-ready **Nuxt 3 + PWA** starter. Clone it, run two commands, and you have an
installable, offline-capable, self-updating Progressive Web App — manifest, service worker,
caching strategies, install prompt and update prompt already wired up.

No half-finished TODOs, no "add your own service worker here". Everything the PWA needs is
configured and exercised by the demo UI.

## Use this template

1. Click **Use this template → Create a new repository** on GitHub (or run
   `npx degit V-CodeSmith/nuxt-pwa-starter my-app`).
2. Clone your new repository and install:

   ```bash
   cd my-app
   npm install
   npm run dev
   ```

3. Rename the app: update `name`/`short_name` in `nuxt.config.ts`, replace the icons in
   `public/icons/`, and set `THEME_COLOR` / `BACKGROUND_COLOR` (plus the CSS variables in
   `app/assets/css/main.css`) to your brand.
4. Delete the demo pages in `app/pages/` and start building.

## Features

- [x] **Installable PWA** — manifest with 192/512/maskable icons, standalone display, portrait orientation
- [x] **Offline-first service worker** — Workbox `generateSW`, precached app shell, `cleanupOutdatedCaches`
- [x] **Runtime caching** — Google Fonts (stylesheets + webfonts) with `CacheFirst`
- [x] **SPA navigation fallback** — `navigateFallback: '/'` with `/api/**` excluded
- [x] **Automatic updates** — `registerType: 'autoUpdate'` plus a dismissible "new version" toast
- [x] **Custom install prompt** — `beforeinstallprompt` intercepted, non-intrusive bottom banner
- [x] **Dismissal memory** — Pinia store persisted to `localStorage`, so prompts don't nag
- [x] **Status dashboard** — service worker / installable / offline-ready indicators on the home page
- [x] **Offline page** and a proper 404 catch-all route
- [x] **TypeScript strict** — typed composables, no `any`
- [x] **ESLint + Prettier** — flat config, Tailwind class sorting
- [x] **GitHub Actions CI** — lint, typecheck and build on every push/PR to `main`

## PWA API

Two composables and one store are the whole public surface:

```ts
// install banner
const { canInstall, isInstalled, showBanner, install, dismiss, simulateInstallPrompt } =
  usePwaInstall()

// service worker lifecycle
const {
  needRefresh,
  offlineReady,
  swActivated,
  showUpdatePrompt,
  updateServiceWorker,
  closePrompt,
  checkForUpdate,
} = usePwaUpdate()

// persisted dismissal state
const { installDismissed, updateDismissed, dismissInstall, dismissUpdate, resetDismissals } =
  usePwaStore()
```

- `canInstall` is _installability_ (not installed, browser offers a prompt). `showBanner` adds the
  dismissal state and is what `PwaInstallBanner` renders — keep that distinction if you restyle the UI.
- `install()` resolves to `'accepted' | 'dismissed' | 'unavailable'`.
- `closePrompt()` is this template's name for `$pwa.cancelPrompt()` (the v2 module API); it also
  persists the "Later" choice.
- `simulateInstallPrompt()` / `simulateUpdatePrompt()` only exist to preview the UIs on the demo
  page, since browsers fire those events only for a real, installable production build.

## Tech stack

| Layer       | Choice                                                                   | Notes                                                |
| ----------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| Framework   | [Nuxt 3](https://nuxt.com) (3.21.x)                                      | `app/` directory, compatibility version 4            |
| PWA         | [`@vite-pwa/nuxt`](https://vite-pwa-org.netlify.app/frameworks/nuxt) 2.x | Workbox under the hood, `autoUpdate`                 |
| UI          | Vue 3 `<script setup lang="ts">`                                         | Composition API only                                 |
| State       | [Pinia](https://pinia.vuejs.org)                                         | Setup Store syntax + `pinia-plugin-persistedstate`   |
| Styling     | [Tailwind CSS](https://tailwindcss.com) 3.4                              | via `@nuxtjs/tailwindcss`, CSS-variable theming      |
| Language    | TypeScript 5.9                                                           | `strict: true`, `noUncheckedIndexedAccess`           |
| Lint/format | ESLint 10 flat config + Prettier 3                                       | `@nuxt/eslint-config`, `prettier-plugin-tailwindcss` |
| CI          | GitHub Actions                                                           | Node 22, `npm ci`, lint, typecheck, build            |

## Project structure

```text
nuxt-pwa-starter/
├─ app/
│  ├─ app.vue                        # <NuxtLayout> + <NuxtPage>
│  ├─ assets/css/main.css            # Tailwind entry + brand CSS variables
│  ├─ components/
│  │  ├─ PwaInstallBanner.vue        # bottom install banner
│  │  └─ PwaUpdatePrompt.vue         # "new version available" toast
│  ├─ composables/
│  │  ├─ usePwaInstall.ts            # canInstall / install() / dismiss()
│  │  └─ usePwaUpdate.ts             # needRefresh / offlineReady / update()
│  ├─ layouts/default.vue            # mounts both PWA prompts
│  ├─ pages/
│  │  ├─ index.vue                   # status dashboard + prompt test buttons
│  │  ├─ about.vue                   # second route for offline-navigation testing
│  │  ├─ offline.vue                 # offline fallback page
│  │  └─ [...slug].vue               # custom 404
│  ├─ plugins/pinia-persist.client.ts
│  └─ stores/pwa.ts                  # install/update dismissal state (persisted)
├─ public/
│  ├─ favicon.svg
│  └─ icons/                          # icon-192x192, icon-512x512, maskable, apple-touch
│     └─ README.md
├─ .github/workflows/ci.yml
├─ .nvmrc                             # Node 22
├─ eslint.config.mjs
├─ .prettierrc
├─ nuxt.config.ts                     # modules + full `pwa` block
├─ tailwind.config.ts
├─ tsconfig.json
└─ LICENSE
```

Generated at build time (git-ignored): `.output/`, `.nuxt/`, `public/sw.js`,
`public/workbox-*.js`, `public/manifest.webmanifest`.

## Getting started

Requirements: **Node 22.12+** (`nvm use` picks up `.nvmrc`) and npm 10+.

Node 20 is not supported: the PWA toolchain imports `findPackageJSON` from `node:module`,
which only exists from Node 22.12 onward, so `nuxt prepare` fails during `npm install`.

```bash
# install dependencies (runs `nuxt prepare` for types)
npm install

# start the dev server → http://localhost:3000
npm run dev

# production build
npm run build

# serve the production build → http://localhost:3000
npm run preview
```

Other scripts:

| Script              | Description                         |
| ------------------- | ----------------------------------- |
| `npm run lint`      | ESLint (includes Prettier rule)     |
| `npm run lint:fix`  | ESLint with `--fix`                 |
| `npm run typecheck` | `nuxt typecheck` (vue-tsc)          |
| `npm run format`    | Prettier write                      |
| `npm run generate`  | Static generation (`nuxt generate`) |

## How to test the PWA locally

**The service worker is intentionally disabled on the dev server.** Vite serves unbundled
ES modules, HMR rewrites chunks on every save, and a Workbox precache would either cache
stale dev code or thrash constantly. `devOptions.enabled` is therefore `false`, so
`beforeinstallprompt` never fires and the install banner never appears in `npm run dev`.
That is expected, not a bug.

Test the real thing with the production build:

```bash
npm run build
npm run preview
```

Then, in Chrome/Edge at `http://localhost:3000`:

1. **DevTools → Application → Manifest** — name, icons (all three sizes load), `standalone`,
   `start_url`, `scope`, `theme_color`.
2. **DevTools → Application → Service Workers** — `sw.js` is `activated and is running`.
   Check **Update on reload** while iterating; uncheck it to test real update flows.
3. **Installability** — the install icon appears in the address bar, and the in-app banner
   appears after a few seconds. If you dismiss it, the dismissal persists across reloads
   (`localStorage`).
4. **Offline** — DevTools → Network → **Offline**, then reload `/` and navigate to `/about`.
   Both still render. Visiting a page that was never cached falls back to the app shell.
5. **Updates** — rebuild (`npm run build`), keep the old `preview` tab open, reload the tab.
   The update toast appears; **Update** activates the new service worker and reloads.

> `localhost` is treated as a secure context, so the service worker works there without HTTPS.
> On a LAN IP or a deployed domain you need HTTPS.

## Customizing the manifest

Everything lives in the `pwa.manifest` object of `nuxt.config.ts`:

```ts
const THEME_COLOR = '#4f46e5'
const BACKGROUND_COLOR = '#0f172a'

manifest: {
  name: 'Nuxt PWA Starter',      // full name, shown on the splash screen
  short_name: 'PWA Starter',     // ≤ 12 chars, shown under the home-screen icon
  description: '...',
  theme_color: THEME_COLOR,      // browser UI / status bar colour
  background_color: BACKGROUND_COLOR, // splash screen background
  display: 'standalone',
  orientation: 'portrait',
  start_url: '/',
  scope: '/',
  icons: [ /* 192, 512, maskable 512 */ ],
}
```

**Icons:** replace the files in `public/icons/` (see `public/icons/README.md` for the exact
sizes and the maskable safe zone). Keep the file names, or update `manifest.icons`; if you
rename them, update the `rel="apple-touch-icon"` link in `app.head` as well.

**Colours:** change `THEME_COLOR` / `BACKGROUND_COLOR` in `nuxt.config.ts` _and_ the
`--color-*` custom properties in `app/assets/css/main.css`. The manifest uses the constants,
Tailwind uses the CSS variables (through `tailwind.config.ts`), so both must match.
`theme_color` is also injected into the `<meta name="theme-color">` tag from the same constant.

**Registration in route rules:** `registerWebManifestInRouteRules: true` makes the module add
a Nitro route rule for the web manifest, so hosts that only serve prerendered/Nitro routes
(SSR deployments, edge presets) return the manifest with the right `Content-Type` instead of a 404. It is safe to leave enabled for static and SSR output.

## Customizing caching

Caching is configured in the `pwa.generateSW` object (Workbox `generateSW` options; the key
was renamed from `workbox` in `@vite-pwa/nuxt` v2 — the old key still works but is deprecated):

```ts
generateSW: {
  globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'], // precache
  navigateFallback: '/',                 // SPA shell for offline navigation
  navigateFallbackDenylist: [/^\/api\//], // never serve HTML for API calls
  cleanupOutdatedCaches: true,
  runtimeCaching: [ /* CacheFirst for Google Fonts */ ],
}
```

- **Precache more/less:** extend `globPatterns` (e.g. add `webp`, `mp4`). Anything under the
  size limit is downloaded at install time, so keep the app shell small.
- **Big files:** raise `maximumFileSizeToCacheInBytes` if a legit asset is skipped.
- **API calls:** use `NetworkFirst` (or `StaleWhileRevalidate`) `runtimeCaching` entries for
  your API origin; they are excluded from `navigateFallback` on purpose.
- **Navigation fallback page:** point `navigateFallback` at `/offline` if you prefer a dedicated
  offline document over the shell (the demo uses `/` because every route is prerendered).
- **Custom/service worker strategies:** switch `pwa.strategy` to `'injectManifest'` and write
  `sw.ts`; the demo code keeps with `generateSW` because it needs no custom service worker code.

## Architecture decisions

### Why `@vite-pwa/nuxt` and not `@nuxtjs/pwa`

`@nuxtjs/pwa` is archived and Nuxt 2 only — it does not work with Nuxt 3's Nitro build output
or Vite. `@vite-pwa/nuxt` is the maintained Nuxt 3 integration of `vite-plugin-pwa`: it
generates the manifest and service worker with Workbox, injects the registration script,
exposes the reactive `$pwa` runtime state (`needRefresh`, `offlineReady`, `updateServiceWorker`,
`cancelPrompt`) and supports `autoUpdate`. It requires Nuxt 3.9+ / Vite 5+ for the v0.4+ line;
this template runs `@vite-pwa/nuxt` 2.x on Nuxt 3.21.

### Why `autoUpdate` instead of `prompt`

With `registerType: 'prompt'` the new service worker waits until _every_ tab calls
`skipWaiting`, which means users can sit on a stale build indefinitely and you have to police
several open tabs. `autoUpdate` installs and activates the new worker in the background, so the
next navigation is already the new version. The trade-off — a tab may be running older
JavaScript than the active service worker — is handled by still exposing `needRefresh`: the
`PwaUpdatePrompt` offers an explicit reload, which is the only moment a page swap is safe.
This combination gives you automatic updates without yanking the page from under the user.

### Why `beforeinstallprompt` is intercepted

Browsers only fire `beforeinstallprompt` once their installability criteria are met, and the
native dialog appears — at best — as a small icon in the address bar, which most users never
notice. `client.installPrompt: true` tells the module to capture the event instead of letting
the browser act on it, and `usePwaInstall()` keeps the deferred event so _your_ UI can decide
when to ask. That produces a contextual, dismissible prompt (with the dismissal remembered in
`localStorage`) rather than an ignored browser affordance. The banner never appears in an
already-installed app and never appears at all in browsers that don't support the event (iOS
Safari), so the UI degrades quietly instead of throwing.

## Deployment

`npm run build` produces a Nitro server bundle in `.output/` (`node .output/server/index.mjs`)
that any Node host can run; `npm run generate` produces a fully static `dist/` deployable to any
CDN or static host. The service worker and manifest are emitted into the public output in both
cases, and `navigateFallback: '/'` keeps SPA routing working offline.

> Service workers require HTTPS (localhost excepted). Make sure your host serves
> `/sw.js` from the root scope and does not cache it for long.

## License

[MIT](./LICENSE)
