# Master Thesis Presentation Narrative & Structure (Academic, Detailed)

This is a **deep reference** for planning and delivering a **Master’s thesis defense presentation** with a strong narrative and a committee-friendly structure. It is designed to be reusable later by you (and by AI) to generate outlines, slide plans, scripts, and backup material.

---

## 1) What committees usually want (the “grading lens”)

Across universities and departments, defense guidance tends to converge on a simple expectation:

1. **Context + problem** (why this matters, what gap exists)
2. **Your approach/method** (what you did and why it is valid)
3. **Results** (evidence that answers the question)
4. **Interpretation + contribution** (what the results mean, what is new)
5. **Limits + future work** (what you didn’t solve, what comes next)

Example phrasing in academic guidance:
- “Begin with your background, state the problem, and then give the specific approach, results, and conclusion.” (MIT)  
  Source: MIT “Thesis Defense” guide: https://www.mit.edu/course/21/21.guide/th-defen.htm
- “Describe the problem you studied and why it is interesting … describe the methods you have used …” (University of Oxford, oral presentation guidelines)  
  Source: Oxford Maths oral presentation guidelines PDF: https://www.maths.ox.ac.uk/system/files/attachments/oral_presentation_guidelines_2023-24.pdf
- “Emphasis on your results and interpretation; structure … same as your written thesis: Introduction … Methods … Results … Discussion … Conclusion.” (University of Geneva / UNIGE)  
  Source: UNIGE guideline PDF: https://neurocenter-unige.ch/wp-content/uploads/2020/11/guideline_thesiswriting.pdf
- “MA defense: 15–20 minutes, summarizing research question, results obtained, and conclusions.” (HSE guidelines)  
  Source: HSE research paper / defense guidelines PDF: https://www.hse.ru/mirror/pubs/share/444617304.pdf

---

## 2) The best narrative pattern for a Master thesis defense

### 2.1 The “Context → Gap → Question → Answer → So what?” arc (recommended)

This arc is the best default because it matches how committees evaluate novelty and evidence.

**(1) Context**  
What domain problem exists? Why should anyone care (industry, safety, cost, performance, sustainability, scientific knowledge)?

**(2) Gap**  
What is missing in current solutions / literature? Make this concrete (limitations, missing capability, poor robustness, missing dataset, high cost, lack of validation, etc.).

**(3) Question / Goal**  
Turn the gap into:
- one **research question**, or
- one **engineering objective** with success metrics.

**(4) Your Answer (Contributions)**  
State 2–4 contributions as *verbs*:
- “I propose…”
- “I design…”
- “I implement…”
- “I evaluate…”
- “I demonstrate…”

**(5) Evidence**  
Show experiments / benchmarks / test cases / simulations.

**(6) Meaning (“So what?”)**  
Implications, what changed, what can be built now, what improves.

This aligns with academic advice that the structure should be governed by **objective criteria** (the logical argument), not the chronological order of your work.  
Source example: OVGU (structure governed by objective criteria) PDF: https://www.vst.ovgu.de/vst_media/Dokumente/Pr%C3%BCfungsamt/Formulare/Muster%2Bf%C3%BCr%2BAufgabenstellungen%2Bund%2BAnleitungen%2Bzu%2BAbschlussarbeiten/Anleitung%2Bzur%2BGestaltung%2Bvon%2BBachelor_%2Bund%2BMasterarbeiten_Englisch-p-676.pdf

### 2.2 IMRaD as the “committee-native” structure (safe default)

Many programs explicitly recommend IMRaD-like organization for theses and presentations:
- **Introduction**
- **Methods**
- **Results**
- **Discussion**
- **Conclusion**

Examples:
- TU Dresden recommends IMRaD for thesis structuring (useful mapping to a defense talk):  
  https://tu-dresden.de/ing/informatik/smt/cgv/studium/studentische-arbeiten/wie-schreibe-ich-eine-abschlussarbeit?set_language=en
- UNIGE defense guideline: presentation structure same as thesis with Introduction/Methods/Results/Discussion/Conclusion:  
  https://neurocenter-unige.ch/wp-content/uploads/2020/11/guideline_thesiswriting.pdf

**Recommendation:** Use the **Context→Gap→Question→Answer→So what** narrative *inside* an IMRaD shell.  
This gives you story + academic familiarity.

---

## 3) Concrete master thesis defense structures (choose one)

### Structure A — “Classic committee-friendly” (IMRaD with strong story)
Use when: technical/scientific thesis; you want maximum clarity.

1. Title + 1-sentence contribution
2. Motivation / context
3. Gap + research question(s) / objectives
4. Contributions (2–4 bullets)
5. Related work (ONLY what positions your work)
6. Method / system architecture
7. Experimental setup / evaluation protocol
8. Results (1–3 key results)
9. Discussion (why results look like this, comparison, implications)
10. Limitations
11. Conclusion + future work
12. Backup slides (extra results, parameters, derivations)

