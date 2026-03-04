# Masterarbeit Presentation as a Website (Deep Reference)

This document is a **complete reference** for building an impressive Masterarbeit presentation using **web technology** (website / web-slides), with **safe fallbacks** (PDF/PPT) and optional **3D**.

---

## 1) Is a website a good idea for a thesis defense?

### When a website is a strong choice
Use a website (or “web slides”) if you need any of the following:
- **Interactive demonstrations** (simulation controls, parameter sliders, live charts).
- **Embedded videos**, animations, or interactive figures.
- **3D models** (CAD, robot, mechanism, battery pack, etc.) that benefit from rotation / inspection.
- **Version control + reproducibility** (Git, text-based source, easy edits right before the defense).

### When a website is risky
Avoid a pure website if:
- The presentation room may have **no internet** and you haven’t built **offline**.
- You rely on heavy 3D and the hardware is uncertain (GPU / browser).
- Your committee is very traditional and expects a standard “slide deck” flow.

### Best-practice compromise (recommended)
**Use web-based slides** that behave like PowerPoint (keyboard navigation, speaker notes, PDF export), and optionally add **one controlled “wow” section** with 3D.

---

## 2) Decision matrix (choose your format)

### A) Web slides (best balance)
**Use when:** you want a “website feel” but the reliability of slides.

Top picks:
1. **reveal.js** – classic HTML slide framework; supports Markdown, speaker notes, PDF export, plugins.  
   - Official site: https://revealjs.com/  
   - Examples/demos: https://revealjs.com/ (demo built-in)
2. **Quarto + revealjs** – write in Markdown, render to reveal.js; good for scientific work (equations, code).  
   - Docs: https://quarto.org/docs/presentations/revealjs/  
   - Demo: https://quarto.org/docs/presentations/revealjs/demo/
3. **Slidev** – Markdown slides + Vue components; very interactive; strong developer workflow.  
   - Site: https://sli.dev/  
   - Getting started: https://sli.dev/guide/

### B) Markdown-to-slides with export
**Use when:** you want fast authoring and easy PDF/HTML export.
- **Marp** (Markdown Presentation Ecosystem): https://marp.app/  
  - Good for clean, minimal academic style.
  - Exports: HTML, PDF, and often PPTX via tooling/CLI.
- **Deckset** (macOS/iOS app, Markdown → beautiful slides): https://www.deckset.com/  
  - Good if you are on Mac and want polished results fast.

### C) “Infinite canvas / Prezi-like” web presentations (high wow, higher risk)
- **impress.js** (3D transforms, zoom canvas): https://impress.js.org/  
  - Great visual impact, but can distract and is less “academic standard”.

### D) Classic templates (fastest safe path)
If you decide to stay classic:
- Slidesgo thesis defense templates: https://slidesgo.com/thesis-defense  
- Genially thesis defense templates: https://genially.com/templates/presentations/thesis-defense/  
- SlidesCarnival thesis defense templates: https://www.slidescarnival.com/tag/thesis-defense

---

## 3) “Impress the committee” without sacrificing clarity

### The rule
**Clarity > effects.**  
Effects are allowed only if they **explain** something (method, results, geometry, pipeline).

### A strong narrative structure (works for most Masterarbeit defenses)
1. **Title + one-sentence contribution**
2. **Motivation / problem statement** (why it matters)
3. **Research questions / goals**
4. **Related work (very short)** – only what positions your contribution
5. **Your approach / system architecture**
6. **Methodology**
7. **Experiments / evaluation setup**
8. **Results (key charts + comparisons)**
9. **Ablations / sensitivity** (if applicable)
10. **Limitations**
11. **Conclusion (what you achieved)**
12. **Future work**
13. **Backup slides** (extra charts, derivations, dataset details)

### Design pattern that looks “high-end”
- Big headline, **one key message per slide**.
- Use a consistent **grid**.
- Use **progress indicator** (section names).
- Use “**Takeaway box**” on result slides: *What should the committee remember?*

---

## 4) Web-slide frameworks (with sample repos you can copy)

### reveal.js
- Official framework: https://revealjs.com/  
- Reveal.js thesis defense example repo: https://github.com/fortranguy/Defense  
- Another thesis defense slide repo (reveal.js): https://github.com/rsyi/thesis_slides  
- A reveal.js template you can fork: https://github.com/maehr/revealjs-presentation-template

