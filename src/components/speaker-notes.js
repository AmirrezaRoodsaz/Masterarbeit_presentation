/**
 * Speaker Notes — bilingual content for the defense deck.
 * Structure per slide: time, bullets (de/en), script (de/en),
 * dataCallouts, questions [{q,a}], transition (de/en).
 *
 * Time budget: 15 minutes total (Phase 20 — defense 6. Mai 2026)
 *   Opening      0:30  (title, roadmap)
 *   Motivation   2:00  (problem, gap+contributions merged)
 *   Theory       1:30  (battery-basics, soh-definitions)
 *   Methodology  3:30  (tools, protocol, discharge, vehicles, pipeline)
 *   Results      5:00  (method-comparison, reproducibility, temperature,
 *                       ica-dva, demo-pro, demo-easy)
 *   Discussion   1:30  (discussion — Stärken, Limitationen & Reflexion)
 *   Conclusion   1:00  (conclusion, outlook, thanks)
 *
 * Demoted to backup (uncounted, available via dropdown for Q&A):
 *   slide-resistance, slide-failure, slide-intersystem (BMW i3s out
 *   of MEB scope), slide-community, slide-uncertainty, slide-charging,
 *   slide-flowchart-gallery (last position before backups for diagram
 *   jumping during Q&A).
 *
 * Removed entirely from main flow:
 *   slide-contributions (merged into slide-gap-contributions).
 */

