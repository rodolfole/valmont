# Valmont — winter cabin landing page

Modern, responsive Astro 7 site for a premium winter cabin rental. Stack: Astro 7 · Tailwind 4 · Preact · pnpm · sharp.

## Preview

```bash
NAPI_RS_FORCE_WASI=1 pnpm dev --host 127.0.0.1 --port 4321
```
Open http://127.0.0.1:4321/.

The `NAPI_RS_FORCE_WASI=1` env var makes Astro's compiler fall back to the WASM binding if the native binary can't load (e.g. on machines where Windows Defender Application Control blocks `.node` files). Drop it on machines where the native binding loads fine.

A standalone static fallback lives at `preview.html` — it mirrors the Astro output 1:1 (same copy, layout, tokens, working booking widget) and works in any browser without a build.

## Sections

Nav · Hero (real alpine-cabin photo, full-bleed, AVIF + WebP) · Intro (sleeps/sauna/fireplace/wifi + location meta) · Gallery (7 interior/exterior shots, horizontal scroll) · Testimonial (starfield) · Amenities (6) · Feature ("Warm wood. Cold outside.", great-room interior) · Testimonial 2 · Booking CTA (Preact date/guest widget) · Footer.

## Image strategy (max mobile optimization)

All photos live in `src/assets/images/` and are processed by Astro's `<Image>` / `getImage()` at request time using sharp.

**Hero** gets the full treatment:
- `<picture>` with AVIF first, WebP fallback, raw `<img>` as final fallback
- 5-step srcset: `640w · 960w · 1280w · 1600w · 1920w`
- `sizes="(max-width: 640px) 100vw, ..."` so mobile phones only download ~640px
- `fetchpriority="high"` + `<link rel="preload" as="image">` in `<head>` to start the LCP download in parallel with HTML
- AVIF quality 55, WebP quality 72 — mobile hero weighs ~26KB AVIF / ~30KB WebP at 640w

**Gallery cards** (below-fold) use WebP-only:
- 4-step srcset: `320w · 480w · 640w · 800w` (cards are 260-320px on desktop)
- `sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 320px"`
- `loading="lazy"` (except the first two cards to keep the initial scroll smooth)
- `decoding="async"` so the browser decodes off the main thread

**Feature image** uses the same WebP-only pattern at 5 widths (480/768/1024/1280/1600) with `loading="lazy"`.

To swap a photo: drop the new file in `src/assets/images/`, update the `import` at the top of the relevant component. No other config.

## Project structure

```
src/
├── assets/images/                 # processed by Astro at request time
├── components/
│   ├── Nav.astro
│   ├── Hero.astro                 # AVIF + WebP picture
│   ├── Intro.astro
│   ├── Gallery.astro              # 7 webp shots
│   ├── Story.astro
│   ├── Amenities.astro
│   ├── Feature.astro              # great-room interior
│   ├── Quote.astro
│   ├── BookingCTA.astro
│   ├── BookingWidget.tsx          ← Preact island (hydrates with client:load)
│   └── Footer.astro
├── layouts/Layout.astro           # preload hint for hero LCP
├── pages/index.astro
└── styles/global.css              ← Tailwind 4 @theme tokens
```

## Design tokens

All tokens live in `src/styles/global.css` under `@theme` — `--color-ink-*`, `--color-frost-*`, `--color-snow`, `--color-ember`, `--color-glacier-*`, plus `--font-display` (Fraunces) and `--font-sans` (Inter). Edit there to retune the whole site.

## Asset source

The original 4K webp pack (`public/images/4k/`) and optimized webp pack (`public/images/avif/`) are kept alongside the project for archival. The site itself only reads from `src/assets/images/`.