Key features you can use:
- Speaker notes (presenter view)
- PDF export
- Nested slides (vertical/horizontal structure)
- Fragments (stepwise reveal)
- Plugins (zoom, menu, chalkboard, etc.)

### Quarto + reveal.js (excellent for academic work)
- Revealjs format docs: https://quarto.org/docs/presentations/revealjs/  
- Quarto reveal.js demo: https://quarto.org/docs/presentations/revealjs/demo/  
- Presenting tips (keyboard, fullscreen): https://quarto.org/docs/presentations/revealjs/presenting.html  
- Practical tips article (Quarto revealjs): https://remlapmot.github.io/post/2025/quarto-revealjs-tips/

Why Quarto helps:
- Write slides in Markdown with metadata (author, institute, date)
- Easy math (LaTeX), citations, code blocks
- Reproducible research workflow

### Slidev (interactive developer slides)
- Slidev home: https://sli.dev/  
- Getting started: https://sli.dev/guide/  
- Syntax guide: https://sli.dev/guide/syntax

Why Slidev impresses:
- Live components (Vue)
- Code demos
- Fast iteration

### Marp (clean, minimalist academic style)
- Marp: https://marp.app/  
- Marp recipes/snippets: https://github.com/hahnec/marp-recipes  
- Example Marp template (university-style): https://git.hs-mittweida.de/marp/marp-template-hsmw

---

## 5) Adding 3D safely (the “wow” section)

### The main goal
3D should **explain** something: geometry, assembly, motion, measurement, pipeline, simulation.

### Option 1 (recommended): `<model-viewer>` for GLB models (simple + robust)
- Project site: https://modelviewer.dev/  
- Docs: https://modelviewer.dev/docs/  
- Web.dev article: https://web.dev/articles/model-viewer  
- GitHub repo: https://github.com/google/model-viewer  

Benefits:
- Easiest embedding of `.glb` / `.gltf`
- Built-in camera controls
- Good performance if models are optimized
- Works offline if you host assets locally

Minimal embed example:
```html
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

<model-viewer
  src="assets/model.glb"
  alt="3D model"
  camera-controls
  auto-rotate
  style="width: 100%; height: 520px;">
</model-viewer>
```

Offline note:
- If you want full offline, **bundle** the JS instead of loading from unpkg (or download and serve locally).

### Option 2: Spline (no-code 3D scenes, easy embed)
- Spline Viewer embed docs: https://docs.spline.design/exporting-your-scene/web/exporting-as-spline-viewer  
- Spline Viewer site: https://viewer.spline.design/  

Benefits:
- Very fast to create interactive 3D scenes
- Great for hero section and “polished” look

Risk:
- Can be heavier than `<model-viewer>`
- Ensure your defense setup can handle it smoothly

### Option 3: Three.js (maximum control, maximum work)
- Three.js main: https://threejs.org/  
- Examples gallery: https://threejs.org/examples/

When to use:
- You need custom shaders, physics, advanced interaction, or real-time visualization.

If you want Three.js inside reveal.js:
- reveal.js + Three.js integration repo: https://github.com/dimroc/reveal.js-threejs  
- Example of ThreeJS demos inside reveal.js slides (blog): https://blog.dimroc.com/2014/08/20/intro-to-threejs-slides/

---

## 6) “Scrollytelling” thesis website (optional, advanced)

Instead of slides, you can build a narrative website:
- Intro section with your contribution (hero)
- Scroll-driven sections for method and results
- Interactive figure blocks (charts, 3D, videos)
- A “Defense mode” that turns it into slides or step-by-step panels

Inspiration for scroll-driven 3D:
- Codrops scroll camera fly-through (Theatre.js + R3F):  
  https://tympanus.net/codrops/2023/02/14/animate-a-camera-fly-through-on-scroll-using-theatre-js-and-react-three-fiber/

Recommended compromise:
- Use **web slides for the main defense**.
- Use a **scrollytelling site as an appendix** (for later sharing, portfolio, job interviews).

---

## 7) Practical reliability checklist (this prevents disasters)

### Offline-first (critical)
- All assets (fonts, images, videos, models) stored locally in the project.
- No remote dependencies (or you have a local copy).
- Presentation runs from:
  - `file://` **or** local web server (`localhost`)
  - A USB stick if needed

### Performance
- Preload large assets (videos / 3D models).
- Keep 3D polygon count low; compress textures.
- Avoid doing heavy real-time animation during key speaking moments.