export const SPEAKER_NOTES = {

  // ============================================================
  // SECTION 1: OPENING (1:30)
  // ============================================================

  'slide-title': {
    time: '0:00 – 0:30 (30 s)',
    bullets: {
      de: [
        'Begrüßung: „Sehr geehrte Prüfer, sehr geehrte Anwesende…"',
        'Titel vorlesen — Kernbegriffe betonen: reproduzierbar, On-Board, Off-Board',
        'Kurzer Blick auf QR-Code: Präsentation kann auf eigenen Geräten mitverfolgt werden',
      ],
      en: [
        'Greeting: "Dear examiners, dear attendees…"',
        'Read title — emphasize key terms: reproducible, on-board, off-board',
        'Brief note on QR code: presentation can be followed on own devices',
      ],
    },
    script: {
      de: 'Sehr geehrte Frau Professorin Siebert, sehr geehrter Herr Professor Schugt, sehr geehrte Anwesende — herzlich willkommen zu meinem Masterkolloquium. Mein Thema: Die Entwicklung reproduzierbarer Methoden zur Bestimmung des State of Health von Traktionsbatterien — sowohl mit On-Board- als auch Off-Board-Diagnosesystemen. Über den QR-Code können Sie die Präsentation auf Ihrem Gerät mitverfolgen.',
      en: 'Dear Professor Siebert, dear Professor Schugt, dear attendees — welcome to my master\'s thesis colloquium. My topic: The development of reproducible methods for determining the State of Health of traction batteries — using both on-board and off-board diagnostic systems. You can follow the presentation on your own device via the QR code.',
    },
    dataCallouts: [],
    questions: [],
    transition: {
      de: 'Beginnen wir mit der Agenda — fünf Themenbereiche in 15 Minuten.',
      en: 'Let\'s start with the agenda — five topic areas in 15 minutes.',
    },
  },

  'slide-roadmap': {
    time: '0:30 – 1:00 (30 s)',
    bullets: {
      de: [
        'Fünf Blöcke durchgehen: Motivation → Theorie → Methodik → Ergebnisse → Diskussion & Fazit',
        'Schwerpunkt liegt auf Ergebnissen (~5 Minuten) und Methodik (~3,5 Minuten)',
        'Am Ende zwei kurze Live-Demos der entwickelten Software',
      ],
      en: [
        'Walk through five blocks: Motivation → Theory → Methodology → Results → Discussion & Conclusion',
        'Focus on Results (~5 minutes) and Methodology (~3.5 minutes)',
        'Two short live demos of the developed software at the end',
      ],
    },
    script: {
      de: 'Ich habe die Präsentation in sechs Abschnitte gegliedert. Nach einer kurzen Motivation zur Problemstellung behandle ich die theoretischen Grundlagen der Batteriealterung und SOH-Definition. Der Schwerpunkt liegt dann auf der Methodik — drei Diagnosesysteme, ein standardisiertes Messprotokoll — und den Ergebnissen, wo ich sechs SOH-Berechnungsmethoden vergleiche. Abschließend ordne ich die Ergebnisse ein und formuliere Empfehlungen.',
      en: 'I have structured the presentation into six sections. After a brief motivation on the problem, I cover the theoretical foundations of battery aging and SOH definition. The focus then lies on methodology — three diagnostic systems, a standardized protocol — and results, where I compare six SOH calculation methods. Finally, I contextualize the findings and formulate recommendations.',
    },
    dataCallouts: [],
    questions: [],
    transition: {
      de: 'Beginnen wir mit der Motivation — warum ist dieses Thema relevant?',
      en: 'Let\'s begin with the motivation — why is this topic relevant?',
    },
  },

  // ============================================================
  // SECTION 2: MOTIVATION (3:30)
  // ============================================================

  'slide-problem': {
    time: '1:30 – 2:45 (75 s)',
    bullets: {
      de: [
        'Fünf Problemaspekte im Kreisdiagramm — Fragmente einzeln auslösen',
        '1. Kostenfaktor: Batterie = 40–50% des Fahrzeugwerts',
        '2. BMS Black Box: proprietäre Algorithmen, ±5–10% Abweichung',
        '3. Kein Standard: keine herstellerübergreifende SOH-Definition',
        '4. Diagnose-Divergenz: verschiedene Tools → verschiedene Werte',
        '5. Second Life: unter 70–80% EOL wird umgewidmet',
        'Kernproblem am Ende einblenden',
      ],
      en: [
        'Five problem aspects in cycle diagram — trigger fragments one by one',
        '1. Cost factor: battery = 40–50% of vehicle value',
        '2. BMS Black Box: proprietary algorithms, ±5–10% deviation',
        '3. No standard: no cross-manufacturer SOH definition',
        '4. Diagnostic divergence: different tools → different values',
        '5. Second Life: below 70–80% EOL, batteries are repurposed',
        'Show core problem at the end',
      ],
    },
    script: {
      de: 'Die Traktionsbatterie ist mit 40 bis 50 Prozent des Fahrzeugwerts die teuerste Einzelkomponente eines Elektrofahrzeugs. Dennoch ist ihr Zustand intransparent: Die SOH-Algorithmen der Hersteller sind proprietär und zeigen Abweichungen von bis zu 10 Prozentpunkten. Es gibt keine einheitliche, herstellerübergreifende SOH-Definition. Verschiedene Diagnosewerkzeuge liefern signifikant unterschiedliche Ergebnisse für dasselbe Fahrzeug. Und für Second-Life-Anwendungen — also die Umwidmung der Batterie als stationärer Speicher — fehlt eine verlässliche Bewertungsgrundlage. Das Kernproblem: Beim Kauf eines Gebrauchtfahrzeugs kann der Batteriezustand nicht zuverlässig bewertet werden.',
      en: 'The traction battery is the most expensive single component of an EV at 40 to 50 percent of vehicle value. Yet its condition remains opaque: manufacturers\' SOH algorithms are proprietary with up to 10 percentage points deviation. There is no unified, cross-manufacturer SOH definition. Different diagnostic tools deliver significantly different results for the same vehicle. And for second-life applications, a reliable assessment basis is missing. The core problem: when buying a used EV, battery condition cannot be reliably assessed.',
    },
    dataCallouts: [
      '40–50 % Fahrzeugwert / vehicle value',
      '±5–10 % BMS-Abweichung / BMS deviation',
      '70–80 % EOL-Schwelle / EOL threshold',
    ],
    questions: [
      {
        q: { de: 'Warum nicht einfach den BMS-SOH-Wert verwenden?', en: 'Why not just use the BMS SOH value?' },
        a: { de: 'BMS-Algorithmen sind proprietär, nicht transparent und weisen laut Literatur Abweichungen von ±5–10% auf (Waag 2014). Außerdem variiert die Berechnung herstellerspezifisch — ein Vergleich ist nicht möglich.', en: 'BMS algorithms are proprietary, not transparent, and show ±5–10% deviations according to literature (Waag 2014). Additionally, calculation varies by manufacturer — comparison is impossible.' },
      },
    ],
    transition: {
      de: 'Daraus ergibt sich die Forschungslücke, die ich nun genauer beschreibe.',
      en: 'This leads to the research gap, which I will now describe in more detail.',
    },
  },

  // Phase 20: slide-gap + slide-contributions merged into one slide
  'slide-gap-contributions': {
    time: '2:00 – 3:00 (60 s)',
    bullets: {
      de: [
        'Forschungslücke kompakt: BMS proprietär ±5–10 %, externe Diagnostik abweichend, Studien auf Laborzellen',
        'Forschungsfrage prominent: reproduzierbar + praxistauglich + On-/Off-Board',
        'Vier Beiträge in einer Reihe: B1 Evaluation, B2 Protokoll, B3 Software, B4 Einflussfaktoren',
        'B1-Wording: zwei Hauptdiagnosesysteme + ergänzender AUTEL-Snapshot',
      ],
      en: [
        'Gap in one line: BMS proprietary ±5–10 %, external diagnostics divergent, studies on lab cells',
        'Research question prominent: reproducible + practical + on/off-board',
        'Four contributions in a row: B1 evaluation, B2 protocol, B3 software, B4 influence factors',
        'B1 wording: two primary diagnostic systems + supplementary AUTEL snapshot',
      ],
    },
    script: {
      de: 'Die Forschungslücke ist klar: BMS-Algorithmen sind proprietär mit ±5–10 % Abweichung, externe Diagnosegeräte liefern abweichende Werte, und die meisten Studien nutzen Laborzellen — eine standardisierte, reproduzierbare Methodik am realen Fahrzeug fehlt. Daraus meine Forschungsfrage: Wie lässt sich der SOH reproduzierbar und praxistauglich bestimmen? Vier Beiträge: Erstens die systematische Evaluation der zwei Hauptdiagnosesysteme — AVL HV-Check und OBDLink MX+, ergänzt durch den AUTEL als Snapshot-Vergleich. Zweitens ein standardisiertes Messprotokoll. Drittens sechs SOH-Methoden in einer Python-App. Und viertens die Quantifizierung der wichtigsten Einflussfaktoren.',
      en: 'The research gap is clear: BMS algorithms are proprietary with ±5–10 % deviation, external diagnostics deliver divergent values, and most studies use lab cells — a standardized, reproducible methodology on real vehicles is missing. Hence my research question: How can SOH be determined reproducibly and practically? Four contributions: first, systematic evaluation of two primary diagnostic systems — AVL HV-Check and OBDLink MX+, supplemented by the AUTEL as snapshot comparison. Second, a standardized measurement protocol. Third, six SOH methods in a Python app. And fourth, quantification of the key influence factors.',
    },
    dataCallouts: [
      '2 Hauptsysteme + 1 ergänzend / 2 primary + 1 supplementary',
      '6 SOH-Berechnungsmethoden / calculation methods',
      '33 Einzelmessungen / individual measurements',
    ],
    questions: [
      {
        q: { de: 'Welche Studien haben Sie als Stand der Technik herangezogen?', en: 'Which studies did you use as state of the art?' },
        a: { de: 'Xiong 2018 (BMS-Algorithmen), Waag 2014 (Impedanzmethoden), Berecibar 2016 (Degradationsdiagnose). Die meisten dieser Arbeiten nutzen Laborzellen, nicht reale Fahrzeuge mit kommerziellen Diagnosesystemen.', en: 'Xiong 2018 (BMS algorithms), Waag 2014 (impedance methods), Berecibar 2016 (degradation diagnosis). Most of these use lab cells, not real vehicles with commercial diagnostic systems.' },
      },
    ],
    transition: {
      de: 'Bevor wir in die Methodik einsteigen, zunächst die theoretischen Grundlagen.',
      en: 'Before diving into methodology, first the theoretical foundations.',
    },
  },

  // ============================================================
  // SECTION 3: THEORY (3:00)
  // ============================================================

  'slide-battery-basics': {
    time: '5:00 – 6:30 (90 s)',
    bullets: {
      de: [
        'Kalendarische Alterung: SEI-Wachstum, Kathoden-Degradation, Elektrolyt-Zersetzung, Arrhenius',
        'Zyklische Alterung: Volumenänderung, Lithium-Plating, DoD-Abhängigkeit',
        'Testfahrzeug VW ID.4: NMC 712 Pouch-Zellen, 288 Zellen, 77 kWh, 300–408 V',
        'Wichtig: Lithium-Plating bei niedriger Temperatur + hohem SOC + hoher C-Rate',
      ],
      en: [
        'Calendar aging: SEI growth, cathode degradation, electrolyte decomposition, Arrhenius',
        'Cyclic aging: volume change, lithium plating, DoD dependency',
        'Test vehicle VW ID.4: NMC 712 pouch cells, 288 cells, 77 kWh, 300–408 V',
        'Key: lithium plating at low temperature + high SOC + high C-rate',
      ],
    },
    script: {
      de: 'Li-Ionen-Batterien unterliegen zwei Alterungsarten. Kalendarische Alterung tritt unabhängig von der Nutzung auf — durch Wachstum der SEI-Schicht, Kathodendegradation und Elektrolytzersetzung. Das folgt einem Arrhenius-Verhalten: höhere Temperatur bedeutet exponentiell schnellere Alterung. Zyklische Alterung entsteht durch Laden und Entladen — Volumenänderungen führen zu Partikelrissen, und unter ungünstigen Bedingungen kann Lithium-Plating auftreten, was ein Sicherheitsrisiko darstellt. Unser Testfahrzeug ist ein VW ID.4 mit NMC 712 Pouch-Zellen — 288 Zellen in 12 Modulen, 77 kWh brutto, Spannungsbereich 300 bis 408 Volt.',
      en: 'Li-ion batteries undergo two types of aging. Calendar aging occurs regardless of use — through SEI layer growth, cathode degradation, and electrolyte decomposition. This follows Arrhenius behavior: higher temperature means exponentially faster aging. Cyclic aging results from charging and discharging — volume changes cause particle cracking, and under unfavorable conditions, lithium plating can occur, posing a safety risk. Our test vehicle is a VW ID.4 with NMC 712 pouch cells — 288 cells in 12 modules, 77 kWh gross, voltage range 300 to 408 volts.',
    },
    dataCallouts: [
      'NMC 712 · 288 Zellen · 77 kWh · 300–408 V',
    ],
    questions: [
      {
        q: { de: 'Warum NMC und nicht LFP?', en: 'Why NMC and not LFP?' },
        a: { de: 'Der VW ID.4 nutzt NMC 712. LFP wäre ein interessanter Vergleich für zukünftige Arbeiten, besonders weil LFP eine flachere OCV-Kurve hat, was die ICA-Analyse erschwert.', en: 'The VW ID.4 uses NMC 712. LFP would be an interesting comparison for future work, especially since LFP has a flatter OCV curve, making ICA analysis more difficult.' },
      },
    ],
    transition: {
      de: 'Kommen wir zu den fünf SOH-Definitionen, die in dieser Arbeit verwendet werden.',
      en: 'Let\'s move to the five SOH definitions used in this thesis.',
    },
  },

  'slide-soh-definitions': {
    time: '6:30 – 8:00 (90 s)',
    bullets: {
      de: [
        'Fünf Methoden nacheinander einblenden — Gleichungen erklären',
        'SOH_cap: kapazitätsbasiert (BMS-Direktwert)',
        'SOH_e: energiebasiert (∫V·I dt / E_nenn) — genaueste Einzelmethode',
        'SOH_c: Coulomb-Counting (∫|I| dt / Q_nenn) — systematische Unterschätzung',
        'SOH_R: widerstandsbasiert (Baseline-Verhältnis)',
        'SOH_komb: (SOH_e + SOH_c) / 2 — empfohlener Gesamtwert',
        'Jede Methode erfasst einen anderen Aspekt der Alterung',
      ],
      en: [
        'Reveal five methods one by one — explain equations',
        'SOH_cap: capacity-based (BMS direct value)',
        'SOH_e: energy-based (∫V·I dt / E_nom) — most accurate single method',
        'SOH_c: Coulomb counting (∫|I| dt / Q_nom) — systematic underestimation',
        'SOH_R: resistance-based (baseline ratio)',
        'SOH_comb: (SOH_e + SOH_c) / 2 — recommended overall value',
        'Each method captures a different aspect of aging',
      ],
    },
    script: {
      de: 'Wir verwenden fünf komplementäre SOH-Methoden. Der kapazitätsbasierte SOH nutzt den BMS-Direktwert. Der energiebasierte SOH_e integriert Spannung mal Strom über die Ladezeit — er erweist sich als genaueste Einzelmethode. SOH_c basiert auf Coulomb-Counting, unterschätzt aber systematisch um etwa 5,5 Prozentpunkte, da bei langer AC-Ladung kumulative Integrationsfehler entstehen. SOH_R nutzt das Verhältnis von Baseline- zu aktuellem Innenwiderstand. Und der kombinierte SOH — der Mittelwert aus SOH_e und SOH_c — gleicht die systematischen Fehler beider Methoden aus und liefert den robustesten Gesamtwert.',
      en: 'We use five complementary SOH methods. Capacity-based SOH uses the BMS direct value. Energy-based SOH_e integrates voltage times current over charging time — it proves to be the most accurate single method. SOH_c is based on Coulomb counting but systematically underestimates by about 5.5 percentage points due to cumulative integration errors during long AC charging. SOH_R uses the ratio of baseline to current internal resistance. And the combined SOH — the mean of SOH_e and SOH_c — compensates the systematic errors of both methods and delivers the most robust overall value.',
    },
    dataCallouts: [
      'SOH_e: genaueste Einzelmethode / most accurate single method',
      'SOH_c: ~5,5 Pp systematische Unterschätzung / systematic underestimation',
    ],
    questions: [
      {
        q: { de: 'Warum nicht auch EIS (Impedanzspektroskopie)?', en: 'Why not also EIS (impedance spectroscopy)?' },
        a: { de: 'EIS erfordert spezielle Laborausrüstung und ist für die praxisnahe On-Board-Diagnose nicht geeignet. In der Theorie behandelt, aber nicht implementiert — Fokus liegt auf mit OBD-Adapter durchführbaren Methoden.', en: 'EIS requires specialized lab equipment and is not suitable for practical on-board diagnosis. Covered in theory but not implemented — focus is on methods feasible with an OBD adapter.' },
      },
    ],
    transition: {
      de: 'Jetzt zeige ich Ihnen die drei Diagnosesysteme und unser Messprotokoll.',
      en: 'Now let me show you the three diagnostic systems and our measurement protocol.',
    },
  },

  // ============================================================
  // SECTION 4: METHODOLOGY (6:00)
  // ============================================================

  'slide-tools': {
    time: '4:30 – 5:30 (60 s)',
    bullets: {
      de: [
        '3-Ebenen-Modell oben: BMS / On-Board-Erfassung / Auswertung',
        'Hauptsysteme: AVL HV-Check (Snapshot-Referenz, ~70 €/Jahr Lizenz) + OBDLink MX+ (kontinuierlich, ~130 € einmalig — keine Folgekosten)',
        'AUTEL MaxiSYS Ultra: ergänzend (Snapshot-Vergleich, ~8.000 €) — visuell zurückgenommen',
        'OBDLink-Mehrwert betonen: Daten, die mit AVL nicht möglich sind, plus keine laufenden Kosten',
      ],
      en: [
        '3-level model on top: BMS / on-board acquisition / post-processing',
        'Primary: AVL HV-Check (snapshot reference, ~€70/year license) + OBDLink MX+ (continuous, ~€130 one-off — no recurring costs)',
        'AUTEL MaxiSYS Ultra: supplementary (snapshot comparison, ~€8,000) — visually downplayed',
        'Emphasize OBDLink advantage: data not possible with AVL, plus no recurring costs',
      ],
    },
    script: {
      de: 'Zwei Hauptdiagnosesysteme decken das Spektrum ab — beide greifen über OBD-II auf das BMS zu. Der AVL HV-Check ist unsere Snapshot-Referenz: er liest den BMS-SOH direkt aus und kostet etwa 70 Euro pro Jahr im Lizenzmodell. Der OBDLink MX+ ist der zentrale Mehrwert dieser Arbeit: ein Consumer-Adapter für 130 Euro einmalig, ohne Folgekosten, der kontinuierliche Zeitreihen liefert — also genau die Daten, die der AVL nicht liefern kann. Das AUTEL MaxiSYS Ultra dient ergänzend als Snapshot-Vergleich. Oben sehen Sie das 3-Ebenen-Modell: Im Fahrzeug läuft das BMS, beide Hauptsysteme erfassen On-Board, und die eigentliche SOH-Auswertung dieser Arbeit findet nachgelagert in der Python-App statt.',
      en: 'Two primary diagnostic systems cover the spectrum — both access the BMS via OBD-II. The AVL HV-Check is our snapshot reference: it reads BMS SOH directly and costs about €70 per year on a license model. The OBDLink MX+ is the key contribution of this work: a consumer adapter at €130 one-off, no recurring costs, delivering continuous time series — exactly the data the AVL cannot provide. The AUTEL MaxiSYS Ultra is supplementary as snapshot comparison. The 3-level model above: BMS runs in the vehicle, both primary systems acquire on-board, and the actual SOH analysis of this work happens downstream in the Python app.',
    },
    dataCallouts: [
      'AVL: ~70 €/Jahr Lizenz · OBDLink: ~130 € einmalig · AUTEL: ~8.000 €',
      '96 Zellspannungen + 24 Temperatursensoren via OBD',
    ],
    questions: [
      {
        q: { de: 'Warum nicht direkt an der Batterie messen statt über OBD?', en: 'Why not measure directly at the battery instead of via OBD?' },
        a: { de: 'Das würde den Eingriff in das Hochvoltsystem erfordern — sicherheitskritisch und für den Werkstattalltag nicht praktikabel. Der OBD-Zugang ist zerstörungsfrei und standardisiert.', en: 'That would require intervention in the high-voltage system — safety-critical and not practical for workshop use. OBD access is non-destructive and standardized.' },
      },
      {
        q: { de: 'Warum ist der AUTEL nicht Hauptsystem?', en: 'Why is the AUTEL not a primary system?' },
        a: { de: 'Wir haben mit dem AUTEL nur Snapshot-Vergleichsmessungen durchgeführt. Die kontinuierlichen Daten — die Grundlage für eigene SOH-Berechnungen — kommen vom OBDLink. Daher ergänzend, nicht primär.', en: 'We only did snapshot comparison measurements with the AUTEL. The continuous data — the basis for our own SOH calculations — comes from the OBDLink. Hence supplementary, not primary.' },
      },
    ],
    transition: {
      de: 'Wie genau sieht das Messprotokoll aus?',
      en: 'What exactly does the measurement protocol look like?',
    },
  },

  'slide-protocol': {
    time: '9:15 – 10:15 (60 s)',
    bullets: {
      de: [
        'Fünf Phasen des standardisierten Protokolls',
        '1. Vorbereitung: Entladung auf ~0% SOC, Temperatur dokumentieren',
        '2. OBD-Verbindung: MX+, Bluetooth, alle BMS-PIDs',
        '3. Ladung: Aufzeichnung VOR Ladebeginn starten, 0→100% SOC',
        '4. Datenexport: CSV mit Zeitstempeln',
        '5. Analyse: CSV in Python-App laden → automatische SOH-Berechnung',
        'Flowchart rechts zeigt den vollständigen Ablauf',
      ],
      en: [
        'Five phases of the standardized protocol',
        '1. Preparation: discharge to ~0% SOC, document temperature',
        '2. OBD connection: MX+, Bluetooth, all BMS PIDs',
        '3. Charging: start recording BEFORE charging begins, 0→100% SOC',
        '4. Data export: CSV with timestamps',
        '5. Analysis: load CSV into Python app → automatic SOH calculation',
        'Flowchart on right shows complete process',
      ],
    },
    script: {
      de: 'Das standardisierte Messprotokoll umfasst fünf Phasen. Zuerst wird das Fahrzeug bis zum Display-SOC von null Prozent entladen und die Umgebungstemperatur dokumentiert. Dann wird der OBDLink MX+ verbunden und alle relevanten BMS-Parameter ausgewählt — SOC, Spannung, Strom, 96 Zellgruppen und 24 Temperatursensoren. Entscheidend: Die Aufzeichnung muss vor dem Ladestart beginnen, um den kompletten Ladezyklus von 0 bis 100 Prozent zu erfassen. Nach dem Export als CSV wird der Datensatz automatisch in unserer Python-App analysiert.',
      en: 'The standardized protocol comprises five phases. First, the vehicle is discharged to display SOC of zero percent and ambient temperature is documented. Then the OBDLink MX+ is connected and all relevant BMS parameters selected — SOC, voltage, current, 96 cell groups and 24 temperature sensors. Critically: recording must start before charging begins to capture the complete 0 to 100 percent cycle. After CSV export, the dataset is automatically analyzed in our Python app.',
    },
    dataCallouts: [
      '194 BMS-Kanäle / channels, ~1 s Abtastrate / sampling rate',
    ],
    questions: [],
    transition: {
      de: 'Schauen wir uns die Entladephase genauer an.',
      en: 'Let\'s look at the discharge phase in more detail.',
    },
  },

  'slide-discharge': {
    time: '10:15 – 11:00 (45 s)',
    bullets: {
      de: [
        'Entladung durch normale Fahrt — kein spezieller Modus nötig',
        'Display-SOC = 0% entspricht BMS-SOC ≈ 5,75%',
        'Nutzbares Fenster: ca. 90% der physikalischen Kapazität',
        'Gauge-Animation zeigt den Prozess visuell',
      ],
      en: [
        'Discharge through normal driving — no special mode needed',
        'Display SOC = 0% corresponds to BMS SOC ≈ 5.75%',
        'Usable window: approx. 90% of physical capacity',
        'Gauge animation shows the process visually',
      ],
    },
    script: {
      de: 'Die Entladung erfolgt durch normales Fahren bis zum Display-SOC von null Prozent. Wichtig zu wissen: Display-SOC null Prozent entspricht einem BMS-SOC von etwa 5,75 Prozent — das BMS hält eine Pufferreserve zurück. Das nutzbare Fenster beträgt damit etwa 90 Prozent der physikalischen Kapazität.',
      en: 'Discharge occurs through normal driving until display SOC reaches zero percent. Important to know: display SOC zero corresponds to a BMS SOC of approximately 5.75 percent — the BMS retains a buffer reserve. The usable window is therefore about 90 percent of physical capacity.',
    },
    dataCallouts: [
      'Display-SOC 0% = BMS-SOC ≈ 5,75%',
      'Nutzbares Fenster / usable window ≈ 90%',
    ],
    questions: [],
    transition: {
      de: 'Jetzt kommt der Ladevorgang — das CC-CV-Profil.',
      en: 'Now comes the charging process — the CC-CV profile.',
    },
  },

  'slide-charging': {
    time: '11:00 – 12:00 (60 s)',
    bullets: {
      de: [
        'CC-Phase: Konstantstrom (~30 A), Spannung steigt, 0–80% SOC',
        'CV-Phase: Konstantspannung (~397 V), Strom sinkt exponentiell, 80–100% SOC',
        'AC-Wallbox 11 kW → C-Rate 0,1–0,15 C → quasi-stationäre Messung',
        'Ladeenergie Session A: 73,9 kWh in 465 min (~7,75 h)',
        'CC-CV-Chart rechts zeigt Spannung, Strom und SOC über die Zeit',
      ],
      en: [
        'CC phase: constant current (~30 A), voltage rises, 0–80% SOC',
        'CV phase: constant voltage (~397 V), current decays exponentially, 80–100% SOC',
        'AC wallbox 11 kW → C-rate 0.1–0.15 C → quasi-stationary measurement',
        'Charge energy Session A: 73.9 kWh in 465 min (~7.75 h)',
        'CC-CV chart on right shows voltage, current and SOC over time',
      ],
    },
    script: {
      de: 'Das CC-CV-Ladeprofil besteht aus zwei Phasen. In der CC-Phase fließt ein konstanter Strom von etwa 30 Ampere bei steigender Spannung — das deckt den Bereich von 0 bis 80 Prozent SOC ab. In der CV-Phase wird die Spannung bei etwa 397 Volt konstant gehalten und der Strom sinkt exponentiell bis zum Ladeende. Mit unserer AC-Wallbox bei 11 kW ergibt sich eine sehr niedrige C-Rate von 0,1 bis 0,15 C — das ermöglicht quasi-stationäre Messbedingungen, ideal für die SOH-Berechnung. Die gesamte Ladeenergie beträgt 73,9 kWh in knapp 8 Stunden.',
      en: 'The CC-CV charging profile consists of two phases. In the CC phase, constant current of about 30 amps flows with rising voltage — covering 0 to 80 percent SOC. In the CV phase, voltage is held constant at about 397 volts and current decays exponentially until charge end. With our AC wallbox at 11 kW, we get a very low C-rate of 0.1 to 0.15 C — enabling quasi-stationary measurement conditions, ideal for SOH calculation. Total charge energy is 73.9 kWh in nearly 8 hours.',
    },
    dataCallouts: [
      '73,9 kWh Ladeenergie / charge energy',
      'C-Rate: 0,1–0,15 C',
      '465 min / ~7,75 h Ladedauer / charge duration',
    ],
    questions: [],
    transition: {
      de: 'Kommen wir zum Testfahrzeug und der Messübersicht.',
      en: 'Let\'s move to the test vehicle and measurement overview.',
    },
  },

  'slide-vehicles': {
    time: '7:00 – 8:00 (60 s)',
    bullets: {
      de: [
        'Headline: 33 Einzelmessungen Dez 2024 – Dez 2025 auf MEB-Plattform',
        'Primärfahrzeug VW ID.4 (IfE): 77 kWh NMC 712, 288 Zellen, MEB, 10.801 km, SOH 97,3 %',
        'Hauptsysteme markiert; AUTEL ergänzend (visuell zurückgenommen)',
        'MEB-Verifikation: Skoda Elroq (7 AVL, σ=0% über 9 Monate, 12.572 km) + Cupra Born (1 AVL/1 OBD, ergänzend)',
        'BMW i3s NICHT erwähnen — ist nur kontextuelle Vergleichsmessung im Backup',
      ],
      en: [
        'Headline: 33 individual measurements Dec 2024 – Dec 2025 on MEB platform',
        'Primary vehicle VW ID.4 (IfE): 77 kWh NMC 712, 288 cells, MEB, 10,801 km, SOH 97.3 %',
        'Primary systems flagged; AUTEL supplementary (visually downplayed)',
        'MEB verification: Skoda Elroq (7 AVL, σ=0% over 9 months, 12,572 km) + Cupra Born (1 AVL/1 OBD, supplementary)',
        'Do NOT mention BMW i3s — only contextual comparison in backup',
      ],
    },
    script: {
      de: 'Insgesamt 33 Einzelmessungen über ein Jahr — der Schwerpunkt liegt auf der MEB-Plattform. Primärfahrzeug ist unser institutseigener VW ID.4 mit 77-kWh-NMC-712-Batterie, MEB-Plattform, 10.801 Kilometer Laufleistung und einem aktuellen BMS-SOH von 97,3 Prozent. Hauptsysteme: AVL HV-Check und OBDLink — der AUTEL ergänzend. Die Übertragbarkeit auf die MEB-Plattform haben wir am Skoda Elroq verifiziert: sieben AVL-Messungen über neun Monate mit perfekter Reproduzierbarkeit Sigma gleich null. Der Cupra Born dient als ergänzende Plattform-Verifikation.',
      en: 'A total of 33 individual measurements over one year — the focus is on the MEB platform. Primary vehicle is our institutional VW ID.4 with 77 kWh NMC 712 battery, MEB platform, 10,801 km mileage and a current BMS SOH of 97.3 percent. Primary systems: AVL HV-Check and OBDLink — AUTEL supplementary. Transferability to the MEB platform was verified on the Skoda Elroq: seven AVL measurements over nine months with perfect reproducibility, sigma equals zero. The Cupra Born serves as supplementary platform verification.',
    },
    dataCallouts: [
      '33 Einzelmessungen Dez 2024 – Dez 2025',
      'VW ID.4 (Haupt) · Elroq (σ=0%, 7 AVL) · Born (ergänzend)',
      'SOH 97,3% (AVL, VW ID.4 IfE)',
    ],
    questions: [
      {
        q: { de: 'Warum kein BMW i3s als Verifikation?', en: 'Why no BMW i3s as verification?' },
        a: { de: 'Wir haben am BMW i3s Vergleichsmessungen durchgeführt — 0,4 Pp Inter-System-Übereinstimmung — aber bewusst auf die MEB-Plattform fokussiert, weil die kontinuierliche OBD-Datenerfassung mit allen sechs Methoden nur dort vollständig durchgeführt wurde. Die BMW-Messungen liegen im Backup und sind kontextuell, nicht als Validierung gedacht. Erweiterung auf andere Plattformen ist als Future Work formuliert.', en: 'We did comparison measurements on the BMW i3s — 0.4 pp inter-system agreement — but deliberately focused on the MEB platform, because the full continuous OBD data acquisition with all six methods was only performed there. The BMW measurements are in the backup as contextual, not as validation. Extension to other platforms is formulated as future work.' },
      },
      {
        q: { de: 'Warum nur ein Primärfahrzeug?', en: 'Why only one primary vehicle?' },
        a: { de: 'Für die detaillierte On-Board-Analyse mit allen sechs Methoden haben wir den VW ID.4 gewählt. Drei MEB-Fahrzeuge insgesamt — VW ID.4 als Hauptfahrzeug, Elroq und Born zur Plattform-Verifikation.', en: 'For detailed on-board analysis with all six methods we chose the VW ID.4. Three MEB vehicles in total — VW ID.4 as primary, Elroq and Born for platform verification.' },
      },
    ],
    transition: {
      de: 'Wie die sechs Methoden zusammenwirken, zeigt die Konvergenz-Pipeline.',
      en: 'How the six methods converge is shown in the convergence pipeline.',
    },
  },

  'slide-pipeline': {
    time: '13:00 – 14:00 (60 s)',
    bullets: {
      de: [
        'Pipeline: Datenquellen → 6 Berechnungsmethoden → kombinierter SOH',
        'Konvergenzdiagramm zeigt, wie verschiedene Methoden zu einem robusten Wert zusammenführen',
        'Kurz halten — Details kommen in den Ergebnissen',
      ],
      en: [
        'Pipeline: data sources → 6 calculation methods → combined SOH',
        'Convergence diagram shows how different methods lead to a robust value',
        'Keep brief — details come in results',
      ],
    },
    script: {
      de: 'Dieses Konvergenzdiagramm zeigt, wie unsere sechs Berechnungsmethoden — von der direkten BMS-Auslesung über Energie- und Ladungsintegration bis zur Widerstandsanalyse — zu einem robusten kombinierten SOH-Wert konvergieren. Jede Methode erfasst einen anderen Aspekt der Alterung, und die Kombination gleicht die jeweiligen Schwächen aus. Die konkreten Ergebnisse zeige ich Ihnen jetzt.',
      en: 'This convergence diagram shows how our six calculation methods — from direct BMS readout through energy and charge integration to resistance analysis — converge into a robust combined SOH value. Each method captures a different aspect of aging, and the combination compensates for their respective weaknesses. Let me now show you the concrete results.',
    },
    dataCallouts: [],
    questions: [],
    transition: {
      de: 'Kommen wir zum Hauptteil — den Ergebnissen.',
      en: 'Let\'s move to the main part — the results.',
    },
  },

  // ============================================================
  // SECTION 5: RESULTS (11:00)
  // ============================================================

  'slide-method-comparison': {
    time: '14:00 – 15:30 (90 s)',
    bullets: {
      de: [
        'Lollipop-Chart: alle 6 Methoden + AVL-Referenz auf einer Achse',
        'Streuung: 89,7% (SOH_kap) bis 100,0% (SOH_R) = 10,3 Pp',
        'SOH_e = 99,6% — genaueste Einzelmethode (Δ 2,3 Pp zum AVL)',
        'SOH_c = 91,8% — systematische Unterschätzung (~5,5 Pp)',
        'Kombiniert (e+c)/2 = 95,7% — bester Gesamtwert (Δ 1,6 Pp zum AVL)',
        'AVL-Referenz = 97,3%',
        'Takeaway: Keine Einzelmethode liefert den „wahren" SOH',
      ],
      en: [
        'Lollipop chart: all 6 methods + AVL reference on one axis',
        'Spread: 89.7% (SOH_cap) to 100.0% (SOH_R) = 10.3 pp',
        'SOH_e = 99.6% — most accurate single method (Δ 2.3 pp to AVL)',
        'SOH_c = 91.8% — systematic underestimation (~5.5 pp)',
        'Combined (e+c)/2 = 95.7% — best overall value (Δ 1.6 pp to AVL)',
        'AVL reference = 97.3%',
        'Takeaway: No single method delivers the "true" SOH',
      ],
    },
    script: {
      de: 'Hier sehen Sie den Vergleich aller sechs SOH-Methoden. Die Streuung beträgt 10,3 Prozentpunkte — von SOH_kap mit 89,7 Prozent bis SOH_R mit 100 Prozent. SOH_e mit 99,6 Prozent ist die genaueste Einzelmethode — nur 2,3 Prozentpunkte über der AVL-Referenz. SOH_c mit 91,8 Prozent unterschätzt systematisch um etwa 5,5 Prozentpunkte, was an den kumulativen Integrationsfehlern während der langen AC-Ladung liegt. Der kombinierte Wert aus SOH_e und SOH_c von 95,7 Prozent gleicht diese Fehler aus und weicht nur 1,6 Prozentpunkte von der AVL-Referenz ab. Das zeigt: Keine Einzelmethode liefert den wahren SOH, aber die Kombination ist praxistauglich.',
      en: 'Here you see the comparison of all six SOH methods. The spread is 10.3 percentage points — from SOH_cap at 89.7% to SOH_R at 100%. SOH_e at 99.6% is the most accurate single method — only 2.3 pp above the AVL reference. SOH_c at 91.8% systematically underestimates by about 5.5 pp, due to cumulative integration errors during long AC charging. The combined value of SOH_e and SOH_c at 95.7% compensates these errors and deviates only 1.6 pp from the AVL reference. This shows: no single method delivers the true SOH, but the combination is practically usable.',
    },
    dataCallouts: [
      'SOH_e = 99,6% · SOH_c = 91,8% · Kombiniert = 95,7%',
      'AVL = 97,3% · Δ = 1,6 Pp',
      'Methodendivergenz = 10,3 Pp / method divergence = 10.3 pp',
    ],
    questions: [
      {
        q: { de: 'Warum unterschätzt SOH_c systematisch?', en: 'Why does SOH_c systematically underestimate?' },
        a: { de: 'Bei langer AC-Ladung (~8h bei ~30A) akkumulieren Integrationsfehler im Coulomb-Counting. Zusätzlich gehen Verluste (Wärme, BMS-Eigenverbrauch) nicht in die Stromintegration ein. Die BMS-Strommessung hat zudem Offsets bei niedrigen Strömen.', en: 'During long AC charging (~8h at ~30A), integration errors accumulate in Coulomb counting. Additionally, losses (heat, BMS self-consumption) are not captured in current integration. The BMS current measurement also has offsets at low currents.' },
      },
    ],
    transition: {
      de: 'Wie reproduzierbar sind diese Ergebnisse?',
      en: 'How reproducible are these results?',
    },
  },

  'slide-reproducibility': {
    time: '15:30 – 16:30 (60 s)',
    bullets: {
      de: [
        'Links: Algorithmische Reproduzierbarkeit — 3× gleicher Datensatz',
        'SOH_e: 0,0 Pp Streuung (vollständig deterministisch)',
        'SOH_c: 0,3 Pp (aktualisierte Softwareparameter)',
        'Kombiniert: 0,2 Pp — exzellent',
        'Rechts: AVL-Messwiederholbarkeit über 12 Monate',
        'σ = 1,20% — dominiert durch Fahrzeugzustand und Temperatur',
      ],
      en: [
        'Left: algorithmic reproducibility — same dataset 3×',
        'SOH_e: 0.0 pp spread (fully deterministic)',
        'SOH_c: 0.3 pp (updated software parameters)',
        'Combined: 0.2 pp — excellent',
        'Right: AVL measurement repeatability over 12 months',
        'σ = 1.20% — dominated by vehicle state and temperature',
      ],
    },
    script: {
      de: 'Die algorithmische Reproduzierbarkeit ist exzellent. Wir haben denselben Datensatz dreimal unabhängig analysiert: SOH_e ist vollständig deterministisch mit null Streuung. SOH_c zeigt minimal 0,3 Prozentpunkte Abweichung durch aktualisierte Softwareparameter. Der kombinierte SOH streut nur 0,2 Prozentpunkte. Beim AVL HV-Check zeigt sich über 12 Monate eine Standardabweichung von 1,2 Prozent — diese wird aber durch Fahrzeugzustand und Temperatur dominiert, nicht durch den Algorithmus selbst.',
      en: 'Algorithmic reproducibility is excellent. We analyzed the same dataset three times independently: SOH_e is fully deterministic with zero spread. SOH_c shows minimal 0.3 pp deviation from updated software parameters. The combined SOH spreads only 0.2 pp. The AVL HV-Check shows a standard deviation of 1.2% over 12 months — but this is dominated by vehicle state and temperature, not the algorithm itself.',
    },
    dataCallouts: [
      'Algorithmisch: 0,2 Pp Streuung / algorithmic: 0.2 pp spread',
      'AVL σ = 1,20% über 12 Monate / over 12 months',
    ],
    questions: [],
    transition: {
      de: 'Wie beeinflusst die Temperatur die Ergebnisse?',
      en: 'How does temperature affect the results?',
    },
  },

  'slide-temperature': {
    time: '16:30 – 17:30 (60 s)',
    bullets: {
      de: [
        'Slope-Chart: Session A (19°C) vs. Session B (9,8°C)',
        'SOH_e: +1,2 Pp bei Kälte (BMS meldet höheren Energiegehalt)',
        'SOH_c: −1,3 Pp bei Kälte (langsamere Ladung = höherer Integrationsfehler)',
        'Kombiniert: −0,1 Pp — gegenläufige Effekte kompensieren sich fast perfekt',
        'Deshalb: Kombination inhärent temperaturrobust',
      ],
      en: [
        'Slope chart: Session A (19°C) vs. Session B (9.8°C)',
        'SOH_e: +1.2 pp in cold (BMS reports higher energy content)',
        'SOH_c: −1.3 pp in cold (slower charging = higher integration error)',
        'Combined: −0.1 pp — opposing effects nearly perfectly cancel',
        'Therefore: combination is inherently temperature-robust',
      ],
    },
    script: {
      de: 'Dies ist eines der überraschendsten Ergebnisse. Bei 9,8 Grad Celsius steigt SOH_e um 1,2 Prozentpunkte — das BMS meldet bei Kälte einen etwas höheren Energiegehalt. Gleichzeitig sinkt SOH_c um 1,3 Prozentpunkte, weil die langsamere Ladung bei Kälte den Integrationsfehler vergrößert. Diese gegenläufigen Effekte kompensieren sich im kombinierten SOH fast perfekt: nur 0,1 Prozentpunkte Differenz zwischen 19 und 9,8 Grad. Das macht die Kombination inhärent temperaturrobust — einer der stärksten Vorteile dieser Methodik.',
      en: 'This is one of the most surprising results. At 9.8°C, SOH_e rises by 1.2 pp — the BMS reports slightly higher energy content in cold. Simultaneously, SOH_c drops by 1.3 pp because slower charging in cold increases the integration error. These opposing effects nearly perfectly cancel in the combined SOH: only 0.1 pp difference between 19°C and 9.8°C. This makes the combination inherently temperature-robust — one of the strongest advantages of this methodology.',
    },
    dataCallouts: [
      'SOH_e: +1,2 Pp · SOH_c: −1,3 Pp · Kombiniert: −0,1 Pp',
      '19°C vs. 9,8°C',
    ],
    questions: [
      {
        q: { de: 'Gilt das auch bei extremen Temperaturen (-20°C)?', en: 'Does this also apply at extreme temperatures (-20°C)?' },
        a: { de: 'Das haben wir nicht getestet. Bei -20°C reduziert das BMS die Ladeleistung stark, und der Innenwiderstand steigt um das 3-5-fache. Die implementierte Arrhenius-Korrektur liefert bei <10°C physikalisch unplausible Ergebnisse — daher empfehlen wir den Bereich 15-30°C.', en: 'We did not test that. At -20°C, the BMS severely reduces charging power and internal resistance increases 3-5x. The implemented Arrhenius correction produces physically implausible results at <10°C — therefore we recommend the 15-30°C range.' },
      },
    ],
    transition: {
      de: 'Kommen wir zum Innenwiderstand.',
      en: 'Let\'s move to internal resistance.',
    },
  },

  'slide-resistance': {
    time: '17:30 – 18:30 (60 s)',
    bullets: {
      de: [
        'DC-Puls-Test bei 51,2% SOC, 34°C',
        'R_i Laden = 40,0 mΩ, R_i Entladen = 32,8 mΩ',
        'Asymmetrie ~22% — typisch (Elektroden-Elektrolyt-Grenzfläche)',
        'SOH_R = 100% per Definition (Einzelmessung als Baseline)',
        'Limitation: kein Neuzustand-Vergleich, kein Trend ableitbar',
      ],
      en: [
        'DC pulse test at 51.2% SOC, 34°C',
        'R_i charge = 40.0 mΩ, R_i discharge = 32.8 mΩ',
        'Asymmetry ~22% — typical (electrode-electrolyte interface)',
        'SOH_R = 100% by definition (single measurement as baseline)',
        'Limitation: no new-condition comparison, no trend derivable',
      ],
    },
    script: {
      de: 'Der DC-Puls-Innenwiderstand wurde bei 51 Prozent SOC gemessen. Der Ladewiderstand beträgt 40 Milliohm, der Entladewiderstand 33 Milliohm — eine Asymmetrie von 22 Prozent, die durch die unterschiedliche Impedanz an der Elektroden-Elektrolyt-Grenzfläche entsteht. SOH_R ist per Definition 100 Prozent, da dies unsere einzige Einzelmessung ist und als Baseline dient. Ohne eine Neuzustand-Referenz können wir keinen Alterungstrend ableiten — der Innenwiderstand steigt monoton mit der Alterung durch SEI-Wachstum, aber für den Trend bräuchten wir Langzeitdaten.',
      en: 'The DC pulse internal resistance was measured at 51% SOC. Charging resistance is 40 milliohms, discharging 33 milliohms — a 22% asymmetry caused by different impedance at the electrode-electrolyte interface. SOH_R is 100% by definition since this is our single measurement serving as baseline. Without a new-condition reference, no aging trend can be derived — internal resistance rises monotonically with aging through SEI growth, but trend analysis requires long-term data.',
    },
    dataCallouts: [
      'R_i Laden = 40,0 mΩ · R_i Entladen = 32,8 mΩ',
      'Asymmetrie ~22%',
    ],
    questions: [],
    transition: {
      de: 'Was passiert, wenn das SOC-Fenster zu klein ist?',
      en: 'What happens when the SOC window is too small?',
    },
  },

  'slide-failure': {
    time: '18:30 – 19:30 (60 s)',
    bullets: {
      de: [
        'Vergleich: gutes SOC-Fenster (≥80%) vs. schlechtes (<50%)',
        'Gut: SOH_e 99,6%, SOH_c 91,8%, Kombiniert 95,7% — Δ AVL: −1,6 Pp',
        'Schlecht: SOH_c bricht auf 54,6% ein → Kombiniert nur 76,3% — Δ AVL: −21 Pp!',
        'SOC-Fenster ist der KRITISCHSTE Einflussfaktor',
        'Immer mit maximalem SOC-Fenster (>80%) messen',
      ],
      en: [
        'Comparison: good SOC window (≥80%) vs. poor (<50%)',
        'Good: SOH_e 99.6%, SOH_c 91.8%, Combined 95.7% — Δ AVL: −1.6 pp',
        'Bad: SOH_c drops to 54.6% → Combined only 76.3% — Δ AVL: −21 pp!',
        'SOC window is the MOST CRITICAL influence factor',
        'Always measure with maximum SOC window (>80%)',
      ],
    },
    script: {
      de: 'Dieser Fehlerfall zeigt eindrucksvoll den wichtigsten Einflussfaktor. Bei einem guten SOC-Fenster von über 80 Prozent liefert der kombinierte SOH 95,7 Prozent — nur 1,6 Prozentpunkte vom AVL-Wert entfernt. Aber bei einem SOC-Fenster unter 50 Prozent bricht SOH_c auf nur 54,6 Prozent ein — ein physikalisch unsinniger Wert. Der kombinierte SOH fällt auf 76,3 Prozent, was einer Abweichung von 21 Prozentpunkten entspricht. Die Ursache: Bei niedriger Stromamplitude während der OCV-Ruhephase wird der Ladungsdurchsatz massiv unterschätzt. Die klare Empfehlung: Immer mit maximalem SOC-Fenster messen — mindestens 50 Prozent, idealerweise über 80 Prozent.',
      en: 'This failure case dramatically shows the most important influence factor. With a good SOC window above 80%, the combined SOH delivers 95.7% — only 1.6 pp from the AVL value. But with an SOC window below 50%, SOH_c collapses to just 54.6% — a physically meaningless value. The combined SOH drops to 76.3%, a 21 pp deviation. The cause: at low current amplitude during OCV resting, charge throughput is massively underestimated. The clear recommendation: always measure with maximum SOC window — at least 50%, ideally above 80%.',
    },
    dataCallouts: [
      'Gutes Fenster: 95,7% · Schlechtes Fenster: 76,3%',
      'Δ = 21 Pp Abweichung / deviation!',
      'SOC-Fenster ≥ 80% empfohlen / recommended',
    ],
    questions: [
      {
        q: { de: 'Wie erkennt man ein schlechtes SOC-Fenster?', en: 'How do you detect a poor SOC window?' },
        a: { de: 'Die Software berechnet automatisch die SOC-Fenster-Qualität und warnt bei <50%. Wir verwenden ein 4-stufiges System: exzellent (≥80%), gut (≥50%), mäßig (≥20%), Wiederholung empfohlen (<20%).', en: 'The software automatically calculates SOC window quality and warns at <50%. We use a 4-tier system: excellent (≥80%), good (≥50%), moderate (≥20%), repeat recommended (<20%).' },
      },
    ],
    transition: {
      de: 'Wie gut stimmen On-Board- und Off-Board-Ergebnis überein?',
      en: 'How well do on-board and off-board results agree?',
    },
  },

  'slide-intersystem': {
    time: '19:30 – 20:30 (60 s)',
    bullets: {
      de: [
        'AVL (97,3%) vs. OBD kombiniert (95,7%) = Δ 1,6 Pp',
        'Kostenfaktor 200×: OBD ~€50 vs. AVL >€10.000',
        'AUTEL am VW ID.4 nicht verfügbar (herstellerspezifische PIDs)',
        'Einzelmethoden: SOH_e überschätzt (+2,3 Pp), SOH_c unterschätzt (−5,5 Pp)',
        '1,6 Pp liegt innerhalb typischer BMS-Toleranz (±5–10%) → praxistauglich',
      ],
      en: [
        'AVL (97.3%) vs. OBD combined (95.7%) = Δ 1.6 pp',
        'Cost factor 200×: OBD ~€50 vs. AVL >€10,000',
        'AUTEL not available for VW ID.4 (manufacturer-specific PIDs)',
        'Individual methods: SOH_e overestimates (+2.3 pp), SOH_c underestimates (−5.5 pp)',
        '1.6 pp is within typical BMS tolerance (±5–10%) → practically usable',
      ],
    },
    script: {
      de: 'Die Inter-System-Übereinstimmung zeigt das Kernresultat der Arbeit. Der AVL HV-Check als professionelle Referenz misst 97,3 Prozent. Unsere On-Board-Methode mit dem kombinierten SOH erreicht 95,7 Prozent — eine Abweichung von nur 1,6 Prozentpunkten. Und das bei einem Kostenfaktor von 200: der OBD-Adapter kostet etwa 50 Euro, das AVL-System über 10.000 Euro. Wichtig: SOH_e allein überschätzt um 2,3 Prozentpunkte, SOH_c unterschätzt um 5,5 — erst die Kombination gleicht diese systematischen Fehler aus. Die 1,6 Prozentpunkte Abweichung liegen deutlich innerhalb der typischen BMS-Toleranz von ±5 bis 10 Prozent.',
      en: 'The inter-system agreement shows the core result of this thesis. The AVL HV-Check as professional reference measures 97.3%. Our on-board method with combined SOH reaches 95.7% — a deviation of only 1.6 pp. At a cost factor of 200: the OBD adapter costs about 50 euros, the AVL system over 10,000 euros. Important: SOH_e alone overestimates by 2.3 pp, SOH_c underestimates by 5.5 — only the combination compensates these systematic errors. The 1.6 pp deviation is well within typical BMS tolerance of ±5 to 10 percent.',
    },
    dataCallouts: [
      'AVL: 97,3% vs. OBD: 95,7% = Δ 1,6 Pp',
      'Kostenfaktor / cost factor: 200×',
      '~€50 vs. >€10.000',
    ],
    questions: [
      {
        q: { de: 'Warum hat AUTEL beim VW ID.4 nicht funktioniert?', en: 'Why didn\'t AUTEL work on the VW ID.4?' },
        a: { de: 'AUTEL unterstützt nur bestimmte herstellerspezifische PIDs. Beim VW ID.4 konnte kein direkter SOH-Wert ausgelesen werden. Am BMW i3s funktionierte es dagegen — dort stimmten alle drei Systeme auf 0,4 Pp überein.', en: 'AUTEL only supports certain manufacturer-specific PIDs. On the VW ID.4, no direct SOH value could be read. On the BMW i3s it worked — there all three systems agreed within 0.4 pp.' },
      },
    ],
    transition: {
      de: 'Kommen wir zur ICA/DVA-Analyse.',
      en: 'Let\'s move to the ICA/DVA analysis.',
    },
  },

  'slide-ica-dva': {
    time: '20:30 – 21:30 (60 s)',
    bullets: {
      de: [
        'ICA: dQ/dV vs. V — Peaks zeigen Phasenübergänge (Graphit-Staging + NMC-Kathode)',
        'DVA: dV/dQ vs. Q — zeigt Spannungsplateaus',
        'Automatische Peakerkennung via SciPy',
        'Peaks im DB gespeichert: Position, Höhe, FWHM → Langzeittracking',
        'Limitation: kein Peakshift nachweisbar (Fahrzeug zu neu, keine Degradation)',
        'ICA-Infrastruktur steht für zukünftiges Monitoring',
      ],
      en: [
        'ICA: dQ/dV vs. V — peaks show phase transitions (graphite staging + NMC cathode)',
        'DVA: dV/dQ vs. Q — shows voltage plateaus',
        'Automatic peak detection via SciPy',
        'Peaks stored in DB: position, height, FWHM → long-term tracking',
        'Limitation: no peak shift detectable (vehicle too new, no degradation)',
        'ICA infrastructure ready for future monitoring',
      ],
    },
    script: {
      de: 'Die ICA-Analyse — die Ableitung dQ/dV gegen Spannung — identifiziert charakteristische Peaks, die den Phasenübergängen im Graphit-Anoden-Staging und den NMC-Kathodenreaktionen entsprechen. Die DVA zeigt die zugehörigen Spannungsplateaus. Unsere Software erkennt Peaks automatisch und speichert Position, Höhe und Halbwertsbreite in der Datenbank für Langzeittracking. Die wichtige Limitation: Da unser Fahrzeug mit über 97 Prozent SOH keine signifikante Alterung zeigt, können wir noch keine Peakverschiebungen nachweisen. Aber die Infrastruktur steht für zukünftiges Degradationsmonitoring.',
      en: 'The ICA analysis — the derivative dQ/dV versus voltage — identifies characteristic peaks corresponding to graphite anode staging phase transitions and NMC cathode reactions. DVA shows the associated voltage plateaus. Our software automatically detects peaks and stores position, height, and FWHM in the database for long-term tracking. The important limitation: since our vehicle shows no significant aging at over 97% SOH, we cannot yet detect peak shifts. But the infrastructure is ready for future degradation monitoring.',
    },
    dataCallouts: [
      'OCV-Bereich / range: ~325 V → ~397 V',
      'SOC-Fenster: 5,2% – 96,0% (90,8 Pp)',
    ],
    questions: [
      {
        q: { de: 'Ist die C-Rate bei AC-Ladung nicht zu hoch für ICA?', en: 'Isn\'t the C-rate too high for ICA with AC charging?' },
        a: { de: 'Optimal wäre <C/10. Mit 11 kW AC auf 77 kWh ergibt sich C/7 — grenzwertig. Die Peaks sind erkennbar, aber breiter als bei niedrigerer C-Rate. Für hochaufgelöste ICA wäre C/25 ideal, was aber ~25h Ladedauer bedeuten würde.', en: 'Optimal would be <C/10. With 11 kW AC on 77 kWh we get C/7 — borderline. Peaks are recognizable but broader than at lower C-rate. For high-resolution ICA, C/25 would be ideal, but that means ~25h charging time.' },
      },
    ],
    transition: {
      de: 'Wie ordnen sich unsere Messwerte im Vergleich zu Community-Daten ein?',
      en: 'How do our measurements compare to community data?',
    },
  },

  'slide-community': {
    time: '21:30 – 22:30 (60 s)',
    bullets: {
      de: [
        'VW ID.4 Community: n=273, μ=94,0%, 0–156.663 km',
        'MEB-Plattform: n=192, μ=96,0%, 480–131.124 km',
        'Eigener ID.4 (IfE): 99,6% bei 10.801 km — oberer Bereich (geringe Laufleistung)',
        'Eigener ID.4 (FP): 96,4% bei 65.467 km — über Mittelwert',
        'Degradationsrate: ~1 Pp / 10.000 km (MEB Langzeitbeobachtung)',
        'Eigene Messwerte fügen sich konsistent ein → Plausibilitätsprüfung bestanden',
      ],
      en: [
        'VW ID.4 community: n=273, μ=94.0%, 0–156,663 km',
        'MEB platform: n=192, μ=96.0%, 480–131,124 km',
        'Own ID.4 (IfE): 99.6% at 10,801 km — upper range (low mileage)',
        'Own ID.4 (FP): 96.4% at 65,467 km — above mean',
        'Degradation rate: ~1 pp / 10,000 km (MEB long-term observation)',
        'Own measurements fit consistently → plausibility check passed',
      ],
    },
    script: {
      de: 'Zur externen Validierung vergleichen wir unsere Ergebnisse mit öffentlichen Community-Datensätzen. Der VW ID.4-Datensatz umfasst 273 Einträge mit einem mittleren SOH von 94 Prozent. Unser institutseigener ID.4 mit 99,6 Prozent bei 10.801 Kilometern liegt im oberen Bereich — plausibel bei geringer Laufleistung und ausschließlich AC-Ladung. Der private ID.4 mit 96,4 Prozent bei 65.000 Kilometern liegt ebenfalls über dem Community-Mittelwert. Die beobachtete Degradationsrate von etwa einem Prozentpunkt pro 10.000 Kilometer stimmt mit der MEB-Langzeitbeobachtung überein. Unsere Messwerte fügen sich konsistent in die Datensätze ein — die externe Plausibilitätsprüfung ist damit bestanden.',
      en: 'For external validation, we compare our results with public community datasets. The VW ID.4 dataset comprises 273 entries with a mean SOH of 94%. Our institutional ID.4 at 99.6% with 10,801 km is in the upper range — plausible with low mileage and AC-only charging. The private ID.4 at 96.4% with 65,000 km also lies above the community mean. The observed degradation rate of about 1 pp per 10,000 km matches the MEB long-term observation. Our measurements fit consistently — the external plausibility check is passed.',
    },
    dataCallouts: [
      'n = 273 (ID.4) + 192 (MEB) = 465 Referenzeinträge / reference entries',
      'Degradationsrate / rate: ~1 Pp / 10.000 km',
    ],
    questions: [],
    transition: {
      de: 'Jetzt zeige ich Ihnen die entwickelte Software live.',
      en: 'Now let me show you the developed software live.',
    },
  },

  'slide-demo-pro': {
    time: '22:30 – 24:00 (90 s)',
    bullets: {
      de: [
        'Live-Demo der Pro-Version (Streamlit, Port 8501)',
        'CSV-Upload zeigen → automatische Erkennung → alle 6 SOH-Methoden',
        'Plots zeigen: Ladekurve, ICA/DVA, Methodenvergleich',
        'PDF-Report-Export demonstrieren',
        'Falls Demo fehlschlägt: Screenshots in Backup-Slides',
      ],
      en: [
        'Live demo of Pro version (Streamlit, port 8501)',
        'Show CSV upload → automatic detection → all 6 SOH methods',
        'Show plots: charging curve, ICA/DVA, method comparison',
        'Demonstrate PDF report export',
        'If demo fails: screenshots in backup slides',
      ],
    },
    script: {
      de: 'Hier sehen Sie die Pro-Version unserer SOH-Analyse-Software. Sie lädt OBD-CSV-Dateien und AVL-PDF-Berichte, erkennt automatisch den Fahrzeugtyp und berechnet alle sechs SOH-Methoden parallel. Die Ergebnisse werden als interaktive Plotly-Charts dargestellt und können als PDF-Bericht exportiert werden. Die Software speichert alle Messungen in einer SQLite-Datenbank für Langzeitvergleiche.',
      en: 'Here you see the Pro version of our SOH analysis software. It loads OBD CSV files and AVL PDF reports, automatically detects vehicle type and calculates all six SOH methods in parallel. Results are displayed as interactive Plotly charts and can be exported as PDF reports. The software stores all measurements in a SQLite database for long-term comparisons.',
    },
    dataCallouts: [],
    questions: [],
    transition: {
      de: 'Und hier die vereinfachte Easy-Version für den Werkstattalltag.',
      en: 'And here the simplified Easy version for workshop use.',
    },
  },

  'slide-demo-easy': {
    time: '24:00 – 25:00 (60 s)',
    bullets: {
      de: [
        'Easy-Version: 4-Schritt-Assistent für Werkstätten',
        'React-Frontend + FastAPI-Backend (Port 8000)',
        'Vereinfachte Darstellung: Ampel-System, klare SOH-Bewertung',
        'Zweisprachig (DE/EN)',
        'Für Anwender ohne technischen Hintergrund optimiert',
      ],
      en: [
        'Easy version: 4-step wizard for workshops',
        'React frontend + FastAPI backend (port 8000)',
        'Simplified display: traffic light system, clear SOH assessment',
        'Bilingual (DE/EN)',
        'Optimized for users without technical background',
      ],
    },
    script: {
      de: 'Die Easy-Version ist ein vereinfachter 4-Schritt-Assistent — Fahrzeug auswählen, Datei hochladen, Ergebnis anzeigen, Bericht exportieren. Sie nutzt ein Ampel-System für die Batteriebewertung und ist für Werkstattmitarbeiter ohne technischen Hintergrund optimiert.',
      en: 'The Easy version is a simplified 4-step wizard — select vehicle, upload file, view results, export report. It uses a traffic light system for battery assessment and is optimized for workshop staff without technical background.',
    },
    dataCallouts: [],
    questions: [],
    transition: {
      de: 'Kommen wir zur Diskussion — Stärken und Limitationen.',
      en: 'Let\'s move to the discussion — strengths and limitations.',
    },
  },

  // ============================================================
  // SECTION 6: DISCUSSION (3:00)
  // ============================================================

  'slide-discussion': {
    time: '13:30 – 14:00 (90 s)',
    bullets: {
      de: [
        'Stärken: ±1,6 Pp Genauigkeit, 3 × MEB-Verifikation (Elroq σ=0%), 0,1 Pp Temperaturrobustheit, 3-Tier-Kosten + OBDLink-Mehrwert, App',
        'OBDLink-Mehrwert klar machen: kontinuierliche Daten, die mit AVL nicht möglich sind, plus keine Folgekosten',
        '3-Tier-Kosten in einer Zeile: AUTEL ~8.000 € · AVL ~70 €/Jahr · OBDLink ~130 € einmalig',
        'Limitationen: MEB-fokussiert (BMW i3s nur kontextuell), nur AC, >97 % keine Alterung, ±4,6 Pp Gesamtunsicherheit, keine ISO-Validierung',
        'KEINE Temperaturkorrektur erwähnen als Limitation — die ist jetzt im Ausblick (Future Work)',
        'Ehrlich kommunizieren — zeigt wissenschaftliche Integrität',
      ],
      en: [
        'Strengths: ±1.6 pp accuracy, 3 × MEB verification (Elroq σ=0%), 0.1 pp temp robustness, 3-tier cost + OBDLink advantage, app',
        'Make OBDLink advantage clear: continuous data not possible with AVL, plus no recurring costs',
        '3-tier cost in one line: AUTEL ~€8000 · AVL ~€70/yr · OBDLink ~€130 one-off',
        'Limitations: MEB-focused (BMW i3s only contextual), AC only, >97% no aging, ±4.6 pp total uncertainty, no ISO validation',
        'Do NOT mention temp correction as limitation — moved to future work',
        'Communicate honestly — shows scientific integrity',
      ],
    },
    script: {
      de: 'Stärken: Wir erreichen eine reproduzierbare SOH-Bestimmung mit 1,6 Prozentpunkten Abweichung am VW ID.4, verifiziert auf der MEB-Plattform am Skoda Elroq mit perfekter Reproduzierbarkeit über sieben Messungen. Die kombinierte Methode ist mit 0,1 Prozentpunkten temperaturrobust. Der entscheidende OBDLink-Mehrwert: kontinuierliche Datenerfassung, die der AVL gar nicht leisten kann — bei einmalig 130 Euro und ohne Folgekosten, gegenüber 70 Euro pro Jahr beim AVL und 8.000 Euro beim AUTEL. Ehrlich auf der Limitationsseite: Die Arbeit ist MEB-fokussiert — der BMW i3s ist nur eine kontextuelle Vergleichsmessung im Backup. Wir hatten keine DC-Schnellladedaten, das Fahrzeug zeigt keine signifikante Alterung, und die Gesamtunsicherheit liegt bei rund ±4,6 Prozentpunkten — dominiert durch Methodenstreuung und SOC-Fenster. Eine unabhängige Laborvalidierung nach ISO 12405 war nicht möglich.',
      en: 'Strengths: reproducible SOH with 1.6 pp deviation on the VW ID.4, verified on the MEB platform at the Skoda Elroq with perfect reproducibility over seven measurements. Combined method is temperature-robust at 0.1 pp. Key OBDLink advantage: continuous data acquisition the AVL simply cannot provide — at €130 one-off with no recurring costs, vs. €70/year for AVL and €8000 for AUTEL. Honestly on limitations: the work is MEB-focused — BMW i3s is only a contextual comparison in backup. No DC fast-charging data, no significant aging in the measurement window, and total uncertainty is around ±4.6 pp — dominated by method spread and SOC window. Independent lab validation per ISO 12405 was not possible.',
    },
    dataCallouts: [
      'AUTEL ~8.000 € · AVL ~70 €/Jahr · OBDLink ~130 € einmalig',
      '±1,6 Pp · σ = 0 % (Elroq) · 0,1 Pp Temperaturrobustheit',
      '±4,6 Pp Gesamtunsicherheit (dominiert durch Methode + SOC)',
    ],
    questions: [
      {
        q: { de: 'Wie ließe sich die größte Limitation adressieren?', en: 'How could the biggest limitation be addressed?' },
        a: { de: 'Im Ausblick formuliert: Erweiterung auf weitere Plattformen (BMW i3s, Tesla, LFP) — die Methoden bleiben gleich, nur PIDs/Kanäle anpassen. Zusätzlich Fahrzeuge mit bekannter Degradation (50k–150k km) für ICA/DVA-Validierung und Temperaturkorrektur als zukünftige Forschung.', en: 'Formulated in outlook: extension to other platforms (BMW i3s, Tesla, LFP) — methods stay the same, only PIDs/channels need adjustment. Additionally vehicles with known degradation (50k–150k km) for ICA/DVA validation and temperature correction as future work.' },
      },
      {
        q: { de: 'Was kostet das gesamte Setup?', en: 'What does the full setup cost?' },
        a: { de: 'OBDLink MX+ ~130 Euro einmalig, plus Smartphone/Tablet (vorhanden), plus die Python-App (Open Source). Keine Folgekosten. Im direkten Vergleich: AVL HV-Check etwa 70 Euro pro Jahr Lizenzgebühr, AUTEL MaxiSYS Ultra rund 8.000 Euro einmalig.', en: 'OBDLink MX+ ~€130 one-off, plus smartphone/tablet (already owned), plus the Python app (open source). No recurring costs. Direct comparison: AVL HV-Check about €70/year license, AUTEL MaxiSYS Ultra around €8,000 one-off.' },
      },
    ],
    transition: {
      de: 'Damit zur Kernaussage meiner Arbeit.',
      en: 'This brings us to the core finding of my thesis.',
    },
  },

  'slide-uncertainty': {
    time: '26:30 – 28:00 (90 s)',
    bullets: {
      de: [
        'Unsicherheitsbudget: u_gesamt ≈ ±4,5 Pp',
        'u_Methode ~4 Pp (dominiert mit 88%!) — SOH_e vs. SOH_c Streuung',
        'u_SOC ~2 Pp — SOC-Fenster-Qualität',
        'u_Mess ~1 Pp — OBD-AVL Kreuzvalidierung',
        'u_Temp ~0,1 Pp — kompensierende Effekte',
        'Praxisrelevanz: Kategorien 10 Pp auseinander → ±4,5 Pp erlaubt zuverlässige Unterscheidung',
      ],
      en: [
        'Uncertainty budget: u_total ≈ ±4.5 pp',
        'u_method ~4 pp (dominates at 88%!) — SOH_e vs. SOH_c spread',
        'u_SOC ~2 pp — SOC window quality',
        'u_meas ~1 pp — OBD-AVL cross-validation',
        'u_temp ~0.1 pp — compensating effects',
        'Practical relevance: categories 10 pp apart → ±4.5 pp allows reliable distinction',
      ],
    },
    script: {
      de: 'Die Gesamtunsicherheit beträgt etwa plus/minus 4,5 Prozentpunkte — berechnet als Wurzel der Quadratsumme der vier Beiträge. Der dominierende Faktor mit 88 Prozent ist die methodische Unsicherheit — also die Hälfte der Streuung zwischen SOH_e und SOH_c. Der SOC-Fenster-Einfluss beträgt etwa 2 Prozentpunkte, die Messunsicherheit etwa 1, und der Temperatureffekt ist vernachlässigbar mit 0,1. Entscheidend für die Praxisrelevanz: Die Zustandskategorien liegen 10 Prozentpunkte auseinander — über 90 Prozent bedeutet Weiterverwendung, 80 bis 89 stationärer Speicher, unter 70 Recycling. Mit ±4,5 Prozentpunkten können wir diese Kategorien zuverlässig unterscheiden.',
      en: 'Total uncertainty is approximately ±4.5 pp — calculated as the root sum of squares of four contributions. The dominant factor at 88% is methodological uncertainty — the half-spread between SOH_e and SOH_c. SOC window influence is about 2 pp, measurement uncertainty about 1, and temperature effect is negligible at 0.1. Critical for practical relevance: condition categories are 10 pp apart — above 90% means continued use, 80-89% stationary storage, below 70% recycling. With ±4.5 pp we can reliably distinguish these categories.',
    },
    dataCallouts: [
      'u_gesamt / total ≈ ±4,5 Pp',
      'u_Methode / method = 88% des Gesamtbeitrags / of total',
      'Kategorieabstand / category spacing: 10 Pp',
    ],
    questions: [
      {
        q: { de: 'Wie könnte man die Unsicherheit weiter reduzieren?', en: 'How could uncertainty be further reduced?' },
        a: { de: 'Der Haupthebel ist u_Methode — ein ML-basierter Korrekturfaktor (Ridge, Random Forest), trainiert auf AVL-Referenzmessungen, könnte die SOH_c-Unterschätzung systematisch korrigieren. Außerdem DC-Ladedaten mit höherer C-Rate könnten die Integration verbessern.', en: 'The main lever is u_method — an ML-based correction factor (Ridge, Random Forest) trained on AVL reference measurements could systematically correct the SOH_c underestimation. Also DC charging data with higher C-rate could improve integration.' },
      },
    ],
    transition: {
      de: 'In der Diagrammgalerie finden Sie alle Flussdiagramme der Arbeit.',
      en: 'The diagram gallery contains all flowcharts from the thesis.',
    },
  },

  // ============================================================
  // SECTION 7: FLOWCHARTS (0:30)
  // ============================================================

  'slide-flowchart-gallery': {
    time: '28:00 – 28:30 (30 s)',
    bullets: {
      de: [
        'Galerie mit allen 39 PlantUML-Diagrammen (30 Flowcharts + 9 Architektur)',
        'Dropdown zum Auswählen — bei Bedarf öffnen',
        'Optional: kurz zeigen, dann weiter zum Fazit',
      ],
      en: [
        'Gallery with all 39 PlantUML diagrams (30 flowcharts + 9 architecture)',
        'Dropdown to select — open as needed',
        'Optional: briefly show, then move to conclusion',
      ],
    },
    script: {
      de: 'Hier finden Sie alle 39 Flussdiagramme aus der Arbeit — von der Datenverarbeitungspipeline über die SOH-Berechnungsalgorithmen bis zur Softwarearchitektur. Sie können jedes Diagramm über das Dropdown auswählen. Für die Diskussion stehen diese als Backup bereit.',
      en: 'Here you find all 39 flowcharts from the thesis — from data processing pipeline through SOH calculation algorithms to software architecture. You can select any diagram via the dropdown. These are available as backup for the discussion.',
    },
    dataCallouts: [],
    questions: [],
    transition: {
      de: 'Kommen wir zum Fazit.',
      en: 'Let\'s move to the conclusion.',
    },
  },

  // ============================================================
  // SECTION 8: CONCLUSION (1:30)
  // ============================================================

  'slide-conclusion': {
    time: '14:00 – 14:30 (30 s)',
    bullets: {
      de: [
        'Kernaussage prominent und klar — verifiziert auf der MEB-Plattform',
        'OBD-Adapter ~130 € einmalig, keine Folgekosten',
        'Drei Kennzahlen: 95,7 % kombinierter SOH · 0,1 Pp Temperaturrobustheit · 1,6 Pp AVL↔OBD',
        'Langsam und deutlich sprechen — dies ist der wichtigste Satz der Präsentation',
      ],
      en: [
        'Core claim prominent and clear — verified on the MEB platform',
        'OBD adapter ~€130 one-off, no recurring costs',
        'Three metrics: 95.7 % combined SOH · 0.1 pp temperature robustness · 1.6 pp AVL↔OBD',
        'Speak slowly and clearly — this is the most important sentence of the presentation',
      ],
    },
    script: {
      de: 'Die Kernaussage meiner Arbeit lautet: Die Kombination von energiebasierter und integrativer SOH-Methode ermöglicht eine reproduzierbare Bestimmung des Batteriezustands mit einem kostengünstigen OBD-Adapter für rund 130 Euro — einmalig und ohne Folgekosten — bei einer Abweichung von nur 1,6 Prozentpunkten zur professionellen Off-Board-Referenz. Verifiziert auf der MEB-Plattform an Skoda Elroq und Cupra Born. Drei Zahlen zum Mitnehmen: 95,7 Prozent kombinierter SOH, 0,1 Prozentpunkte Temperaturrobustheit, und 1,6 Prozentpunkte Übereinstimmung zwischen OBD und AVL.',
      en: 'The core finding of my thesis is: The combination of energy-based and integrative SOH methods enables reproducible battery health determination with a low-cost OBD adapter for about 130 euros — one-off and without recurring costs — at a deviation of only 1.6 percentage points from the professional off-board reference. Verified on the MEB platform at Skoda Elroq and Cupra Born. Three numbers to remember: 95.7% combined SOH, 0.1 pp temperature robustness, and 1.6 pp agreement between OBD and AVL.',
    },
    dataCallouts: [
      '95,7 % kombinierter SOH / combined SOH',
      '0,1 Pp Temperaturrobustheit / temperature robustness',
      '1,6 Pp AVL ↔ OBD · MEB-Verif. Elroq + Born',
    ],
    questions: [],
    transition: {
      de: 'Abschließend: Anwendungen und Ausblick.',
      en: 'Finally: applications and outlook.',
    },
  },

  'slide-outlook': {
    time: '14:30 – 14:50 (20 s)',
    bullets: {
      de: [
        'Anwendungen: Werkstätten, Flottenbetreiber, Versicherungen, Second Life',
        'Zukünftige Forschung — Erweiterung auf weitere Plattformen (BMW i3s, Tesla, LFP) ZUERST nennen',
        'Temperaturkorrektur (Arrhenius-Modell) als Bullet — kein Flowchart!',
        'Weitere: DC-Schnellladen, gealterte Fahrzeuge, ML-Korrektur, EU-Batteriepass',
        'Sehr kurz halten — direkt weiter zur Danke-Folie',
      ],
      en: [
        'Applications: workshops, fleet operators, insurance, second life',
        'Future research — extension to other platforms (BMW i3s, Tesla, LFP) FIRST',
        'Temperature correction (Arrhenius model) as bullet — no flowchart!',
        'Plus: DC fast charging, aged vehicles, ML correction, EU battery passport',
        'Keep very brief — straight to thank-you slide',
      ],
    },
    script: {
      de: 'Die entwickelten Verfahren sind direkt anwendbar in Werkstätten, bei Flottenbetreibern, bei Versicherungen und für die Second-Life-Klassifizierung. Für die Zukunft sehe ich vor allem die Erweiterung auf weitere Plattformen — BMW i3s, Tesla, LFP-Chemie. Die Methoden bleiben gleich, nur Kanäle und PIDs müssen angepasst werden. Außerdem Temperaturkorrektur, DC-Schnellladen, gealterte Fahrzeuge, ML-Korrektur und der EU-Batteriepass.',
      en: 'The developed methods are directly applicable in workshops, for fleet operators, for insurance, and for second-life classification. For the future, the priority is extension to other platforms — BMW i3s, Tesla, LFP chemistry. Methods stay the same, only channels and PIDs need adjustment. Also temperature correction, DC fast charging, aged vehicles, ML correction, and the EU battery passport.',
    },
    dataCallouts: [
      'BMW i3s · Tesla · LFP — Erweiterung als Future Work',
      'EU-Batteriepass ab 2027 / EU Battery Passport from 2027',
    ],
    questions: [],
    transition: {
      de: '',
      en: '',
    },
  },

  // Phase 20: closing Danke + Q&A invite
  'slide-thanks': {
    time: '14:50 – 15:00 (10 s)',
    bullets: {
      de: [
        'Kurzes „Vielen Dank für Ihre Aufmerksamkeit"',
        'Q&A-Einladung',
        'Acknowledgments NICHT alle einzeln vorlesen — die stehen auf der Folie',
        'Kurz Augenkontakt zum Prüfer, dann Bühne abgeben',
      ],
      en: [
        'Short "Thank you for your attention"',
        'Q&A invite',
        'Do NOT read out all acknowledgments — they are on the slide',
        'Brief eye contact with examiner, then yield the floor',
      ],
    },
    script: {
      de: 'Vielen Dank für Ihre Aufmerksamkeit — ich freue mich auf Ihre Fragen.',
      en: 'Thank you for your attention — I look forward to your questions.',
    },
    dataCallouts: [],
    questions: [],
    transition: {
      de: '',
      en: '',
    },
  },

  // ============================================================
  // BACKUP SLIDES
  // ============================================================

  'slide-backup-intersystem': {
    time: 'Backup',
    bullets: {
      de: [
        'Frage: Funktionieren die Systeme auch an anderen Fahrzeugen?',
        'BMW i3s: Alle 3 Systeme, Spannweite 0,4 Pp — exzellent',
        'Skoda Elroq: AVL + AUTEL → 100%, Neufahrzeug-Plausibilitätscheck',
        'Cupra Born: MEB-Übertragbarkeit bestätigt',
        'Renault Zoe: Nicht-MEB, plattformübergreifend einsetzbar',
      ],
      en: [
        'Question: Do the systems work on other vehicles?',
        'BMW i3s: all 3 systems, spread 0.4 pp — excellent',
        'Skoda Elroq: AVL + AUTEL → 100%, new vehicle plausibility check',
        'Cupra Born: MEB transferability confirmed',
        'Renault Zoe: non-MEB, cross-platform applicability',
      ],
    },
    script: {
      de: 'Ja — wir haben die drei Systeme an fünf Fahrzeugen getestet. Am BMW i3s stimmten alle drei Systeme auf 0,4 Prozentpunkte überein — eine exzellente Inter-System-Übereinstimmung. Am Skoda Elroq als Neufahrzeug bestätigten beide Systeme 100% SOH. Der Cupra Born als weiteres MEB-Fahrzeug bestätigt die Übertragbarkeit. Und die Renault Zoe zeigt, dass der Ansatz auch auf Nicht-MEB-Plattformen funktioniert.',
      en: 'Yes — we tested all three systems on five vehicles. On the BMW i3s, all three systems agreed within 0.4 pp — excellent inter-system agreement. On the Skoda Elroq as a new vehicle, both systems confirmed 100% SOH. The Cupra Born as another MEB vehicle confirms transferability. And the Renault Zoe shows the approach works on non-MEB platforms too.',
    },
    dataCallouts: [
      'BMW i3s: 0,4 Pp Inter-System-Spannweite / spread',
      'Skoda Elroq: σ = 0% über 7 Messungen / measurements',
    ],
    questions: [],
    transition: { de: '', en: '' },
  },

  'slide-backup-degradation': {
    time: 'Backup',
    bullets: {
      de: [
        'Eigene Messung: VW ID.4 (FP) ~1,7 Pp / 11k km',
        'Community: MEB-Plattform ~1 Pp / 10k km',
        'Bei ~1 Pp/10k km → 90% SOH erst nach ~100.000 km',
        'Innerhalb der VW-Garantie (8 Jahre / 160.000 km)',
      ],
      en: [
        'Own measurement: VW ID.4 (FP) ~1.7 pp / 11k km',
        'Community: MEB platform ~1 pp / 10k km',
        'At ~1 pp/10k km → 90% SOH only after ~100,000 km',
        'Within VW warranty (8 years / 160,000 km)',
      ],
    },
    script: {
      de: 'Die beobachtete Degradationsrate unseres privaten VW ID.4 liegt bei etwa 1,7 Prozentpunkten pro 11.000 Kilometer — etwas über der Community-Rate von 1 Prozentpunkt pro 10.000 Kilometer, was durch den kurzen Beobachtungszeitraum und Messstreuung erklärbar ist. Bei dieser Rate würde 90% SOH erst nach etwa 100.000 Kilometern erreicht — deutlich innerhalb der VW-Garantie von 8 Jahren oder 160.000 Kilometern.',
      en: 'The observed degradation rate of our private VW ID.4 is about 1.7 pp per 11,000 km — slightly above the community rate of 1 pp per 10,000 km, explainable by the short observation period and measurement variance. At this rate, 90% SOH would only be reached after about 100,000 km — well within the VW warranty of 8 years or 160,000 km.',
    },
    dataCallouts: [
      '~1 Pp / 10.000 km (Community)',
      '90% SOH nach ~100.000 km',
    ],
    questions: [],
    transition: { de: '', en: '' },
  },

  'slide-backup-avl-timeseries': {
    time: 'Backup',
    bullets: {
      de: [
        '5 AVL-Messungen über 12 Monate am VW ID.4',
        'SOH-Bereich: 97,3% bis 100,0%',
        'σ = 1,20% — dominiert durch Temperatur',
        'Doppelmessung 25.04.: identisch (100,0%) → hohe Kurzzeit-Reproduzierbarkeit',
        'Dezember-Wert (97,3% bei 24°C) am repräsentativsten',
      ],
      en: [
        '5 AVL measurements over 12 months on VW ID.4',
        'SOH range: 97.3% to 100.0%',
        'σ = 1.20% — dominated by temperature',
        'Double measurement Apr 25: identical (100.0%) → high short-term reproducibility',
        'December value (97.3% at 24°C) most representative',
      ],
    },
    script: {
      de: 'Die fünf AVL-Messungen über 12 Monate zeigen eine Streuung von σ = 1,2%. Auffällig: Bei niedrigen Temperaturen (4°C, 10,5°C) meldet auch das AVL einen SOH von 100% — kein System ist immun gegen Temperatureinflüsse. Die Doppelmessung am 25. April lieferte identische Ergebnisse, was eine hohe Kurzzeit-Reproduzierbarkeit bestätigt. Der Dezember-Wert von 97,3% bei 24°C wird als am repräsentativsten betrachtet.',
      en: 'The five AVL measurements over 12 months show σ = 1.2%. Notably: at low temperatures (4°C, 10.5°C), even the AVL reports 100% SOH — no system is immune to temperature effects. The double measurement on April 25 delivered identical results, confirming high short-term reproducibility. The December value of 97.3% at 24°C is considered most representative.',
    },
    dataCallouts: [
      'σ = 1,20% über 12 Monate / months',
      'Doppelmessung / double measurement: 100,0% = 100,0%',
    ],
    questions: [],
    transition: { de: '', en: '' },
  },

  'slide-backup-methods-detail': {
    time: 'Backup',
    bullets: {
      de: [
        'Alle 6 Methoden aufsteigend sortiert',
        'SOH_e (direkt) = 99,6% — genaueste',
        'SOH_R = 100% — Baseline-definiert',
        'AVL = 97,3% — Off-Board-Vergleich',
        'Kombiniert = 95,7% — robustester Wert',
        'SOH_c = 91,8% — systematische Unterschätzung',
        'SOH_kap = 89,7% — größte Abweichung',
      ],
      en: [
        'All 6 methods sorted ascending',
        'SOH_e (direct) = 99.6% — most accurate',
        'SOH_R = 100% — baseline-defined',
        'AVL = 97.3% — off-board comparison',
        'Combined = 95.7% — most robust value',
        'SOH_c = 91.8% — systematic underestimation',
        'SOH_cap = 89.7% — largest deviation',
      ],
    },
    script: {
      de: 'Hier die detaillierte Aufschlüsselung aller sechs Methoden. Die Spannweite von 89,7% bis 100% zeigt, dass jede Methode ihre eigenen Stärken hat. SOH_e als BMS-Direktwert ist am genauesten. SOH_c unterschätzt aufgrund kumulativer Integrationsfehler bei langer AC-Ladung. Der kombinierte Wert gleicht diese Fehler aus und liegt mit 95,7% am nächsten am AVL-Ergebnis.',
      en: 'Here the detailed breakdown of all six methods. The spread from 89.7% to 100% shows each method has its own strengths. SOH_e as BMS direct value is most accurate. SOH_c underestimates due to cumulative integration errors during long AC charging. The combined value compensates these errors and at 95.7% lies closest to the AVL result.',
    },
    dataCallouts: [
      'Spannweite / spread: 89,7% – 100,0% = 10,3 Pp',
    ],
    questions: [],
    transition: { de: '', en: '' },
  },

  'slide-backup-charging': {
    time: 'Backup',
    bullets: {
      de: [
        'CC-CV Ladeprofil: AC 11 kW, ~330→397 V, ~30 A CC',
        'C-Rate: 0,1–0,15 C → quasi-stationär',
        'Ladeenergie: 73,9 kWh in 465 min',
        'DC-Puls: R_i Laden 40 mΩ, Entladen 33 mΩ bei 51% SOC',
        'Asymmetrie ~22% — typisch für NMC',
      ],
      en: [
        'CC-CV profile: AC 11 kW, ~330→397 V, ~30 A CC',
        'C-rate: 0.1–0.15 C → quasi-stationary',
        'Charge energy: 73.9 kWh in 465 min',
        'DC pulse: R_i charge 40 mΩ, discharge 33 mΩ at 51% SOC',
        'Asymmetry ~22% — typical for NMC',
      ],
    },
    script: {
      de: 'Das CC-CV-Profil zeigt die typische Ladekurve unserer AC-Wallbox-Messungen. Die niedrige C-Rate von 0,1 bis 0,15 C ermöglicht quasi-stationäre Bedingungen. 73,9 kWh Ladeenergie bei 77 kWh Nennkapazität ergibt direkt den SOH_e von 95,97%. Der DC-Puls-Test bei 51% SOC zeigt 40 mΩ Ladewiderstand und 33 mΩ Entladewiderstand — eine 22%-Asymmetrie, die physikalisch durch die unterschiedliche Impedanz an der Grenzfläche erklärbar ist.',
      en: 'The CC-CV profile shows the typical charging curve of our AC wallbox measurements. The low C-rate of 0.1 to 0.15 C enables quasi-stationary conditions. 73.9 kWh charge energy at 77 kWh nominal capacity directly yields SOH_e of 95.97%. The DC pulse test at 51% SOC shows 40 mΩ charge resistance and 33 mΩ discharge resistance — a 22% asymmetry physically explained by different impedance at the interface.',
    },
    dataCallouts: [
      '73,9 kWh / 77 kWh = 95,97%',
      'R_i: 40 mΩ (Laden) / 33 mΩ (Entladen)',
    ],
    questions: [],
    transition: { de: '', en: '' },
  },

  'slide-backup-recommendations': {
    time: 'Backup',
    bullets: {
      de: [
        '5 konkrete Empfehlungen:',
        '1. SOH_e als bevorzugte Einzelmethode (≤3 Pp Abweichung)',
        '2. Kombinierten SOH als Gesamtwert (±1,6 Pp)',
        '3. SOC-Fenster maximieren (>80%, min. 50%)',
        '4. Temperatur 15–30°C',
        '5. Mehrere Systeme für kritische Entscheidungen',
      ],
      en: [
        '5 concrete recommendations:',
        '1. SOH_e as preferred single method (≤3 pp deviation)',
        '2. Combined SOH as overall value (±1.6 pp)',
        '3. Maximize SOC window (>80%, min. 50%)',
        '4. Temperature 15–30°C',
        '5. Multiple systems for critical decisions',
      ],
    },
    script: {
      de: 'Fünf konkrete Empfehlungen aus den Ergebnissen: Erstens SOH_e als genaueste Einzelmethode verwenden. Zweitens den kombinierten SOH als robustesten Gesamtwert. Drittens das SOC-Fenster maximieren — der wichtigste beeinflussbare Parameter. Viertens im Temperaturbereich 15 bis 30 Grad messen. Und fünftens für sicherheitskritische Entscheidungen wie Second Life oder Garantieprüfung mindestens zwei Systeme kombinieren.',
      en: 'Five concrete recommendations from the results: First, use SOH_e as the most accurate single method. Second, the combined SOH as most robust overall value. Third, maximize the SOC window — the most controllable parameter. Fourth, measure at 15 to 30°C. And fifth, for safety-critical decisions like second life or warranty checks, combine at least two systems.',
    },
    dataCallouts: [],
    questions: [],
    transition: { de: '', en: '' },
  },

  'slide-backup-battery-passport': {
    time: 'Backup',
    bullets: {
      de: [
        'EU-Verordnung 2023/1542: ab 2027 digitaler Batteriepass Pflicht',
        'Unsere App erfasst bereits Großteil der geforderten Parameter',
        'Second-Life-Grading: A (≥90%), B (80–89%), C (70–79%), D (<70%)',
        'Unser VW ID.4 mit 95,7% → Grade A',
        '±4,5 Pp Unsicherheit bei 10 Pp Kategorieabstand → zuverlässige Einordnung',
      ],
      en: [
        'EU Regulation 2023/1542: digital battery passport mandatory from 2027',
        'Our app already captures most required parameters',
        'Second-life grading: A (≥90%), B (80–89%), C (70–79%), D (<70%)',
        'Our VW ID.4 at 95.7% → Grade A',
        '±4.5 pp uncertainty at 10 pp category spacing → reliable classification',
      ],
    },
    script: {
      de: 'Ab 2027 wird der EU-Batteriepass für Traktionsbatterien über 2 kWh verpflichtend. Unsere Anwendung erfasst bereits den Großteil der geforderten Parameter und könnte als Grundlage für den strukturierten Export dienen. Das Second-Life-Grading ordnet Batterien in vier Kategorien ein — unser VW ID.4 mit 95,7% fällt klar in Kategorie A. Und mit unserer Unsicherheit von ±4,5 Prozentpunkten bei 10 Prozentpunkten Kategorieabstand ist eine zuverlässige Einordnung möglich.',
      en: 'From 2027, the EU battery passport becomes mandatory for traction batteries above 2 kWh. Our application already captures most required parameters and could serve as a basis for structured export. The second-life grading classifies batteries into four categories — our VW ID.4 at 95.7% clearly falls into category A. And with our uncertainty of ±4.5 pp at 10 pp category spacing, reliable classification is possible.',
    },
    dataCallouts: [
      'EU-Batteriepass ab 2027',
      'Grade A: ≥90% · Grade D: <70%',
    ],
    questions: [],
    transition: { de: '', en: '' },
  },

  'slide-backup-app': {
    time: 'Backup',
    bullets: {
      de: [
        'Pro Mode: Streamlit (Port 8501) — Forschungsorientiert',
        'Easy Mode: React + FastAPI (Port 8000) — Werkstatt-Assistent',
        'Import: OBD CSV, AVL PDF, AUTEL-Daten',
        '6 SOH-Methoden parallel, SQLite-DB, PDF-Export',
        'Version 2.9.3, zweisprachig (DE/EN)',
      ],
      en: [
        'Pro Mode: Streamlit (port 8501) — research-oriented',
        'Easy Mode: React + FastAPI (port 8000) — workshop wizard',
        'Import: OBD CSV, AVL PDF, AUTEL data',
        '6 SOH methods parallel, SQLite DB, PDF export',
        'Version 2.9.3, bilingual (DE/EN)',
      ],
    },
    script: {
      de: 'Die Software besteht aus zwei Modi: Der Pro-Modus als Streamlit-App bietet den vollen Funktionsumfang für Forschung — alle sechs SOH-Methoden, interaktive Charts, ICA/DVA-Analyse und PDF-Berichte. Der Easy-Modus ist ein vereinfachter React-Frontend-Assistent für Werkstätten. Beide Modi teilen denselben Analyse-Kern und die SQLite-Datenbank. Die App verarbeitet Daten aller drei Diagnosesysteme gleichwertig und berechnet alle Methoden in unter 30 Sekunden.',
      en: 'The software consists of two modes: the Pro mode as a Streamlit app offers full functionality for research — all six SOH methods, interactive charts, ICA/DVA analysis and PDF reports. The Easy mode is a simplified React frontend wizard for workshops. Both modes share the same analysis core and SQLite database. The app processes data from all three diagnostic systems equally and calculates all methods in under 30 seconds.',
    },
    dataCallouts: [
      'Version 2.9.3 · <30 s Berechnung / calculation',
    ],
    questions: [],
    transition: { de: '', en: '' },
  },

};
