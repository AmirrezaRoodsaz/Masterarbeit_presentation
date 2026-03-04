# CLAUDE.md – Masterarbeit Presentation (Sub-Project)

## Project Overview
**Parent Project:** Masterarbeit SOH Elektrofahrzeuge
**Thesis Title:** Entwicklung reproduzierbarer Methoden zur Bestimmung des State of Health (SOH) von Traktionsbatterien innerhalb des Elektrofahrzeugs mittels On-Board- und Off-Board-Diagnosesystemen
**Author:** Amirreza Roodsaz
**Institution:** Hochschule Bochum – Institut für Elektromobilität
**Advisor:** Prof. Dr.-Ing. Kerstin Siebert
**Target Defense:** April 2026
**Presentation Language:** Primarily German (slides), with English technical terms as standard in the domain

## Mission
Build a **jaw-dropping, academically rigorous** thesis defense presentation that combines:
- Clear narrative structure (Context → Gap → Question → Answer → So what)
- High-end visual design (one key message per slide, assertion-evidence structure)
- Interactive/3D elements where they **explain** something (not decoration)
- Safe fallbacks (PDF export, video recording of any demos)

## Parallel Sub-Projects
This presentation project runs **in parallel** with the thesis report writing:
- **Report writing:** `../Masterarbeit_v2/` (LaTeX, CLAUDE.md exists there)
- **Presentation:** This folder (`./`)
- Both share the same data, results, and figures from the root Masterarbeit folder

## Pre-Research Documents (Reference Only)
These 4 files are pre-research — horizons of what will come, not final decisions:
- `masterarbeit_presentation_reference.md` — Web tech options, frameworks, 3D, reliability checklist
- `master_thesis_narrative_structure_reference.md` — Narrative arcs, slide blueprints, time planning
- `master_thesis_pre_research_checklist.md` — Institutional requirements, audience analysis, evidence audit
- `master_thesis_final_refinement_checklist.md` — Contribution distillation, validity threats, slide economy

## Technical Stack (Decided)
- **Primary format:** Web-based slides (reveal.js or Slidev — final choice TBD based on prototyping)
- **3D integration:** `<model-viewer>` for GLB models (primary), Three.js only if custom behavior needed
- **Fallbacks:** PDF export, PPTX backup, video recording of 3D demos
- **Offline-first:** All assets bundled locally, no external dependencies at runtime

## Thesis Content Summary (For Slide Content)
### Domain
- **SOH (State of Health)** of EV traction batteries
- On-Board (OBD) and Off-Board (AVL HV-Check) diagnostic systems
- Test vehicles: VW ID.4, BMW i3s, Skoda Elroq

### Key Methods & Tools
- **AVL HV-Check** (0–1000V DC, ±0.5% accuracy) — Off-board diagnostics
- **OBD Link MX+** (Bluetooth OBD adapter) — On-board data logging
- **AUTEL MaxiSYS Ultra** — Universal diagnostic device
- SOH calculation: capacity-based, energy-based (SOHe), resistance-based (HPPC)
- Analysis: ICA/DVA, OCV curves, cell balance, temperature analysis

### Key Results (to be populated from Chapter 4)
- Results chapter (~30% complete in LaTeX) — will be updated as data finalizes
- Python SOH app available at `../python_soh/MA-Amirreza-VehicleSohTesting/`
- Measurement data at `../Messdaten/` (846 MB, 3 vehicles)

## Design System (Established Constraints)
- **Brand color:** HSBoRed `#E2001A` (Hochschule Bochum — use as accent, not dominant)
- **Grid:** Consistent layout grid across all slides
- **Typography:** Modern sans-serif (specific font TBD during design phase)
- **Progress indicator:** Section names visible throughout
- **Takeaway box:** Every results slide gets a "What should the committee remember?" box
- **One key message per slide** — assertion-evidence structure, not bullet lists
- **Logos:** `../Masterarbeit_v2/logos/HS_Bochum_Logo.pdf`, `../Masterarbeit_v2/logos/Institut_Logo.pdf`

## Narrative Structure (Default)
Based on pre-research, use **Structure A — Classic committee-friendly with strong story**:
1. Title + one-sentence contribution
2. Motivation / context (real-world EV battery degradation problem)
3. Gap + research question(s)
4. Contributions (2–4 bullets, verb + object + outcome)
5. Related work (only what positions our work)
6. Method / system architecture (pipeline diagram — interactive?)
7. Experimental setup / evaluation protocol
8. Results (key charts with baseline comparisons)
9. Discussion (implications, comparison)
10. Limitations
11. Conclusion + future work
12. Backup slides

## Time Planning
- **Default target:** 20 minutes (verify with institution)
- Allocation: 3 min context → 5 min method → 9 min results → 2 min limits → 1 min conclusion

## Available Skills (Use Proactively)
### Presentation Creation & Design
| Skill | When to Use |
|-------|-------------|
| `presentation-architect` | Transform ideas into slide-by-slide Markdown blueprints with exhaustive detail |
| `presentation-design` | Evaluate and diagnose slide design (cognitive load, visual clarity, audience focus) |
| `presentation-design-enhancer` | Transform text-heavy slides into visual storytelling |
| `giving-presentations` | Delivery coaching, narrative techniques, rehearsal strategy |
| `pptx-presentation-builder` | Build PPTX if needed as fallback format |
| `pptx` | Read/write/manipulate PPTX files |

### Visual & Frontend
| Skill | When to Use |
|-------|-------------|
| `frontend-design` | Build the web-based slide interface, custom components |
| `canvas-design` | Create visual assets (posters, diagrams, figures as PNG/PDF) |
| `3d-graphics` / `threejs-3d-graphics` / `3d-web-experience` | 3D elements (battery models, pipeline visualizations) |

