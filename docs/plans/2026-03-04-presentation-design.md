# Presentation Design Document

**Date:** 2026-03-04
**Status:** Approved (baseline — may be adjusted during implementation)

---

## 1. Architecture — Approach A+ Hybrid

**Concept:** Reveal.js as the presentation backbone, wrapped in a lightweight navigation shell with two modes.

```
+---------------------------------------------------+
|  Navigation Shell (custom HTML/CSS/JS)            |
|  +-----------+-----------------------------------+|
|  | Sidebar   |                                   ||
|  | Menu      |   Reveal.js Presentation          ||
|  |           |   +-----------------------------+ ||
|  | 1. Intro  |   |                             | ||
|  | 2. Problem|   |   Current Slide Content     | ||
|  | 3. Method |   |   (D3 charts, diagrams,     | ||
|  | 4. Tools  |   |    flowcharts, animations)  | ||
|  | 5. Results|   |                             | ||
|  | 6. Demo   |   +-----------------------------+ ||
|  | 7. Discuss|                                   ||
|  | 8. Fazit  |   Progress bar + section title    ||
|  +-----------+-----------------------------------+|
|  [DE/EN toggle]  [Defense Mode / Browse Mode]     |
+---------------------------------------------------+
```

### Two Modes, One Codebase

- **Defense Mode** — sidebar collapses, fullscreen slides, keyboard nav, speaker notes (press `S`), timer
- **Browse Mode** — sidebar visible, click any section, scroll within sections, hand-out friendly

### Tech Stack

- Reveal.js 5.x (core slide engine)
- D3.js (interactive charts for results)
- GSAP (method comparison animation, transitions)
- Vanilla JS + CSS (navigation shell — no React/Vue overhead)
- Streamlit embed via iframe (tool demo section)
- Mermaid.js (flowcharts rendered in-slide)
- KaTeX (equations)
- All assets local, offline-first

---

## 2. Content Structure & Slide Map (~21 slides, ~20 min)

### Section 1 — Opening (2 slides, ~1.5 min)

- **Slide 1:** Title (name, thesis title, institution, logos, date)
- **Slide 2:** Roadmap / table of contents (clickable in browse mode)

### Section 2 — Problem & Motivation (3 slides, ~2.5 min)

- **Slide 3:** Real-world problem — EV battery degradation affects value, range, trust
- **Slide 4:** The gap — BMS values are manufacturer-locked, no standardized method
- **Slide 5:** Research question + 4 contributions (verb + object + outcome)

### Section 3 — Theoretical Foundation (2 slides, ~2 min)

- **Slide 6:** Battery basics — Li-ion cell structure, aging mechanisms (SEI, calendar, cyclic) — Mermaid flowchart
- **Slide 7:** SOH definitions — capacity-based vs resistance-based — KaTeX equations

### Section 4 — Methodology (4 slides, ~4 min) — Academic Core

- **Slide 8:** Three diagnostic tools comparison (AVL, OBD, AUTEL) — interactive table or D3
- **Slide 9:** Test protocol flowchart (Mermaid): preparation -> snapshot -> CC-CV -> pulse -> analysis
- **Slide 10:** Test vehicle specs (VW ID.4 77kWh NMC, BMW i3 42kWh)
- **Slide 11:** SOH calculation pipeline — 4 methods -> combined -> temperature correction — GSAP animated

### Section 5 — Results & Tool Demo (6 slides, ~7 min) — 50% of Presentation

- **Slide 12:** Method comparison — D3 interactive bar chart (AVL 97.3% vs Combined 95.7%)
- **Slide 13:** Reproducibility — 3 tests, SOH 95.54-95.72%, std dev < 0.1%
- **Slide 14:** Temperature effect — 9.8C vs 19C comparison, D3 side-by-side
- **Slide 15:** DC pulse resistance — VW 40 mohm vs BMW 228 mohm, D3 chart
- **Slide 16:** Failure case — BMW i3 incomplete SOC window -> 84% divergence
- **Slide 17:** Live tool demo — Streamlit iframe (upload data -> generate charts -> get SOH)

### Section 6 — Discussion (2 slides, ~2 min)

- **Slide 18:** Strengths & limitations table
- **Slide 19:** Uncertainty budget: u_total = sqrt(u_Mess^2 + u_Temp^2 + u_SOC^2 + u_Alter^2)

