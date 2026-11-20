# PWA icons

The files in this folder are **placeholder icons** generated for the starter so the
app is installable the moment you clone it. Replace them with your own artwork
before shipping.

| File                        | Size    | `purpose`  | Used by                                              |
| --------------------------- | ------- | ---------- | ---------------------------------------------------- |
| `icon-192x192.png`          | 192×192 | `any`      | Android home screen, manifest splash icons           |
| `icon-512x512.png`          | 512×512 | `any`      | Manifest largest icon, install prompt, splash screen |
| `maskable-icon-512x512.png` | 512×512 | `maskable` | Android adaptive icons                               |
| `apple-touch-icon.png`      | 180×180 | —          | iOS home screen (`rel="apple-touch-icon"`)           |
| `favicon.svg`               | any     | —          | Browser tab (in `public/favicon.svg`)                |

## Requirements

- **Format:** PNG, 8-bit, no transparency for `icon-192x192.png`,
  `icon-512x512.png` and `maskable-icon-512x512.png` (a transparent background
  renders as black on some Android launchers).
- **Maskable safe zone:** keep all meaningful artwork inside the central
  **80% circle**. Android crops maskable icons to a circle, squircle or rounded
  square depending on the launcher, so anything near the edges can be clipped.
- **Recommended maskable canvas:** pad your logo to ~60% of the icon width,
  centred, on a solid `theme_color` background.

## Replacing the icons

1. Export your artwork at 192×192, 512×512 and 512×512 (maskable) plus a
   180×180 `apple-touch-icon.png`.
2. Overwrite the files in this folder, keeping the file names.
3. If you rename files, update `pwa.manifest.icons` in `nuxt.config.ts` and the
   `rel="apple-touch-icon"` link in `app.head`.

You can also generate all sizes from a single 512×512 source with the
`@vite-pwa/assets-generator` CLI:

```bash
npx @vite-pwa/assets-generator --preset minimal-2023 public/logo.svg
```

## Placeholder design

The placeholders are an indigo (`#4f46e5`) background with a white ring — simple,
high contrast, and safely inside the maskable safe zone. They are cosmetic only;
nothing in the app depends on their contents.
