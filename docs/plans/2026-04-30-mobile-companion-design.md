# Mobile Companion — Design Doc

**Date:** 2026-04-30
**Author:** Amirreza Roodsaz
**Defense:** 6. Mai 2026
**Status:** Spec — awaiting review

## 1 · Goal

Audience members who scan the deck's QR code on their phone or open it on a tablet should be able to **read along with the talk on their own device, at their own pace** — independent of where the presenter is in the live deck.

The current deck is unusable on phones (Reveal.js scales the 1920×1080 canvas to ~20 % on a phone screen, making text 3–4 px tall). The fix is a parallel, mobile-first reading view served from the same project.

## 2 · Non-goals

- The mobile companion is **not** a presenter device. The presenter still runs the laptop deck.
- It does **not** mirror the laptop's current slide. Audience browses freely.
- It does **not** include live demos, GSAP animations, or interactive D3 charts. Static representations only.
- It does **not** include speaker notes or the speaker view.
- Backup slides are **not** part of the audience companion (out of scope; can be added later if needed).

## 3 · User experience

### 3.1 Entry path

1. Audience scans the QR code on the laptop's title slide → opens `http://<host>:3000/`.
2. A small redirect snippet at the top of `index.html` checks `window.matchMedia('(max-width: 1024px)').matches`. The 1024 px threshold is wide enough to catch iPad portrait *and* landscape — both deserve the mobile reading view since the laptop deck is unreadable on either.
3. If true → redirect to `/mobile.html` (preserving any `?lang=` or `?theme=` query params).
4. If false → the existing Reveal.js deck loads as today.

Override flag: `?desktop=1` on the URL forces the laptop deck even on a small viewport (so the presenter can sanity-check on mobile during rehearsal). The receiver/speaker-view URL (`?receiver=...`) skips the redirect.

### 3.2 Reading experience

- One vertical scroll page from title → conclusion → Danke.
- Sticky horizontal **table-of-contents** (chips) below a thin top bar — tap to jump, current section highlighted via `IntersectionObserver`.
- Top bar: language toggle (DE/EN), theme toggle (auto/light/dark), "↑ nach oben" floating button after first scroll.
- Each slide renders as a **card** with: kicker (section name + slide number), headline, content, optional takeaway box.
- Generous typography for outdoor-ish reading (audience may be in dim auditorium glancing at a phone).
- Pinch-to-zoom is **not** disabled — natural mobile reading affordance.

### 3.3 Visual design

- Same design tokens as the desktop deck: `--bg-primary #0f0f1a`, `--bg-surface #1a1a2e`, `--accent #E2001A`, `--success #00C9A7`, `--font Inter`.
- Layout patterns: hero, list, two-column-stat, vehicle-cards, bullet-list, takeaway-box. Five reusable patterns max.
- Tablet breakpoint at ≥760 px: tighter padding, two-up stat cards. iPad portrait should feel comfortable, not just "phone scaled up".

## 4 · Architecture

### 4.1 Files added (new)

| Path | Purpose | Approx size |
|---|---|---|
| `mobile.html` | Mobile entry point. Loads `mobile.js` + `mobile.css`. Contains the static top bar + ToC shell + `<main>` mount node. | ~80 lines |
| `src/mobile.js` | Renders `MOBILE_SLIDES` into `<main>`, wires ToC scroll-spy, theme toggle, language toggle. No Reveal.js. | ~150 lines |
| `src/mobile-content.js` | Curated content array — single source of truth for the mobile view. Each entry is one mobile slide. | ~400 lines (data) |
| `src/styles/mobile.css` | Mobile-first stylesheet. Imports `variables.css` for tokens; everything else built fresh. | ~400 lines |

### 4.2 Files modified (minimal, surgical)

| Path | Change |
|---|---|
| `index.html` | Add a ~10-line `<script>` near the top of `<head>` that does the viewport-based redirect. Skipped if `?desktop=1`, `?receiver`, or already on `/mobile.html`. |
| `vite.config.js` | Add a second `rollupOptions.input` entry: `mobile: 'mobile.html'`. ~3 lines. |

### 4.3 Files NOT touched

All slide markup in `index.html`, all of `src/main.js`, all of `src/components/`, all existing stylesheets, all of `public/`, all phase-20 work, the QR hub, the speaker view, the PDF/PPTX exporters.

### 4.4 Build / dev flow

