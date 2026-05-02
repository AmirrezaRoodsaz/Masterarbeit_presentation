// Mobile Companion — curated slide content
// Single source of truth for the audience reading view.
// Kept in sync with the live desktop deck by hand (~18 entries).
// Every text field is bilingual: { de, en }.
// HTML in `body` is rendered via innerHTML — keep it sanitized at the source.

export const MOBILE_SLIDES = [

  // ========================================================================
  // 1 · TITLE
  // ========================================================================
  {
    id: 'title',
    type: 'hero',
    section: { de: 'Auftakt', en: 'Opening' },
    slideNumber: 1,
    kicker: { de: 'Masterarbeit Kolloquium', en: "Master's Thesis Colloquium" },
    headline: {
      de: 'Entwicklung reproduzierbarer Methoden zur Bestimmung des State of Health (SOH) von Traktionsbatterien',
      en: 'Development of Reproducible Methods for Determining the State of Health (SOH) of Traction Batteries',
    },
    subtitle: {
      de: 'innerhalb des Elektrofahrzeugs mittels On-Board- und Off-Board-Diagnosesystemen',
      en: 'within the Electric Vehicle Using On-Board and Off-Board Diagnostic Systems',
    },
    meta: {
      author: 'Amirreza Roodsaz',
      institution: { de: 'Hochschule Bochum — Institut für Elektromobilität', en: 'Bochum University of Applied Sciences — Institute for Electromobility' },
      advisors: [
        { de: 'Erste Prüferin: Prof. Dr.-Ing. Kerstin Siebert', en: 'First Examiner: Prof. Dr.-Ing. Kerstin Siebert' },
        { de: 'Zweiter Prüfer: Prof. Dr.-Ing. Michael Schugt', en: 'Second Examiner: Prof. Dr.-Ing. Michael Schugt' },
      ],
      date: '6. Mai 2026',
    },
  },

  // ========================================================================
  // 2 · ROADMAP / AGENDA
  // ========================================================================
  {
    id: 'roadmap',
    type: 'list',
    section: { de: 'Auftakt', en: 'Opening' },
    slideNumber: 2,
    headline: { de: 'Agenda', en: 'Agenda' },
    items: [
      { num: '1', title: { de: 'Motivation', en: 'Motivation' }, desc: { de: 'Kosten, Sicherheit & Transparenz', en: 'Cost, safety & transparency' } },
      { num: '2', title: { de: 'Theorie', en: 'Theory' }, desc: { de: 'Batteriealterung & SOH-Definition', en: 'Battery aging & SOH definition' } },
      { num: '3', title: { de: 'Methodik', en: 'Methodology' }, desc: { de: 'Fahrzeuge, Protokoll & Werkzeuge', en: 'Vehicles, protocol & tools' } },
      { num: '4', title: { de: 'Ergebnisse & Demo', en: 'Results & Demo' }, desc: { de: 'SOH-Vergleich & Live-App', en: 'SOH comparison & live app' } },
      { num: '5', title: { de: 'Diskussion & Fazit', en: 'Discussion & Conclusion' }, desc: { de: 'Reflexion, Kernaussage & Ausblick', en: 'Reflection, core finding & outlook' } },
    ],
  },

  // ========================================================================
  // 3 · MOTIVATION (slide-problem)
  // ========================================================================
  {
    id: 'problem',
    type: 'standard',
    section: { de: 'Motivation', en: 'Motivation' },
    slideNumber: 3,
    headline: {
      de: 'Die Traktionsbatterie ist das teuerste Einzelbauteil — und ihr Zustand ist intransparent',
      en: 'The traction battery is the most expensive component — and its condition is opaque',
    },
    body: {
      de: `<ul>
        <li><strong>Kostenfaktor</strong> — Batterie = 40–50 % des Fahrzeugwerts; teuerste Einzelkomponente im EV.</li>
        <li><strong>BMS Black Box</strong> — herstellereigene SOH-Algorithmen, ±5–10 % Abweichung, nicht nachvollziehbar.</li>
        <li><strong>Kein Standard</strong> — keine einheitliche, herstellerübergreifende SOH-Definition.</li>
        <li><strong>Diagnose-Divergenz</strong> — verschiedene Tools liefern signifikant abweichende SOH-Werte für dasselbe Fahrzeug.</li>
        <li><strong>Second Life</strong> — unter 70–80 % EOL wird die Batterie für stationäre Speicher umgewidmet; eine belastbare Bewertung fehlt.</li>
      </ul>`,
      en: `<ul>
        <li><strong>Cost factor</strong> — battery = 40–50% of vehicle value; most expensive single EV component.</li>
        <li><strong>BMS black box</strong> — proprietary SOH algorithms, ±5–10% deviation, not traceable.</li>
        <li><strong>No standard</strong> — no unified, cross-manufacturer SOH definition.</li>
        <li><strong>Diagnostic divergence</strong> — different tools deliver significantly different SOH values for the same vehicle.</li>
        <li><strong>Second life</strong> — below 70–80% EOL, batteries are repurposed for stationary storage; a reliable assessment is missing.</li>
      </ul>`,
    },
    takeaway: {
      de: 'Beim Gebrauchtfahrzeugkauf kann der Batteriezustand nicht zuverlässig bewertet werden — ein reproduzierbares, herstellerunabhängiges Verfahren fehlt.',
      en: 'When buying a used EV, battery condition cannot be reliably assessed — a reproducible, manufacturer-independent method is missing.',
    },
  },

  // ========================================================================
  // 4 · GAP & CONTRIBUTIONS
  // ========================================================================
  {
    id: 'gap-contributions',
    type: 'standard',
    section: { de: 'Motivation', en: 'Motivation' },
    slideNumber: 4,
    headline: { de: 'Forschungslücke & Beitrag dieser Arbeit', en: 'Research Gap & Contribution of This Work' },
    body: {
      de: `<h3>Forschungslücke</h3>
        <p>BMS-Algorithmen sind proprietär (±5–10 % Abweichung), externe Diagnosesysteme liefern abweichende Werte, und die meisten Studien nutzen Laborzellen — eine standardisierte, reproduzierbare Methodik am realen Fahrzeug fehlt.</p>
        <h3>Forschungsfrage</h3>
        <p>Wie kann der State of Health von Traktionsbatterien reproduzierbar und praxistauglich mittels On-Board- und Off-Board-Diagnostik bestimmt werden?</p>
        <h3>Beitrag</h3>
        <ul>
          <li><strong>B1 · Systematische Evaluation</strong> — Vergleich zweier Hauptdiagnosesysteme (AVL HV-Check + OBDLink MX+) ergänzt durch AUTEL-Snapshot, am realen MEB-Fahrzeug.</li>
          <li><strong>B2 · Messprotokoll</strong> — standardisiertes Entlade-/Ladeprotokoll mit praxisorientierten Empfehlungen für den Werkstattalltag.</li>
          <li><strong>B3 · Software & Methoden</strong> — sechs SOH-Berechnungsmethoden in einer Python-Streamlit-App mit PDF-Bericht und SQLite-Persistenz.</li>
          <li><strong>B4 · Einflussfaktoren</strong> — Quantifizierung der Auswirkungen von Temperatur, SOC-Fenster und Ladeleistung auf die SOH-Bestimmung.</li>
        </ul>`,
      en: `<h3>Research gap</h3>
        <p>BMS algorithms are proprietary (±5–10% deviation), external diagnostics deliver divergent values, and most studies use lab cells — a standardized, reproducible methodology on real vehicles is missing.</p>
        <h3>Research question</h3>
        <p>How can the State of Health of traction batteries be determined reproducibly and practically using on-board and off-board diagnostics?</p>
        <h3>Contribution</h3>
        <ul>
          <li><strong>C1 · Systematic evaluation</strong> — comparison of two primary diagnostic systems (AVL HV-Check + OBDLink MX+) supplemented by AUTEL snapshot, on a real MEB vehicle.</li>
          <li><strong>C2 · Measurement protocol</strong> — standardized discharge/charge protocol with practice-oriented recommendations for workshops.</li>
          <li><strong>C3 · Software & methods</strong> — six SOH calculation methods in a Python Streamlit app with PDF reporting and SQLite persistence.</li>
          <li><strong>C4 · Influencing factors</strong> — quantification of temperature, SOC window and charging power effects on SOH determination.</li>
        </ul>`,
    },
  },

  // ========================================================================
  // 5 · BATTERY BASICS + AGING
  // ========================================================================
  {
    id: 'battery-basics',
    type: 'standard',
    section: { de: 'Theorie', en: 'Theory' },
    slideNumber: 5,
    headline: {
      de: 'Li-Ionen-Batterien altern durch kalendarische und zyklische Degradation',
      en: 'Li-ion batteries age through calendar and cyclic degradation',
    },
    body: {
      de: `<h3>Kalendarische Alterung</h3>
        <ul>
          <li>SEI-Wachstum → Verlust von Lithium-Inventar (LLI)</li>
          <li>Kathoden-Degradation → Metallionen-Auflösung → LAM</li>
          <li>Elektrolyt-Zersetzung → Kapazitätsverlust</li>
          <li>Arrhenius-Verhalten: T↑ = exponentiell schnellere Alterung</li>
        </ul>
        <h3>Zyklische Alterung</h3>
        <ul>
          <li>Volumenänderung → Partikelriss → LAM</li>
          <li>Lithium-Plating → Dendriten → interner Kurzschluss</li>
          <li>Große Entladetiefe (DoD) → stärkere mechanische Belastung</li>
          <li>Hohe C-Rate + niedrige Temp. + hoher SOC beschleunigen Alterung</li>
        </ul>
        <p><em>Testfahrzeug VW ID.4:</em> NMC 712 Pouch-Zellen · 288 Zellen (12 Module × 24) · 77 kWh brutto / 72 kWh netto · 300–408 V.</p>`,
      en: `<h3>Calendar aging</h3>
        <ul>
          <li>SEI growth → Loss of Lithium Inventory (LLI)</li>
          <li>Cathode degradation → metal ion dissolution → LAM</li>
          <li>Electrolyte decomposition → capacity loss</li>
          <li>Arrhenius behavior: T↑ = exponentially faster aging</li>
        </ul>
        <h3>Cyclic aging</h3>
        <ul>
          <li>Volume change → particle cracking → LAM</li>
          <li>Lithium plating → dendrites → internal short circuit</li>
          <li>Large depth of discharge (DoD) → stronger mechanical stress</li>
          <li>High C-rate + low temp. + high SOC accelerate aging</li>
        </ul>
        <p><em>Test vehicle VW ID.4:</em> NMC 712 pouch cells · 288 cells (12 modules × 24) · 77 kWh gross / 72 kWh net · 300–408 V.</p>`,
    },
  },

  // ========================================================================
  // 6 · SOH DEFINITIONS
  // ========================================================================
  {
    id: 'soh-definitions',
    type: 'standard',
    section: { de: 'Theorie', en: 'Theory' },
    slideNumber: 6,
    headline: {
      de: 'Fünf komplementäre SOH-Methoden erfassen unterschiedliche Aspekte der Batteriealterung',
      en: 'Five complementary SOH methods capture different aspects of battery aging',
    },
    body: {
      de: `<div class="formula-row"><strong>Kapazitätsbasiert · SOH<sub>cap</sub></strong> <span class="formula-note">(BMS-Direktwert)</span>
          $$\\text{SOH}_{\\text{cap}} = \\frac{E_{\\text{aktuell}}}{E_{\\text{nenn}}} \\times 100\\%$$</div>
        <div class="formula-row"><strong>Energiebasiert · SOH<sub>e</sub></strong> <span class="formula-note">genaueste Einzelmethode</span>
          $$\\text{SOH}_e = \\frac{\\int_0^T V(t)\\cdot|I(t)|\\,dt}{E_{\\text{nenn}}} \\times 100\\%$$</div>
        <div class="formula-row"><strong>Coulomb-Counting · SOH<sub>c</sub></strong>
          $$\\text{SOH}_c = \\frac{\\int_0^T |I(t)|\\,dt}{Q_{\\text{nenn}}} \\times 100\\%$$</div>
        <div class="formula-row"><strong>Widerstandsbasiert · SOH<sub>R</sub></strong> <span class="formula-note">HPPC = Hybrid Pulse Power Characterization</span>
          $$\\text{SOH}_R = \\frac{R_{i,\\text{Baseline}}}{R_{i,\\text{aktuell}}} \\times 100\\%$$</div>
        <div class="formula-row"><strong>Kombiniert · SOH<sub>komb</sub></strong> <span class="formula-note">empfohlen</span>
          $$\\text{SOH}_{\\text{komb}} = \\frac{\\text{SOH}_e + \\text{SOH}_c}{2}$$</div>
        <p>Jede Methode hat eigene Stärken und Fehlerquellen — die Kombination kompensiert systematische Fehler einzelner Methoden.</p>`,
      en: `<div class="formula-row"><strong>Capacity-based · SOH<sub>cap</sub></strong> <span class="formula-note">(BMS direct)</span>
          $$\\text{SOH}_{\\text{cap}} = \\frac{E_{\\text{current}}}{E_{\\text{nominal}}} \\times 100\\%$$</div>
        <div class="formula-row"><strong>Energy-based · SOH<sub>e</sub></strong> <span class="formula-note">most accurate single method</span>
          $$\\text{SOH}_e = \\frac{\\int_0^T V(t)\\cdot|I(t)|\\,dt}{E_{\\text{nominal}}} \\times 100\\%$$</div>
        <div class="formula-row"><strong>Coulomb counting · SOH<sub>c</sub></strong>
          $$\\text{SOH}_c = \\frac{\\int_0^T |I(t)|\\,dt}{Q_{\\text{nominal}}} \\times 100\\%$$</div>
        <div class="formula-row"><strong>Resistance-based · SOH<sub>R</sub></strong> <span class="formula-note">HPPC = Hybrid Pulse Power Characterization</span>
          $$\\text{SOH}_R = \\frac{R_{i,\\text{baseline}}}{R_{i,\\text{current}}} \\times 100\\%$$</div>
        <div class="formula-row"><strong>Combined · SOH<sub>comb</sub></strong> <span class="formula-note">recommended</span>
          $$\\text{SOH}_{\\text{comb}} = \\frac{\\text{SOH}_e + \\text{SOH}_c}{2}$$</div>
        <p>Each method has unique strengths and error sources — the combination cancels systematic errors of individual methods.</p>`,
    },
  },

  // ========================================================================
  // 7 · TOOLS
  // ========================================================================
  {
    id: 'tools',
    type: 'standard',
    section: { de: 'Methodik', en: 'Methodology' },
    slideNumber: 7,
    headline: {
      de: 'Zwei Hauptdiagnosesysteme decken Snapshot- und Zeitreihen-Diagnostik ab — AUTEL ergänzend',
      en: 'Two primary diagnostic systems cover snapshot and time-series diagnostics — AUTEL supplementary',
    },
    body: {
      de: `<h3>3-Ebenen-Modell</h3>
        <ul>
          <li><strong>Ebene 1 — Fahrzeugintern (BMS):</strong> proprietäre SOH-Berechnung, ±5–10 % Abweichung.</li>
          <li><strong>Ebene 2 — On-Board-Datenerfassung:</strong> AVL HV-Check + OBDLink MX+ lesen über OBD-II aus dem BMS aus.</li>
          <li><strong>Ebene 3 — Nachgelagerte Auswertung:</strong> Diese Arbeit — sechs SOH-Methoden in der Python-App.</li>
        </ul>
        <h3>Diagnosesysteme</h3>
        <ul>
          <li><strong>AVL HV-Check</strong> — Hauptsystem · Snapshot-Referenz · PDF-Bericht · ~70 €/Jahr (Lizenz).</li>
          <li><strong>OBDLink MX+</strong> — Hauptsystem · kontinuierliche Zeitreihe (CSV) · ~130 € einmalig — keine Folgekosten.</li>
          <li><strong>AUTEL MaxiSYS Ultra</strong> — <em>ergänzend</em> · Snapshot-Vergleich · ~8.000 €.</li>
        </ul>`,
      en: `<h3>Three-tier model</h3>
        <ul>
          <li><strong>Tier 1 — In-vehicle (BMS):</strong> proprietary SOH calculation, ±5–10% deviation.</li>
          <li><strong>Tier 2 — On-board data acquisition:</strong> AVL HV-Check + OBDLink MX+ read from BMS via OBD-II.</li>
          <li><strong>Tier 3 — Post-processing:</strong> this work — six SOH methods in the Python app.</li>
        </ul>
        <h3>Diagnostic systems</h3>
        <ul>
          <li><strong>AVL HV-Check</strong> — primary · snapshot reference · PDF report · ~€70/year (license).</li>
          <li><strong>OBDLink MX+</strong> — primary · continuous time series (CSV) · ~€130 one-off — no recurring costs.</li>
          <li><strong>AUTEL MaxiSYS Ultra</strong> — <em>supplementary</em> · snapshot comparison · ~€8,000.</li>
        </ul>`,
    },
    takeaway: {
      de: 'OBDLink liefert das, was AVL nicht kann: kontinuierliche Daten — bei einem Bruchteil der Kosten.',
      en: 'OBDLink delivers what AVL cannot: continuous data — at a fraction of the cost.',
    },
  },

  // ========================================================================
  // 8 · PROTOCOL (5-step measurement protocol)
  // ========================================================================
  {
    id: 'protocol',
    type: 'standard',
    section: { de: 'Methodik', en: 'Methodology' },
    slideNumber: 8,
    headline: {
      de: 'Das standardisierte Messprotokoll definiert 5 Phasen für reproduzierbare SOH-Bestimmung',
      en: 'The standardized measurement protocol defines 5 phases for reproducible SOH determination',
    },
    body: {
      de: `<ol>
          <li><strong>Vorbereitung</strong> — Entladung auf ~0 % SOC (Display), Umgebungstemperatur dokumentieren, Kilometerstand notieren.</li>
          <li><strong>OBD2-Verbindungsaufbau</strong> — OBDLink MX+ in OBD-Port → Bluetooth → Car Scanner Pro App → alle BMS-PIDs (SOC, U, I, 96 Zellspannungen, 24 Temperatursensoren).</li>
          <li><strong>Ladevorgang</strong> — Aufzeichnung starten <em>vor</em> Ladebeginn → CCS/AC-Ladung 0 → 100 % SOC, ~1 s Abtastrate, kontinuierliches Logging.</li>
          <li><strong>Datenexport</strong> — Aufzeichnung stoppen → CSV-Export (zeitgestempelte Messwerte aller Parameter).</li>
          <li><strong>Analyse</strong> — CSV in Python-App laden, ggf. AVL-PDF als Referenz importieren → automatische Berechnung aller SOH-Methoden.</li>
        </ol>`,
      en: `<ol>
          <li><strong>Preparation</strong> — discharge to ~0% SOC (display), document ambient temperature, record odometer.</li>
          <li><strong>OBD2 connection setup</strong> — OBDLink MX+ into OBD port → Bluetooth → Car Scanner Pro app → all BMS PIDs (SOC, V, I, 96 cell voltages, 24 temperature sensors).</li>
          <li><strong>Charging process</strong> — start recording <em>before</em> charging begins → CCS/AC charging 0 → 100% SOC, ~1 s sampling rate, continuous logging.</li>
          <li><strong>Data export</strong> — stop recording → CSV export (timestamped values of all parameters).</li>
          <li><strong>Analysis</strong> — load CSV into Python app, optionally import AVL PDF reference → automatic calculation of all SOH methods.</li>
        </ol>`,
    },
  },

  // ========================================================================
  // 9 · DISCHARGE (entladung detail)
  // ========================================================================
  {
    id: 'discharge',
    type: 'standard',
    section: { de: 'Methodik', en: 'Methodology' },
    slideNumber: 9,
    headline: {
      de: 'Protokoll-Detail: Entladung bis Display-SOC = 0 % — anschließend CC-CV-Ladung bis 100 %',
      en: 'Protocol detail: discharge to display SOC = 0% — followed by CC-CV charge to 100%',
    },
    body: {
      de: `<h3>Entladephase (Phase 1)</h3>
        <ol>
          <li><strong>Ausgangszustand</strong> — Fahrzeug bei beliebigem SOC; keine Vorbedingung nötig.</li>
          <li><strong>Normale Fahrt</strong> — fahren bis Display-SOC ≈ 0 %; keine Sondermodi erforderlich.</li>
          <li><strong>Batterie-Warnung</strong> — Warnmeldung im Fahrzeug, Leistungsreduzierung, Fahrzeug sicher abstellen.</li>
          <li><strong>Dokumentation</strong> — Umgebungstemperatur (15–30 °C), km-Stand und Zeitstempel notieren.</li>
          <li><strong>Messbereit</strong> — Display-SOC = 0 % (BMS-SOC ≈ 5,75 %) — Ladung kann nun gestartet werden.</li>
        </ol>
        <h3>Ladephase (CC-CV)</h3>
        <p>Konstantstrom (CC) bis ca. 4,2 V Zellspannung → Konstantspannung (CV), bis Strom unter Cutoff fällt. Liefert die Daten für alle SOH-Methoden in einem Durchgang.</p>`,
      en: `<h3>Discharge phase (Phase 1)</h3>
        <ol>
          <li><strong>Initial state</strong> — vehicle at arbitrary SOC; no precondition needed.</li>
          <li><strong>Normal driving</strong> — drive until display SOC ≈ 0%; no special modes required.</li>
          <li><strong>Battery warning</strong> — warning message in vehicle, power reduction, park vehicle safely.</li>
          <li><strong>Documentation</strong> — record ambient temperature (15–30 °C), odometer reading and timestamp.</li>
          <li><strong>Ready</strong> — display SOC = 0% (BMS SOC ≈ 5.75%) — charging can now begin.</li>
        </ol>
        <h3>Charging phase (CC-CV)</h3>
        <p>Constant current (CC) up to ~4.2 V cell voltage → constant voltage (CV) until current drops below cutoff. Delivers data for all SOH methods in a single pass.</p>`,
    },
    takeaway: {
      de: 'Display-SOC = 0 % entspricht BMS-SOC ≈ 5,75 % — das nutzbare Fenster beträgt ca. 90 % der physikalischen Kapazität.',
      en: 'Display SOC = 0% corresponds to BMS SOC ≈ 5.75% — the usable window covers approx. 90% of physical capacity.',
    },
  },

  // ========================================================================
  // 10 · VEHICLES
  // ========================================================================
  {
    id: 'vehicles',
    type: 'vehicle-cards',
    section: { de: 'Methodik', en: 'Methodology' },
    slideNumber: 10,
    headline: {
      de: 'MEB-Plattform: VW ID.4 als Primärfahrzeug — Verifikation an Skoda Elroq + Cupra Born',
      en: 'MEB platform: VW ID.4 as primary vehicle — verification on Skoda Elroq + Cupra Born',
    },
    headlineMetric: {
      num: '33',
      text: { de: 'Einzelmessungen · Dez 2024 – Dez 2025 · MEB-Plattform', en: 'individual measurements · Dec 2024 – Dec 2025 · MEB platform' },
    },
    primary: {
      label: { de: 'Primärfahrzeug', en: 'Primary vehicle' },
      name: 'VW ID.4 (IfE)',
      badges: [
        { text: '77 kWh', accent: true },
        { text: 'NMC 712' },
        { text: { de: '288 Zellen', en: '288 cells' } },
        { text: 'MEB' },
        { text: '10.801 km' },
        { text: 'SOH 97,3 %', accent: true },
      ],
    },
    diagSystems: {
      heading: { de: 'Diagnosesysteme', en: 'Diagnostic Systems' },
      systems: [
        { name: 'AVL HV-Check', role: { de: 'Hauptsystem', en: 'Primary' }, color: 'var(--success)' },
        { name: 'OBDLink MX+', role: { de: 'Hauptsystem', en: 'Primary' }, color: 'var(--chart-blue)' },
        { name: 'AUTEL MaxiSYS Ultra', role: { de: 'ergänzend', en: 'supplementary' }, color: '#9F7AEA', em: true },
      ],
    },
    verification: {
      heading: { de: 'MEB-Verifikation', en: 'MEB verification' },
      cards: [
        { name: 'Skoda Elroq (IfE)', stats: '7 AVL · σ = 0 % · 12.572 km', note: { de: 'Reproduzierbarkeit perfekt über 9 Monate', en: 'Perfect reproducibility over 9 months' } },
        { name: 'Cupra Born', stats: '1 AVL · 1 OBD · SOH 93,5 %', note: { de: 'ergänzende Plattform-Übertragbarkeit', en: 'supplementary platform transferability' } },
      ],
    },
  },

  // ========================================================================
  // 11 · PIPELINE
  // ========================================================================
  {
    id: 'pipeline',
    type: 'standard',
    section: { de: 'Methodik', en: 'Methodology' },
    slideNumber: 11,
    headline: {
      de: 'Ebene 3 — nachgelagerte Auswertung: sechs Methoden konvergieren zum kombinierten SOH',
      en: 'Level 3 — post-processing: six methods converge into a combined SOH value',
    },
    body: {
      de: `<p>Aus einer einzigen CSV-Aufzeichnung (Spannung, Strom, SOC, Zellspannungen, Temperaturen) berechnet die Python-App parallel sechs SOH-Methoden:</p>
        <ul>
          <li><strong>SOH<sub>cap</sub></strong> — Kapazität (BMS direkt)</li>
          <li><strong>SOH<sub>e</sub></strong> — Energie (Integration)</li>
          <li><strong>SOH<sub>c</sub></strong> — Coulomb-Counting</li>
          <li><strong>SOH<sub>R</sub></strong> — Widerstand (HPPC)</li>
          <li><strong>SOH<sub>OCV</sub></strong> — OCV-Kennlinie</li>
          <li><strong>SOH<sub>komb</sub></strong> — kombiniert (Konsensuswert)</li>
        </ul>
        <p>Jede Methode hat eigene Datenanforderungen und Fehlerquellen. Die Konvergenz auf einen gemeinsamen Mittelwert ist der eigentliche Robustheitsbeweis.</p>`,
      en: `<p>From a single CSV recording (voltage, current, SOC, cell voltages, temperatures), the Python app calculates six SOH methods in parallel:</p>
        <ul>
          <li><strong>SOH<sub>cap</sub></strong> — capacity (BMS direct)</li>
          <li><strong>SOH<sub>e</sub></strong> — energy (integration)</li>
          <li><strong>SOH<sub>c</sub></strong> — Coulomb counting</li>
          <li><strong>SOH<sub>R</sub></strong> — resistance (HPPC)</li>
          <li><strong>SOH<sub>OCV</sub></strong> — OCV curve</li>
          <li><strong>SOH<sub>comb</sub></strong> — combined (consensus value)</li>
        </ul>
        <p>Each method has its own data requirements and error sources. Convergence to a common mean is the actual robustness proof.</p>`,
    },
  },

  // ========================================================================
  // 12 · METHOD COMPARISON (stats)
  // ========================================================================
  {
    id: 'method-comparison',
    type: 'stats',
    section: { de: 'Ergebnisse', en: 'Results' },
    slideNumber: 12,
    headline: {
      de: 'Sechs SOH-Methoden zeigen eine Streuung von 10,3 Pp — der kombinierte Wert liegt im Zentrum',
      en: 'Six SOH methods show a spread of 10.3 pp — the combined value lies at the center',
    },
    claim: {
      de: 'Keine Einzelmethode liefert den „wahren" SOH. Die Kombination <span class="accent-text">(SOH<sub>e</sub> + SOH<sub>c</sub>) / 2 = 95,7 %</span> liegt nahe am AVL-Ergebnis von <span class="success-text">97,3 %</span> — bei 10,3 Pp Streuung der Einzelmethoden.',
      en: 'No single method delivers the "true" SOH. The combined value <span class="accent-text">(SOH<sub>e</sub> + SOH<sub>c</sub>) / 2 = 95.7%</span> sits close to the AVL result of <span class="success-text">97.3%</span> — across a 10.3 pp single-method spread.',
    },
    stats: [
      { value: '95,7 %', tone: 'success', label: { de: 'SOH kombiniert', en: 'Combined SOH' }, sub: { de: '(e + c) / 2', en: '(e + c) / 2' } },
      { value: '10,3 Pp', tone: 'warn', label: { de: 'Methodenstreuung', en: 'Method spread' }, sub: { de: 'min ↔ max der 6 Methoden', en: 'min ↔ max of the 6 methods' } },
      { value: '97,3 %', tone: 'blue', label: 'AVL HV-Check', sub: { de: 'Off-Board-Referenz', en: 'Off-board reference' } },
    ],
  },

  // ========================================================================
  // 13 · REPRODUCIBILITY (stats)
  // ========================================================================
  {
    id: 'reproducibility',
    type: 'stats',
    section: { de: 'Ergebnisse', en: 'Results' },
    slideNumber: 13,
    headline: {
      de: 'Algorithmische Reproduzierbarkeit ist exzellent — nur 0,2 Pp Streuung über 3 Durchläufe',
      en: 'Algorithmic reproducibility is excellent — only 0.2 pp spread across 3 runs',
    },
    claim: {
      de: 'Derselbe Datensatz, dreimal unabhängig analysiert, liefert <span class="success-text">SOH<sub>e</sub> vollständig deterministisch</span> und SOH<sub>c</sub> mit nur 0,3 Pp Drift. Die AVL-Messstreuung über 12 Monate ist mit σ = 1,20 % durch Fahrzeugzustand und Temperatur dominiert — nicht durch den Algorithmus.',
      en: 'The same dataset, analyzed three times independently, yields <span class="success-text">SOH<sub>e</sub> fully deterministic</span> and SOH<sub>c</sub> with only 0.3 pp drift. The AVL measurement scatter over 12 months at σ = 1.20% is dominated by vehicle state and temperature — not by the algorithm.',
    },
    stats: [
      { value: '0,2 Pp', tone: 'success', label: { de: 'Algorithmus-Drift', en: 'Algorithm drift' }, sub: { de: '3 Durchläufe, gleiche CSV', en: '3 runs, same CSV' } },
      { value: 'σ = 1,20 %', tone: 'blue', label: { de: 'AVL über 12 Monate', en: 'AVL over 12 months' }, sub: { de: '5 Messungen', en: '5 measurements' } },
      { value: 'σ = 0 %', tone: 'success', label: 'Skoda Elroq', sub: { de: '7 AVL-Messungen, 9 Monate', en: '7 AVL measurements, 9 months' } },
    ],
  },

  // ========================================================================
  // 14 · ICA / DVA
  // ========================================================================
  {
    id: 'ica-dva',
    type: 'standard',
    section: { de: 'Ergebnisse', en: 'Results' },
    slideNumber: 14,
    headline: {
      de: 'ICA-Analyse identifiziert charakteristische NMC-712-Peaks — Grundlage für Langzeit-Degradationsmonitoring',
      en: 'ICA analysis identifies characteristic NMC 712 peaks — foundation for long-term degradation monitoring',
    },
    body: {
      de: `<h3>Drei Analysetechniken</h3>
        <ul>
          <li><strong>OCV-Kennlinie</strong> — Spannungsbereich ~325 V → ~397 V, SOC-Fenster 5,2 % – 96,0 % (90,8 Pp); S-förmig, NMC-typisch.</li>
          <li><strong>ICA · dQ/dV vs. V</strong> — automatische Peakerkennung (SciPy); Zuordnung zu Graphit-Anode + NMC-Kathode; Position + Höhe + FWHM in DB gespeichert.</li>
          <li><strong>DVA · dV/dQ vs. Q</strong> — Information aus Spannungsplateaus, Validierung gegen NMC-712-Referenzwerte.</li>
        </ul>
        <h3>Was die Peaks erzählen</h3>
        <ul>
          <li><strong>LLI</strong> — Verlust von Lithium-Inventar: Peakhöhe ↓ + Peakverschiebung zu höheren Spannungen.</li>
          <li><strong>LAM<sub>NE</sub></strong> — Verlust aktives Anodenmaterial: Abschwächung der Graphit-Staging-Peaks.</li>
          <li><strong>LAM<sub>PE</sub></strong> — Verlust aktives Kathodenmaterial: Reduktion der Peaks nahe 4 V.</li>
          <li><em>Limitation:</em> keine Peakverschiebung nachweisbar — das Fahrzeug zeigt keine signifikante Degradation. Langzeitmessungen erforderlich.</li>
        </ul>`,
      en: `<h3>Three analysis techniques</h3>
        <ul>
          <li><strong>OCV curve</strong> — voltage range ~325 V → ~397 V, SOC window 5.2% – 96.0% (90.8 pp); S-shaped, NMC-typical.</li>
          <li><strong>ICA · dQ/dV vs. V</strong> — automatic peak detection (SciPy); assignment to graphite anode + NMC cathode; position + height + FWHM stored in DB.</li>
          <li><strong>DVA · dV/dQ vs. Q</strong> — information from voltage plateaus, validation against NMC 712 reference values.</li>
        </ul>
        <h3>What the peaks reveal</h3>
        <ul>
          <li><strong>LLI</strong> — Loss of Lithium Inventory: peak height ↓ + shift to higher voltages.</li>
          <li><strong>LAM<sub>NE</sub></strong> — Loss of Active Anode Material: weakening of graphite staging peaks.</li>
          <li><strong>LAM<sub>PE</sub></strong> — Loss of Active Cathode Material: reduction of peaks near 4 V.</li>
          <li><em>Limitation:</em> no peak shift detectable — vehicle shows no significant degradation. Long-term measurements required.</li>
        </ul>`,
    },
    takeaway: {
      de: 'ICA/DVA-Infrastruktur steht — Peakpositionen werden für künftiges Degradationstracking in der Datenbank gespeichert.',
      en: 'ICA/DVA infrastructure is in place — peak positions are stored in the database for future degradation tracking.',
    },
  },

  // ========================================================================
  // 15 · DISCUSSION
  // ========================================================================
  {
    id: 'discussion',
    type: 'standard',
    section: { de: 'Diskussion', en: 'Discussion' },
    slideNumber: 15,
    headline: { de: 'Stärken, Limitationen & Reflexion der Ergebnisse', en: 'Strengths, Limitations & Reflection' },
    body: {
      de: `<h3>Stärken</h3>
        <ul>
          <li><strong>±1,6 Pp</strong> — reproduzierbarer SOH mit OBDLink (Consumer-OBD) vs. AVL HV-Check Referenz am VW ID.4.</li>
          <li><strong>3 × MEB</strong> — verifiziert an Skoda Elroq (σ = 0 % über 7 AVL-Messungen) und Cupra Born (ergänzend).</li>
          <li><strong>0,1 Pp</strong> — kombinierte Methode robust gegen Temperatur (9–19 °C); gegenläufige Effekte kompensieren sich.</li>
          <li><strong>3-Tier-Kosten</strong> — AUTEL ~8.000 € · AVL ~70 €/Jahr · OBDLink ~130 € einmalig. OBDLink-Mehrwert: kontinuierliche Daten + keine Folgekosten.</li>
          <li><strong>Werkstatt-tauglich</strong> — automatisierte Python-App mit 6 SOH-Methoden.</li>
        </ul>
        <h3>Limitationen & Reflexion</h3>
        <ul>
          <li><strong>MEB-fokussiert</strong> — nur 3 MEB-Fahrzeuge; BMW i3s nur kontextuelle Vergleichsmessung; LFP/Tesla offen.</li>
          <li><strong>Nur AC</strong> — keine DC-Schnellladedaten; Effekte hoher C-Raten (&gt; 50 kW) nicht untersucht.</li>
          <li><strong>SOH &gt; 97 %</strong> — keine signifikante Alterung im Messzeitraum; Empfindlichkeit bei stark gealterten Akkus offen.</li>
          <li><strong>±4,6 Pp</strong> — Gesamtunsicherheit der OBD-SOH-Bestimmung; dominiert durch Methodenstreuung und SOC-Fenster.</li>
          <li><strong>Keine ISO-Validierung</strong> — kein unabhängiger Laborabgleich (ISO 12405); Vergleich nur gegen kommerzielle Referenz.</li>
        </ul>`,
      en: `<h3>Strengths</h3>
        <ul>
          <li><strong>±1.6 pp</strong> — reproducible SOH with OBDLink (consumer OBD) vs. AVL HV-Check reference on VW ID.4.</li>
          <li><strong>3 × MEB</strong> — verified on Skoda Elroq (σ = 0% over 7 AVL measurements) and Cupra Born (supplementary).</li>
          <li><strong>0.1 pp</strong> — combined method robust against temperature (9–19 °C); opposing effects cancel out.</li>
          <li><strong>3-tier cost</strong> — AUTEL ~€8,000 · AVL ~€70/year · OBDLink ~€130 one-off. OBDLink advantage: continuous data + no recurring costs.</li>
          <li><strong>Workshop-ready</strong> — automated Python app with 6 SOH methods.</li>
        </ul>
        <h3>Limitations & reflection</h3>
        <ul>
          <li><strong>MEB-focused</strong> — only 3 MEB vehicles; BMW i3s only contextual comparison; LFP/Tesla open.</li>
          <li><strong>AC only</strong> — no DC fast charging data; effects of high C-rates (&gt; 50 kW) not investigated.</li>
          <li><strong>SOH &gt; 97%</strong> — no significant aging in measurement period; sensitivity for strongly aged batteries open.</li>
          <li><strong>±4.6 pp</strong> — total uncertainty of OBD SOH determination; dominated by method spread and SOC window.</li>
          <li><strong>No ISO validation</strong> — no independent lab comparison (ISO 12405); comparison only against commercial reference.</li>
        </ul>`,
    },
  },

  // ========================================================================
  // 16 · CONCLUSION (stats — Kernaussage)
  // ========================================================================
  {
    id: 'conclusion',
    type: 'stats',
    section: { de: 'Fazit', en: 'Conclusion' },
    slideNumber: 16,
    headline: { de: 'Kernaussage', en: 'Core Finding' },
    claim: {
      de: 'Die Kombination von energiebasierter und integrativer SOH-Methode ermöglicht eine <span class="accent-text">reproduzierbare Bestimmung des Batteriezustands</span> mit einem kostengünstigen OBD-Adapter (~130 € einmalig) bei einer Abweichung von nur <span class="success-text">±1,6 Prozentpunkten</span> zur professionellen Off-Board-Referenz — verifiziert auf der MEB-Plattform.',
      en: 'The combination of energy-based and integrative SOH methods enables <span class="accent-text">reproducible battery health determination</span> with a low-cost OBD adapter (~€130 one-off) at a deviation of only <span class="success-text">±1.6 percentage points</span> from the professional off-board reference — verified on the MEB platform.',
    },
    stats: [
      { value: '95,7 %', tone: 'success', label: { de: 'SOH kombiniert', en: 'Combined SOH' }, sub: { de: 'vs. AVL 97,3 %', en: 'vs. AVL 97.3%' } },
      { value: '0,1 Pp', tone: 'blue', label: { de: 'Temperaturrobustheit', en: 'Temperature robustness' }, sub: { de: '9,8 °C – 19 °C', en: '9.8 °C – 19 °C' } },
      { value: '1,6 Pp', tone: 'success', label: { de: 'AVL ↔ OBD', en: 'AVL ↔ OBD' }, sub: { de: 'VW ID.4 · MEB-Verif. Elroq + Born', en: 'VW ID.4 · MEB verif. Elroq + Born' } },
    ],
  },

  // ========================================================================
  // 17 · OUTLOOK
  // ========================================================================
  {
    id: 'outlook',
    type: 'standard',
    section: { de: 'Ausblick', en: 'Outlook' },
    slideNumber: 17,
    headline: { de: 'Anwendungen & Ausblick', en: 'Applications & Outlook' },
    body: {
      de: `<h3>Praxisanwendungen</h3>
        <ul>
          <li><strong>Werkstätten</strong> — standardisierte SOH-Prüfung mit OBD-Adapter + Python-App.</li>
          <li><strong>Flottenbetreiber</strong> — Langzeit-Monitoring und Degradationsvorhersage.</li>
          <li><strong>Versicherungen</strong> — objektive Batteriebewertung für Restwertbestimmung.</li>
          <li><strong>Second Life</strong> — Klassifizierung A (≥ 90 %) · B (80–89 %) · C (70–79 %) · D (&lt; 70 %).</li>
        </ul>
        <h3>Zukünftige Forschung</h3>
        <ul>
          <li><strong>Erweiterung auf weitere Plattformen</strong> (BMW i3s, Tesla, LFP-Chemie) — Methoden bleiben gleich, nur PIDs/Kanäle anpassen.</li>
          <li><strong>Temperaturkorrektur</strong> (z. B. Arrhenius-Modell) für SOH-Werte unter 15 °C.</li>
          <li><strong>DC-Schnelllade-Messungen</strong> (hohe C-Rate-Effekte).</li>
          <li><strong>Gealterte Fahrzeuge</strong> (50k–150k km) für ICA/DVA-Validierung.</li>
          <li><strong>ML-basierte Korrektur</strong> — Ridge / Random-Forest auf AVL-Referenz.</li>
          <li><strong>EU-Batteriepass</strong> — Verordnung 2023/1542, ab 2027 verpflichtend.</li>
        </ul>`,
      en: `<h3>Practical applications</h3>
        <ul>
          <li><strong>Workshops</strong> — standardized SOH testing with OBD adapter + Python app.</li>
          <li><strong>Fleet operators</strong> — long-term monitoring and degradation prediction.</li>
          <li><strong>Insurance</strong> — objective battery assessment for residual value determination.</li>
          <li><strong>Second life</strong> — classification A (≥ 90%) · B (80–89%) · C (70–79%) · D (&lt; 70%).</li>
        </ul>
        <h3>Future research</h3>
        <ul>
          <li><strong>Extension to other platforms</strong> (BMW i3s, Tesla, LFP chemistry) — methods stay the same, only PIDs/channels need adjustment.</li>
          <li><strong>Temperature correction</strong> (e.g. Arrhenius model) for SOH values below 15 °C.</li>
          <li><strong>DC fast charging measurements</strong> (high C-rate effects).</li>
          <li><strong>Aged vehicles</strong> (50k–150k km) for ICA/DVA validation.</li>
          <li><strong>ML-based correction</strong> — Ridge / Random Forest on AVL reference.</li>
          <li><strong>EU Battery Passport</strong> — Regulation 2023/1542, mandatory from 2027.</li>
        </ul>`,
    },
  },

  // ========================================================================
  // 18 · THANKS
  // ========================================================================
  {
    id: 'thanks',
    type: 'hero',
    section: { de: 'Danke', en: 'Thanks' },
    slideNumber: 18,
    kicker: { de: 'Q & A', en: 'Q & A' },
    headline: { de: 'Vielen Dank für Ihre Aufmerksamkeit', en: 'Thank you for your attention' },
    qaInvite: { de: 'Ich freue mich auf Ihre Fragen', en: 'I look forward to your questions' },
    acknowledgments: {
      label: { de: 'Mein besonderer Dank gilt', en: 'My special thanks to' },
      list: [
        { name: 'Prof. Dr.-Ing. Kerstin Siebert', role: { de: 'Erstprüferin & Betreuung', en: 'First Examiner & Supervision' } },
        { name: 'Prof. Dr.-Ing. Michael Schugt', role: { de: 'Zweitbegutachtung', en: 'Second Review' } },
        { name: 'Simeon Kremzow-Tennie, M.Sc.', role: { de: 'fachliche Diskussionen am Institut für Elektromobilität', en: 'technical discussions at the Institute for Electromobility' } },
        { name: 'Benjamin Geiger, M.Sc.', role: { de: 'Unterstützung bei den Messungen am VW ID.4', en: 'support with measurements on the VW ID.4' } },
        { name: 'Maral Ghajarjazi, M.Sc.', role: { de: 'meine Frau — fachlicher Rat und Rückhalt während des gesamten Studiums', en: 'my wife — scientific advice and support throughout my studies' } },
      ],
    },
    meta: { author: 'Amirreza Roodsaz', date: '6. Mai 2026' },
  },

];