Supports: MIT’s simplified outline and UNIGE IMRaD mapping.  
Sources: MIT, UNIGE (links above).

### Structure B — “Engineering / product / system thesis”
Use when: you built a system (embedded, robotics, software, product dev).

1. Problem context + constraints (time, cost, safety, standards)
2. Requirements + success metrics
3. System architecture (block diagram)
4. Key design decisions (3–5 “why” decisions)
5. Implementation overview (modules)
6. Validation plan (how you test)
7. Results (performance, reliability, edge cases)
8. Trade-offs + limitations
9. Contribution summary + next steps

Why it works: committees want **traceability** from requirements → design → evidence.

### Structure C — “Scientific / experimental thesis”
Use when: your thesis resembles a paper (hypotheses, experiments).

1. Context + hypothesis / research question
2. Literature positioning
3. Methods (design, data, instruments)
4. Results (primary, then secondary)
5. Interpretation (meaning, why)
6. Robustness checks / ablations
7. Limitations + future work
8. Conclusion

Use “hourglass” logic: broad → narrow → broad (common in research structure guidance).  
A reference discussing hourglass structure in scientific writing:  
https://redacaocientifica.weebly.com/uploads/6/0/2/2/60226751/scientific_writing___the_scientific_method.pdf

---

## 4) Time planning templates (10 / 15 / 20 / 30 minutes)

Different universities set different limits; you need a reusable time allocation.

### 4.1 10-minute defense talk (very short)
Goal: be selective; show only the strongest evidence.

- 1 min — Context + gap + question
- 2 min — Approach overview (architecture)
- 4 min — Key result #1 and #2 (the proof)
- 2 min — Interpretation + contribution
- 1 min — Limitations + conclusion

Example of strict short limits and what slides should reflect: Charles University defense instructions (10 minutes):  
https://iksz.fsv.cuni.cz/sites/default/files/uploads/files/Thesis%20defense%20instructions%20.pdf

### 4.2 15-minute talk (common for Master)
- 2 min — Context + gap + question + contributions
- 4 min — Method / system
- 6 min — Results (2–3 results with comparisons)
- 2 min — Discussion + limitations
- 1 min — Conclusion + future work

Example: HSE says MA defense talk is typically **15–20 minutes** summarizing question, results, conclusions.  
Source: https://www.hse.ru/mirror/pubs/share/444617304.pdf

### 4.3 20-minute talk (ideal balance)
- 3 min — Context + gap + objectives + contributions
- 5 min — Method + evaluation plan
- 9 min — Results + robustness checks
- 2 min — Limitations + implications
- 1 min — Conclusion

### 4.4 30-minute talk (longer defenses)
- 5 min — Context + gap + objectives + contributions
- 8 min — Method + design decisions
- 12 min — Results (with 1 deeper dive)
- 3 min — Limitations + threats to validity
- 2 min — Conclusion + future work

MIT indicates the defense presentation is the committee’s basis for understanding; clarity and structure are emphasized.  
Source: https://www.mit.edu/course/21/21.guide/th-defen.htm

---

## 5) Slide-by-slide blueprint (copy/paste template)

This blueprint maps narrative → slide function. Use it in reveal.js / PPT / any format.

### Section 0 — Opening (1–2 slides)
**Slide 1: Title**  
- Thesis title, your name, supervisor(s), institute, date.
- One line: “This thesis contributes X by doing Y resulting in Z.”

**Slide 2: Roadmap**  
- 4 sections max: Problem → Method → Results → Conclusions.

### Section 1 — Problem framing (2–4 slides)
**Slide 3: Context**  
- Real-world scenario, or domain diagram.

**Slide 4: Gap**  
- What fails today (numbers if possible).

**Slide 5: Research question / objective**  
- Include success metrics.

**Slide 6: Contributions**  
- 2–4 bullets, each a verb + object + measurable outcome.

### Section 2 — Approach (3–6 slides)
**Slide 7: Architecture**  
- Block diagram; show inputs/outputs.

**Slide 8: Key idea / novelty**  
- The “one slide” that makes your work special.

**Slide 9: Method details (only essentials)**  
- Data, model, controller, algorithm, design.

**Slide 10: Evaluation plan**  
- What you test, baselines, metrics.

### Section 3 — Results (3–8 slides)
**Slide 11: Result #1 (primary)**  
- One plot/table + takeaway box.

**Slide 12: Result #2 (comparison to baseline)**  
- Show improvement and significance.

**Slide 13: Robustness / sensitivity / ablation**  
- Demonstrate you understand failure modes.