### Section 7 — Conclusion & Outlook (2 slides, ~1.5 min)

- **Slide 20:** Core finding — combination of methods + standardized protocol = reproducible SOH
- **Slide 21:** Applications (workshops, fleet, insurance, second-life) + future work (ML, norms, field tests)

### Backup Slides (browse mode only)

- Detailed AVL cell balance data
- ICA/DVA analysis charts
- Full Python app architecture
- Extended vehicle specs
- Extra temperature correction details

---

## 3. Visual Design System

### Theme: Dark Professional

| Role | Color | Usage |
|------|-------|-------|
| Background | `#0f0f1a` | Primary slide bg |
| Surface | `#1a1a2e` | Cards, panels, menu bg |
| Text primary | `#f0f0f0` | Headlines, body |
| Text secondary | `#a0a0b8` | Labels, captions |
| Accent | `#E2001A` (HSBoRed) | Highlights, key numbers, progress bar |
| Accent soft | `#E2001A33` | Subtle backgrounds, hover states |
| Success | `#00C9A7` | Positive results, good SOH values |
| Warning | `#FFB800` | Caution, temperature effects |
| Chart colors | `#4C9AFF`, `#E2001A`, `#00C9A7`, `#FFB800` | D3 chart series |

### Typography

- **Font:** Inter (clean, modern, excellent at all sizes)
- **Fallback:** Source Sans Pro

### Design Rules

- One key message per slide (assertion-evidence structure)
- Headlines are takeaways, not labels
- Takeaway box on every results slide
- Consistent grid layout across all slides
- HSBoRed as accent only — not dominant
- Title + conclusion slides use lighter variant (`#1a1a2e`) to bookend

---

## 4. Interactive Elements & Animations

### 4.1 Method Comparison Animation (Slide 11)

- SOH pipeline builds step-by-step with GSAP
- Raw data -> 4 calculation methods fan out -> results converge into combined SOH
- Each method block clickable in browse mode (shows formula + explanation)
- Defense mode: auto-plays on slide enter, ~8 seconds

### 4.2 Interactive Results Dashboard (Slides 12-16)

- D3 charts with toggle buttons: switch between vehicles, temperatures, methods
- Bar chart: click a bar -> tooltip with exact value + context
- Temperature comparison: toggle between 9.8C and 19C — chart morphs
- Takeaway box animates in after chart loads

### 4.3 Live Tool Demo (Slide 17)

- Streamlit app embedded via iframe (localhost:8501)
- Fallback: if Streamlit not running, pre-recorded video auto-plays
- Browse mode: full-width interactive iframe
- Defense mode: presenter narrates while interacting live

### 4.4 Subtle Animations (throughout)

- Slide transitions: simple fade (no spinning/flying)
- Fragment reveals: content appears top-down on advance
- Progress bar: HSBoRed line at bottom, grows per section
- Menu highlight: current section pulses subtly in sidebar

---

## 5. Fallback & Reliability

- **PDF export:** Reveal.js `?print-pdf` mode -> static PDF, charts as snapshots
- **Streamlit fallback:** Pre-recorded MP4 of demo flow, auto-plays if iframe fails
- **Offline:** All fonts (Inter), D3, GSAP, Reveal.js bundled locally. Zero CDN calls.
- **USB-ready:** Entire folder runs from `file://` or `python -m http.server`

---

## 6. Bilingual Support

- German primary (all slide text)
- EN/DE toggle button in navigation shell
- Implemented via `data-lang` attributes on text elements
- Charts: labels switch language on toggle
- Aligned with Python app (which is already bilingual v2.9.2)

---

## 7. Key Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Reveal.js 5.x + custom shell | Reliability + PDF export + proven for defenses |
| Approach | A+ Hybrid (not pure slides, not full SPA) | Menu navigation + defense mode in one codebase |
| Theme | Dark professional | Best for projectors, data viz, modern feel |
| Charts | D3.js | Maximum control for scientific data |
| Animation | GSAP | Smooth, performant, timeline-based |
| Diagrams | Mermaid.js | Easy flowcharts from markdown |
| Equations | KaTeX | Fast, lightweight LaTeX rendering |
| Fonts | Inter | Modern sans-serif, excellent readability |
| Demo | Streamlit iframe + video fallback | Live demo with safety net |
| Language | German primary + toggle | Matches thesis language + flexibility |
