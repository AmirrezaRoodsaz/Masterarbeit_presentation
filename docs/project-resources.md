# Project Resources Map

> **Purpose:** Check off which sibling directories/resources are relevant for the presentation project.
> Mark each with its relevance level so Claude knows what to use and what to skip.
>
> **How to use:** Change the status emoji for each entry:
> - `[x]` = **Active source** — Claude should read and reference this
> - `[-]` = **Related but skip** — exists, not needed for presentation
> - `[ ]` = **Undecided** — needs your input

---

## Sibling Directories (inside `/Users/kurosch/Documents/Masterarbeit/`)

### Core Content Sources

- [x] **Masterarbeit_v2/** — LaTeX thesis report (all 5 chapters complete)
  - `kapitel/` — Chapter content (slide text comes from here)
  - `bilder/` — Figures, plots, flowcharts, screenshots
  - `logos/` — HS Bochum + Institut logos
  - `settings.tex` — Color definitions, custom commands
  - `Masterarbeit_v2.pdf` — Compiled thesis (5.8 MB)

- [x] **python_soh/** — Streamlit SOH analysis app
  - `MA-Amirreza-VehicleSohTesting/` — Full-stack app (FastAPI + React)
  - `Screenshots/` — 40 dirs of app screenshots
  - `data/` — 35 dirs of test datasets
  - _Needed for: live demo slide, app architecture diagram_

### Measurement Data

- [x] **Messdaten/** — Own measurement data (846 MB, 3 vehicles) ✅ 2026-03-14
  - `VW_ID.4/` — VW ID.4 tests (charging, snapshots)
  - `BMW_i3s/` — BMW i3s AVL HV-Check results
  - `Skoda_Elroq/` — Skoda Elroq data
  - `SOH-Messung_fortlaufend.xlsx` — Ongoing tracker
  - _Potentially needed for: result charts, data examples_

- [x] **Messdaten nue/** — Newer measurement batches (~102 MB CSV) ✅ 2026-03-14
  - Two large CSV exports + AVL subdirectory
  - _Potentially needed for: additional result data_

- [x] **Öffentliche_Messdaten/** — Public SOH datasets ✅ 2026-03-14
  - `Enyaq-MEB-SoH.xlsx`, `ID.4-SoH.xlsx`
  - _Potentially needed for: baseline comparison charts_

### Research & Literature

- [ ] **Literatur/** — 3 PDFs + 1 PPTX of reference material
  - ComprehensiveOverviewImpactingFactors.pdf
  - Full_Paper_ICRERA2025_UserSohDataAnalysis_251009_fin.pdf
  - InSituSOHanalysisUsingConventionalChargingInfrastructure.pdf
  - PID173_Simeon Kremzow-Tennie_Presentation.pptx
  - _Potentially needed for: related work slides, comparison_

- [ ] **SOH-Publications/** — 4 academic papers derived from thesis
  - paper-a-iecon2026/ (IECON, deadline May 31, 2026)
  - paper-b-software/ (SoftwareX/JOSS)
  - paper-c-journal/ (IEEE Access)
  - paper-d-education/ (IEEE EDUCON)
  - _Potentially needed for: future work slide, publication roadmap_

- [ ] **Research/** — Field photos + research notes
  - 6 JPEG photos of test vehicles/setups
  - Research_SOHc_SOHe_Gemini.md, WARP.md
  - _Potentially needed for: experimental setup photos_

### Archive / Legacy

- [ ] **Masterarbeit_SOH_Elektrofahrzeuge_Amirreza_Roodsaz/** — Original planning hub
  - `00_Admin_und_Planung/` — Project management, meeting notes
  - `01_Literaturrecherche/` — Literature research notes
  - `02_Methodik/` — Methodology docs
  - `03_Experimente_und_Ergebnisse/` — Experiment logs
  - `04_Schreiben_und_Kapitel/` — Earlier drafts (superseded)
  - `06_Latex_Arbeit/` — Old LaTeX template (unused)
  - `Zotero/` — 19 organized reference collections
  - `AI Assisst/` — AI-assisted research notes
  - 3x `ev_soh_analysis*.zip` — Historical app backups (~600 MB)
  - _Likely archival — content migrated to Masterarbeit_v2/_

- [ ] **Backup/** — 16 version snapshot directories
  - _Recovery archives, not needed for presentation_

- [ ] **LaTeX/** — Old LaTeX templates
  - 2021 institution template + template variant
  - _Superseded by Masterarbeit_v2/_

### Config / Tooling

- [ ] **.pandoc/** — Citation styles (APA, IEEE) + Zotero metadata
- [ ] **.obsidian/** — Obsidian vault config (14 plugin dirs)
- [ ] **.xfiResults/** — XFire analysis cache
- [ ] **.claude/** — Root-level Claude settings

---

## Quick Summary

| Directory | Size | Status |
|-----------|------|--------|
| Masterarbeit_v2/ | ~10 MB | Active source |
| python_soh/ | ~50 MB | Active source |
| Messdaten/ | ~846 MB | ? |
| Messdaten nue/ | ~102 MB | ? |
| Öffentliche_Messdaten/ | <1 MB | ? |
| Literatur/ | ~12 MB | ? |
| SOH-Publications/ | ~5 MB | ? |
| Research/ | ~15 MB | ? |
| Masterarbeit_SOH_.../ | ~650 MB | ? |
| Backup/ | varies | ? |
| LaTeX/ | <1 MB | ? |
| .pandoc/ | <1 MB | ? |
| .obsidian/ | <1 MB | ? |

> **Edit this file**, then tell me "resources updated" and I'll adjust my behavior accordingly.