**Slide 14: Case study / demo frame**  
- One representative scenario.

### Section 4 — Interpretation + close (2–4 slides)
**Slide 15: Discussion / implications**  
- “What this enables now…”

**Slide 16: Limitations / threats to validity**  
- 3 bullets, with mitigation if possible.

**Slide 17: Conclusion**  
- Repeat research question, answer it in one sentence, list contributions again briefly.

**Slide 18: Future work**  
- 3 items, concrete and credible.

### Backup (as many as needed)
- Extra charts
- Parameter tables
- Derivations
- Additional test cases
- Implementation details

---

## 6) How to make the narrative “feel academic” (without being boring)

### 6.1 Use claims + evidence pairing
For every claim you make, attach:
- a plot/table,
- or a methodological justification,
- or a reference/baseline comparison.

### 6.2 Use “signposts” (committees like this)
At section starts:
- “Here is the problem and why it matters…”
- “Here is the method and why it is valid…”
- “Here are the results that answer the question…”
- “Here is what it means and what remains open…”

Oxford suggests writing an outline first (bullet points) before making slides, so you control the logical story.  
Source: https://www.maths.ox.ac.uk/system/files/attachments/oral_presentation_guidelines_2023-24.pdf

### 6.3 Limit related work
Only include enough literature to:
- define the gap,
- justify your approach,
- and select baselines.

UBC’s general thesis structure guidance reflects the canonical set: introduction, prior work analysis, methods, results, discussion/implications.  
Source: https://www.grad.ubc.ca/current-students/dissertation-thesis-preparation/structure-style-theses-dissertations

---

## 7) Common committee questions (prepare slides & answers)

Prepare 1–2 backup slides for each category.

### Problem & scope
- Why is this problem important?
- What exactly is included/excluded?

### Method validity
- Why is your method appropriate?
- What assumptions does it rely on?

### Evaluation
- Why these metrics?
- Why these baselines?
- What is your strongest evidence?

### Robustness
- When does your method fail?
- How sensitive are results to parameters?

### Contribution
- What is novel compared to prior work?
- What can others reuse?

### Future work
- What would you do with 3 more months?

---

## 8) Minimal “definition of done” checklist (presentation quality gate)

**Story**
- Clear gap + question in first 3 minutes.
- Contributions stated explicitly.
- Results directly answer the question.

**Evidence**
- At least 1 baseline comparison (where meaningful).
- At least 1 robustness check (ablation/sensitivity/error analysis).

**Clarity**
- Each results slide has a “takeaway” statement.
- No slide has more than one main message.

**Defense-ready**
- Backup slides for likely questions.
- PDF export ready.
- Demo recorded as a video (if any).

---

## 9) Source index (academic / university-oriented)

Core defense structure:
- MIT “Thesis Defense”: https://www.mit.edu/course/21/21.guide/th-defen.htm
- Oxford Maths “Dissertation Oral Presentation” guidelines (PDF): https://www.maths.ox.ac.uk/system/files/attachments/oral_presentation_guidelines_2023-24.pdf
- UNIGE Master thesis & defense guideline (PDF): https://neurocenter-unige.ch/wp-content/uploads/2020/11/guideline_thesiswriting.pdf
- HSE (BA/MA defense timing + expectations) (PDF): https://www.hse.ru/mirror/pubs/share/444617304.pdf

Additional structured guidance:
- UBC thesis structure & style: https://www.grad.ubc.ca/current-students/dissertation-thesis-preparation/structure-style-theses-dissertations
- TU Dresden (IMRaD structure): https://tu-dresden.de/ing/informatik/smt/cgv/studium/studentische-arbeiten/wie-schreibe-ich-eine-abschlussarbeit?set_language=en
- Valdosta dissertation defense presentation guide (PDF, practical slide checklist): https://www.valdosta.edu/colleges/education/deans-office/documents/dissertation-defense-guide.pdf
- “Writing and presenting your thesis” (Levine PDF): https://people.cs.bris.ac.uk/~kovacs/advice/local-copies/writing.and.presenting.your.thesis.pdf

---

## 10) How to use this reference with AI later (prompt templates)

### A) Generate a complete defense outline
**Prompt**
“Use the Context→Gap→Question→Answer→So what narrative. My thesis topic is: ____. Time limit: __ minutes. Audience: ____. Provide a slide-by-slide outline with talk track (what to say) and note which slides should be backup.”

### B) Turn outline into slide content
**Prompt**
“Here is my outline: ____. Create slide headlines and 2–4 bullets per slide. Mark the single key takeaway per slide.”

### C) Build a Q&A defense pack
**Prompt**
“Based on my thesis summary: ____. List the top 20 committee questions and draft strong answers. Suggest backup slides needed.”