- `vite dev`: `mobile.html` is served at `http://localhost:3000/mobile.html` and hot-reloads independently of the main deck.
- `vite build`: produces both `dist/index.html` and `dist/mobile.html` with shared chunks for any common imports (none expected — the views don't share runtime).
- The QR code on the desktop title slide keeps pointing at the root URL `http://<host>:3000/`. The redirect handles routing — phones land on mobile, laptops stay on the deck.

## 5 · Content model (B-curated)

`src/mobile-content.js` exports a single `MOBILE_SLIDES` array. Each entry is a plain object — no class hierarchies.

```js
export const MOBILE_SLIDES = [
  {
    id: 'title',
    type: 'hero',
    kicker: { de: 'Masterarbeit Kolloquium', en: "Master's Thesis Colloquium" },
    headline: { de: 'Entwicklung reproduzierbarer Methoden …', en: 'Development of …' },
    subtitle: { de: '…', en: '…' },
    meta: {
      author: 'Amirreza Roodsaz',
      institution: 'Hochschule Bochum — Institut für Elektromobilität',
      advisors: [
        { de: 'Erste Prüferin: Prof. Dr.-Ing. Kerstin Siebert', en: '…' },
        { de: 'Zweiter Prüfer: Prof. Dr.-Ing. Michael Schugt', en: '…' },
      ],
      date: '6. Mai 2026',
    },
  },
  {
    id: 'motivation',
    type: 'standard',
    section: { de: 'Motivation', en: 'Motivation' },
    slideNumber: 3,
    headline: { de: '…', en: '…' },
    body: { de: '<p>…</p><ul><li>…</li></ul>', en: '<p>…</p>' },
    takeaway: { de: '…', en: '…' },
  },
  // … one entry per slide that should appear on mobile
];
```

### 5.1 Slide types

Five `type` values, each rendered by a small render function:

| `type` | Used for | Renders |
|---|---|---|
| `hero` | Title slide, Danke slide | Centered card, big headline, meta block |
| `standard` | Most content slides | Headline + HTML body + optional takeaway box |
| `stats` | Conclusion, key results | Headline + claim text + 2–4 stat cards |
| `vehicle-cards` | Vehicles slide | Headline + headline-metric + primary card + small cards |
| `list` | Roadmap, outlook | Headline + bullet/icon list |

Five types is the upper bound. If a slide doesn't fit, simplify the slide rather than adding a new type — audience-companion content should be plain.

### 5.2 Slides included in mobile companion (curated list)

| # | id | type | Source slide |
|---|---|---|---|
| 1 | `title` | hero | `slide-title` |
| 2 | `roadmap` | list | `slide-roadmap` |
| 3 | `motivation` | standard | `slide-motivation` |
| 4 | `gap-contributions` | standard | `slide-gap-contributions` (merged) |
| 5 | `soh-definitions` | standard | `slide-soh-definitions` |
| 6 | `aging` | standard | `slide-aging` |
| 7 | `vehicles` | vehicle-cards | `slide-vehicles` |
| 8 | `tools` | standard | `slide-tools` |
| 9 | `protocol` | standard | `slide-protocol` (Entladung + CC-CV-Laden — whether merged or two slides on the desktop deck, mobile shows one combined card) |
| 10 | `pipeline` | standard | `slide-pipeline` |
| 11 | `method-comparison` | stats | `slide-method-comparison` |
| 12 | `reproducibility` | stats | `slide-reproducibility` |
| 13 | `temperature` | stats | `slide-temperature` |
| 14 | `obd-vs-avl` | stats | `slide-obd-vs-avl` |
| 15 | `discussion` | standard | `slide-discussion` |
| 16 | `conclusion` | stats | `slide-conclusion` (Kernaussage) |
| 17 | `outlook` | list | `slide-outlook` |
| 18 | `thanks` | hero | `slide-thanks` (Danke) |

18 mobile slides. Backup slides, the live demo, and the flowchart gallery are intentionally omitted — they don't translate to a passive reading view.

### 5.3 Sync with desktop

When a desktop slide title or stat changes during rehearsal, the corresponding `mobile-content.js` entry must be updated by hand. This is a one-line edit per change. Acceptable cost given (a) defense in 6 days, (b) ~19 entries, (c) cleaner separation than runtime DOM scraping.

## 6 · Component design

### 6.1 `mobile.js` responsibilities

- On `DOMContentLoaded`:
  1. Read `lang` from URL/localStorage (default `de`).
  2. Read `theme` from URL/localStorage (default `auto` → respects `prefers-color-scheme`).
  3. Render top bar + ToC + `MOBILE_SLIDES` into `<main>`.
  4. Wire `IntersectionObserver` for ToC scroll-spy.
  5. Wire language + theme toggles. Both update DOM via class on `<body>` and persist to localStorage.
- No Reveal.js, no GSAP, no D3 — keeps the bundle tiny (~10 KB JS + 8 KB CSS gzipped).

### 6.2 `mobile.css` structure

- `@import 'styles/variables.css'` — shared tokens (theme palette).
- Top-level layout: `body { background; font; }`, `.nav-bar`, `.toc`, `main { max-width: 720px }`.
- Per-type rules: `.slide.hero`, `.slide.standard`, `.slide.stats`, `.slide.vehicle-cards`, `.slide.list`.
- Two breakpoints: phone (default), tablet (`min-width: 760px`).
- No animation framework — only short CSS transitions on hover/active.

### 6.3 Redirect snippet (added to `index.html`)

```html
<script>
  (function(){
    var qs = window.location.search;
    if (/[?&](desktop|receiver)\b/.test(qs)) return;
    if (window.location.pathname.endsWith('/mobile.html')) return;
    if (window.matchMedia('(max-width: 1024px)').matches) {
      window.location.replace('/mobile.html' + qs + window.location.hash);
    }
  })();
</script>
```

Inline in `<head>` so it runs before Reveal.js loads. Vanilla, ES5-safe. No build step needed.

## 7 · Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Tablets in landscape (1024×768) cross the 768 px breakpoint and get the desktop deck — which is unreadable on tablets too | Medium | Bump breakpoint to 1024 px, OR detect with `'ontouchstart' in window` as a secondary signal. **Decision: use 1024 px max-width for redirect** — better to over-route to mobile than leave tablets stranded. |
| Audience opens mobile, then laptop deck advances — they wonder "where is he now?" | Low | Out of scope for this deliverable. Could add optional sync via SSE later. |
| Desktop content drifts from mobile content over time | Medium | Curated list is small (19 entries) and the defense is in 6 days. Set a rehearsal-day reminder to do one final desktop→mobile diff. |
| Vite multi-entry config breaks dev server | Low | Pattern is documented in Vite docs; we'll verify on first run. Rollback: revert the 3-line config change. |
| `mobile.html` accidentally gets indexed by search engines | Low | Add `<meta name="robots" content="noindex">` to `mobile.html`. The deck is local-network only anyway. |

## 8 · Out of scope (explicit)

- Live sync between presenter slide and audience phone view
- Push notifications when presenter advances
- Comments/Q&A submission from phone
- Offline service-worker caching
- Accessibility audit beyond viewport meta + semantic HTML
- Charts as static SVGs (we'll show a single representative number per result slide instead)
- Backup slides on mobile

## 9 · Verification plan

Before merging to `main`:

1. **Desktop unchanged.** Open `index.html` on the laptop at 1920×1080 — slideshow behaves exactly as before. Spot-check 5 slides including the title, vehicles, conclusion, Danke, and one backup.
2. **iPhone real-device test.** Scan QR from laptop title slide, land on mobile view, scroll all 18 cards, tap ToC chips, toggle DE/EN, toggle theme. No layout breaks on iPhone Safari.
3. **iPad portrait test.** Same flow on iPad. Verify the tablet breakpoint kicks in (two-up stat cards).
4. **iPad landscape test.** Same on iPad landscape — should still get the mobile view per the 1024 px breakpoint decision.
5. **Override flag.** `http://localhost:3000/?desktop=1` on phone forces the desktop deck — useful for debugging.
6. **Receiver view.** Speaker view at `?receiver=1` is unaffected by the redirect.
7. **Offline.** Disconnect Mac from internet, reload — both views still work (no CDN dependencies).
8. **Build.** `npm run build` produces both `dist/index.html` and `dist/mobile.html`. `npm run preview` serves both correctly.
9. **PDF/PPTX export.** Trigger from desktop deck — still works (it's tied to the main deck only).

Defense readiness gate: all 9 checks pass.

## 10 · Implementation sequence (high-level — full plan in writing-plans skill)

1. Create `mobile.html` shell + `vite.config.js` second entry. Verify dev server serves it.
2. Create `mobile.css` with five layout patterns. Mock with placeholder content.
3. Create `mobile-content.js` with all 19 entries (data only).
4. Create `mobile.js` rendering logic + ToC scroll-spy + toggles.
5. Add redirect snippet to `index.html`.
6. Iterate on visual polish — feedback round on real iPhone + iPad.
7. Run verification plan, merge to main.

Estimated effort: 2.5–3 days of focused work, fits in the 6-day window before defense.

## 11 · Decisions locked

- **Method:** B (separate route, no Reveal.js on phones)
- **Content source:** B-curated (`mobile-content.js`)
- **Redirect breakpoint:** ≤ 1024 px (covers iPad portrait + landscape)
- **Spec location:** `docs/plans/` (matches existing project convention)
- **Branching strategy:** Phase 20 closes first (tag `defense-2026-05-06` on `main`), then mobile work begins on a fresh branch `feat/mobile-companion` off `main`. The mobile companion is **explicit extra-features scope, not defense-critical** — the defense ships on the desktop deck.
- **Demo slide on mobile:** dropped entirely. Live demo belongs on the laptop only; nothing useful to show on a passive reading view. Mobile total = 18 slides.
- **Scroll position persistence:** yes — scroll Y is captured on every theme/lang toggle and restored after the re-render so the reader doesn't lose their place.
- **Slide curation:** the 18-slide list in §5.2 is approved as-is.

## 12 · Open questions

All resolved — see §11. No outstanding decisions before implementation.