### Writing & Language
| Skill | When to Use |
|-------|-------------|
| `german-professional` | German professional writing for slide text and speaker notes |
| `latex-writing` | If any LaTeX-based figures or equations needed |

### Documents & Export
| Skill | When to Use |
|-------|-------------|
| `document-skills:pdf` | PDF export, manipulation |
| `document-skills:pptx` | PPTX creation/editing |
| `document-skills:canvas-design` | Static visual design assets |
| `document-skills:webapp-testing` | Test the web presentation in browser |

### Workflow
| Skill | When to Use |
|-------|-------------|
| `superpowers:brainstorming` | Before any creative work (new slides, visual concepts, layout ideas) |
| `superpowers:writing-plans` | Before multi-step implementation tasks |
| `superpowers:verification-before-completion` | Before claiming any deliverable is done |

## Workflow Rules
1. **Always brainstorm before building** — use `superpowers:brainstorming` before any creative work
2. **Narrative first, visuals second** — write all slide titles and messages before any design
3. **One key message per slide** — if a slide has two messages, split it
4. **Assertion-evidence structure** — headlines are takeaways, not labels
5. **3D only when it explains** — never decoration; must clarify geometry, pipeline, or data
6. **Offline-first** — all assets local, no CDN dependencies at runtime
7. **Fallbacks mandatory** — PDF export + demo video for any interactive/3D content
8. **Test on target hardware** — verify on projector resolution before defense

## Cross-Project Resource Paths
```
../Masterarbeit_v2/              # LaTeX thesis report (parallel sub-project)
../Masterarbeit_v2/kapitel/      # Chapter content (source for slide content)
../Masterarbeit_v2/bilder/       # Shared figures
../Masterarbeit_v2/logos/        # University + Institute logos
../Messdaten/                    # Raw measurement data (846 MB)
../Messdaten/VW_ID.4/            # VW ID.4 test data
../Messdaten/BMW_i3s/            # BMW i3s test data
../Messdaten/Skoda_Elroq/        # Skoda Elroq test data
../python_soh/                   # Python SOH analysis app (Streamlit)
../Literatur/                    # Research papers and references
../Öffentliche_Messdaten/        # Public SOH datasets
../Masterarbeit_SOH_Elektrofahrzeuge_Amirreza_Roodsaz/Zotero/  # Bibliography
```

## Permissions & Agent Usage
- Always allowed to search the internet (WebSearch, WebFetch) without asking
- Always allowed to use Claude Code subagents (Task tool) for research, exploration, and parallel work
- May read any file in the parent Masterarbeit directory tree for content and context
- Proactively invoke relevant skills — especially `presentation-architect` and `presentation-design` before creating slides
- Use `giving-presentations` skill when preparing speaker notes or rehearsal material

## Sync Protocol
When the user says **"sync"**, automatically:

1. `git status` → review changes
2. `git add -A` → stage all (`.gitignore` handles exclusions)
3. Analyze diff → generate descriptive commit message (`feat:`, `fix:`, `style:`, `docs:`, `refactor:`, `chore:`)
4. `git commit` with co-author tag
5. `git push origin main`
6. Report summary of what was pushed

**Remote:** `https://github.com/AmirrezaRoodsaz/Masterarbeit_presentation.git` | **Branch:** `main`

## Quality Gates
Before any presentation deliverable is considered complete:
- [ ] One-sentence thesis claim is sharp and testable
- [ ] Every slide has exactly one key message
- [ ] All results slides have a "takeaway" statement
- [ ] At least 1 baseline comparison shown
- [ ] At least 1 robustness/sensitivity check shown
- [ ] Contributions stated explicitly with action verbs
- [ ] Backup slides prepared for anticipated committee questions
- [ ] PDF fallback exported
- [ ] 3D demo recorded as video backup
- [ ] Tested offline (no network dependencies)
- [ ] Tested on target display resolution

## TODO — Next Steps

- [x] **Brainstorming** — approach decided (A+ Hybrid), design approved → see `docs/plans/2026-03-04-presentation-design.md`
- [ ] **Create implementation plan** — use `writing-plans` skill to break design into concrete build steps
- [ ] **Verify institutional requirements** — time limit, language, required elements (logo, declaration), Q&A format
- [ ] **Distill core contribution** into one sentence: *"This thesis demonstrates that ___ by ___, resulting in ___"*
- [ ] **Build slide-by-slide blueprint** using `presentation-architect` skill
- [ ] **Design and implement** the full presentation with 3D elements where they explain something

## How to Use Skills

Skills are invoked **automatically** — just describe what you want in plain language and Claude picks the right ones.

**To force a specific skill**, name it in your prompt:

- *"Use the presentation-architect skill to plan my slides"*
- *"Use manimgl to animate the SOH equation"*

**Tip:** Skills are most powerful with **concrete tasks** rather than abstract ones. Instead of *"make it look good"*, say *"build a dark-themed slide showing SOH comparison across 3 vehicles with an interactive bar chart"* — that lets Claude chain multiple skills together for maximum impact.

## Additional Skills to Consider Installing
Found via web search — could enhance the workflow:
- **[revealjs-skill](https://github.com/ryanbbrown/revealjs-skill)** — Claude Code skill specifically for creating reveal.js presentations from natural language
- **[threejs-skills](https://github.com/CloudAI-X/threejs-skills)** — Modular Three.js skills for 3D scenes, cameras, lighting, materials
- **[claudedesignskills](https://github.com/AvaBillions2040/claudedesignskills-02-02-2026)** — Bundle of 27 design-focused skills including 3D, animation, and interactive web