### Always have fallbacks
You must prepare:
1. **PDF export** of the final slides
2. A **video recording** of your 3D demo (so if it fails, you play the video)
3. Optionally: a classic PPTX as absolute fallback

### In-room rehearsal (non-negotiable)
- Test on the *same resolution* as the projector.
- Test with the actual clicker / keyboard.
- Test without internet.

---

## 8) How to choose your “wow” concept (ideas that usually impress)

### Idea A: “Pipeline slide” with interactive checkpoints
A slide that shows your full system pipeline:
- Inputs → preprocessing → model/control → output → evaluation
Each block is clickable to open:
- a short animation
- a mini figure
- a key equation
- a 3D view

### Idea B: 3D model + annotation hotspots
Use `<model-viewer>` hotspots (or a simple overlay) to highlight:
- sensors
- mounting points
- critical geometry
- failure points
- design improvements

### Idea C: Results dashboard slide (static look, interactive optional)
- Show your key chart(s) with a “toggle” for:
  - baseline vs yours
  - dataset A/B
  - parameter sensitivity

### Idea D: “Story” opening (30 seconds max)
Start with:
- A real-world scenario
- A single failure case
- One strong visual
Then immediately go to your contribution.

---

## 9) Templates and assets (quick collection)

### Slide templates (classic)
- Slidesgo thesis defense: https://slidesgo.com/thesis-defense  
- SlidesCarnival thesis defense tag: https://www.slidescarnival.com/tag/thesis-defense  
- Genially thesis defense templates: https://genially.com/templates/presentations/thesis-defense/

### Web-slide templates / examples
- reveal.js template (fork): https://github.com/maehr/revealjs-presentation-template  
- reveal.js defense repo example: https://github.com/fortranguy/Defense  
- reveal.js defense repo example: https://github.com/rsyi/thesis_slides

### Other web presentation engines (alternatives)
- Shower engine (HTML, printable PDF): https://github.com/shower/shower  
  - Demo: https://shower.github.io/jekyller/  
- remark (Markdown-in-browser slides): https://github.com/gnab/remark  
  - Project site: https://remarkjs.com/  
- impress.js (3D canvas): https://impress.js.org/  
  - GitHub: https://github.com/impress/impress.js

---

## 10) Recommended “safe” build plan (do this)

### Step 1: Choose the core format
Pick one:
- reveal.js (pure)  
- Quarto → reveal.js (very good for academic)  
- Slidev (developer-heavy, high interactivity)

### Step 2: Write the full outline first
Write all slide titles and 1–2 bullet points each.
Only after that, start visuals.

### Step 3: Add visuals and results
- Make result slides extremely clear.
- Add “Takeaway” statement on each result slide.

### Step 4: Add 3D as one controlled section
Use `<model-viewer>` first (lowest risk).
Only use Three.js if you *need* custom behavior.

### Step 5: Create fallbacks
- Export PDF
- Record a demo video
- Put them on the same USB folder

### Step 6: Rehearse
- Timer-based rehearsal
- Prepare answers for “why is this important?” and “limitations?”

---

## 11) Notes for future reuse (for you and AI)

If you ask an AI to help later, provide:
- Thesis topic + domain
- Audience (professor style: strict? practical? theory?)
- Defense time limit (e.g., 15 min, 20 min)
- Your 3 strongest results + 1 weakness
- Any required structure from your university

Then ask AI for:
- A slide-by-slide script
- A “questions the committee will ask”
- A “backup slides list”

---

## 12) Quick source index (from the web research)

- reveal.js: https://revealjs.com/  
- Quarto revealjs: https://quarto.org/docs/presentations/revealjs/  
- Slidev: https://sli.dev/  
- Marp: https://marp.app/  
- `<model-viewer>`: https://modelviewer.dev/  
- Three.js: https://threejs.org/  
- Spline viewer embed: https://docs.spline.design/exporting-your-scene/web/exporting-as-spline-viewer  
- impress.js: https://impress.js.org/  
- Shower: https://github.com/shower/shower  
- remark: https://remarkjs.com/  

---

## 13) Next action (optional)

If you share your **Masterarbeit topic** and what kind of **3D content** you want (CAD? robot? simulation? battery model?), you can turn this reference into a concrete:
- slide outline
- design system (fonts, spacing, colors)
- project folder structure
- and a minimal working template.
