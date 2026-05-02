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
    time: '0:00 – 0:20 (20 s)',
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
    time: '0:20 – 0:50 (30 s)',
    bullets: {
      de: [
        'Fünf Blöcke: Motivation → Theorie → Methodik → Ergebnisse → Diskussion & Fazit',
        'Schwerpunkt: Methodik (~3,5 min) und Ergebnisse (~5 min)',
        'Am Schluss zwei kurze Live-Demos der App',
      ],
      en: [
        'Five blocks: Motivation → Theory → Methodology → Results → Discussion & Conclusion',
        'Focus: Methodology (~3.5 min) and Results (~5 min)',
        'Two short live demos of the app at the end',
      ],
    },
    script: {
      de: 'Die nächsten 15 Minuten habe ich in fünf Blöcke aufgeteilt. Erst zeige ich kurz, warum das Thema relevant ist. Dann gehe ich auf die Grundlagen ein — wie Batterien altern und wie wir SOH überhaupt definieren. Der Hauptteil liegt auf Methodik und Ergebnissen: zwei Hauptdiagnosesysteme, ein standardisiertes Messprotokoll und sechs SOH-Methoden im Vergleich. Am Ende ordne ich alles ein und sage Ihnen, was ich daraus für die Praxis empfehle.',
      en: 'I have split the next 15 minutes into five blocks. First I will briefly explain why the topic matters. Then I will cover the basics — how batteries age and how we actually define SOH. The main part is methodology and results: two primary diagnostic systems, a standardized measurement protocol and six SOH methods compared head-to-head. At the end I will put it all in context and tell you what I would recommend for practice.',
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
    time: '0:50 – 1:50 (60 s)',
    bullets: {
      de: [
        '5 Problemaspekte als Pentagon — Fragmente einzeln auslösen',
        '1. Batterie = 40–50 % des Fahrzeugwerts',
        '2. BMS proprietär, ±5–10 % Abweichung',
        '3. Keine einheitliche SOH-Definition über Hersteller',
        '4. Diagnose-Tools widersprechen sich',
        '5. Unter 70–80 % EOL → Second Life',
        'Am Schluss: Kernproblem-Box einblenden',
      ],
      en: [
        '5 problem aspects as pentagon — trigger fragments one by one',
        '1. Battery = 40–50 % of vehicle value',
        '2. BMS proprietary, ±5–10 % deviation',
        '3. No unified SOH definition across manufacturers',
        '4. Diagnostic tools contradict each other',
        '5. Below 70–80 % EOL → second life',
        'End: show core-problem box',
      ],
    },
    script: {
      de: 'Die Batterie ist mit 40 bis 50 Prozent das teuerste Bauteil im Elektroauto. Trotzdem wissen wir kaum, wie es ihr geht. Die Hersteller halten ihre SOH-Algorithmen geheim — und die weichen je nach Hersteller um 5 bis 10 Prozent voneinander ab. Eine einheitliche Definition gibt es nicht. Verschiedene Diagnosegeräte liefern für dasselbe Fahrzeug ganz unterschiedliche Werte. Und auch für Second Life — also die Weiterverwendung als stationärer Speicher — fehlt eine verlässliche Grundlage. Konkret heißt das: Wer ein gebrauchtes Elektroauto kauft, weiß nicht wirklich, wie gut die Batterie noch ist.',
      en: 'The battery is 40 to 50 percent of the car\'s value — the most expensive single component. Yet we barely know how it is doing. Manufacturers keep their SOH algorithms secret, and the values differ by 5 to 10 percent between brands. There is no unified definition. Different diagnostic tools give different numbers for the same car. And for second life — repurposing the battery as stationary storage — we lack a reliable basis. In concrete terms: when you buy a used EV, you do not really know how good the battery still is.',
    },
    dataCallouts: [
      '40–50 % Fahrzeugwert / vehicle value',
      '±5–10 % BMS-Abweichung / BMS deviation',
      '70–80 % EOL-Schwelle / EOL threshold',
    ],
    questions: [
      {
        q: { de: 'Warum nicht einfach den BMS-SOH-Wert verwenden?', en: 'Why not just use the BMS SOH value?' },
        a: { de: 'Weil wir nicht wissen, wie er berechnet wird. Die BMS-Algorithmen sind herstellerspezifisch und nicht öffentlich; in der Literatur (Waag 2014) sind Abweichungen von 5 bis 10 Prozent dokumentiert. Vergleichen kann man die Werte deshalb nicht.', en: 'Because we do not know how it is calculated. The BMS algorithms are manufacturer-specific and not public; the literature (Waag 2014) reports deviations of 5 to 10 percent. So you cannot compare the values across vehicles.' },
      },
    ],
    transition: {
      de: 'Genau hier setzt meine Arbeit an — Forschungslücke und mein Beitrag dazu.',
      en: 'This is exactly where my work picks up — research gap and my contribution.',
    },
  },

  // Phase 20: slide-gap + slide-contributions merged into one slide
  'slide-gap-contributions': {
    time: '1:50 – 2:50 (60 s)',
    bullets: {
      de: [
        'Lücke: BMS proprietär ±5–10 % · externe Tools widersprüchlich · meiste Studien Laborzellen',
        'Forschungsfrage: SOH reproduzierbar + praxistauglich, On-/Off-Board',
        'Vier Beiträge im Quadrat: B1 Evaluation · B2 Protokoll · B3 Software · B4 Einflussfaktoren',
        'B1-Wording: zwei Hauptsysteme + AUTEL ergänzend',
      ],
      en: [
        'Gap: BMS proprietary ±5–10 % · external tools contradict · most studies on lab cells',
        'Research question: SOH reproducible + practical, on-/off-board',
        'Four contributions in a square: B1 evaluation · B2 protocol · B3 software · B4 influence factors',
        'B1 wording: two primary systems + AUTEL supplementary',
      ],
    },
    script: {
      de: 'Die Lücke ist schnell erklärt: Die BMS-Werte sind proprietär und weichen um 5 bis 10 Prozent ab. Externe Diagnosegeräte liefern unterschiedliche Werte. Und die meisten Studien arbeiten mit Laborzellen, nicht mit echten Fahrzeugen. Eine reproduzierbare Methodik am realen Auto fehlt also. Meine Forschungsfrage: Wie bestimme ich den SOH reproduzierbar — On-Board und Off-Board? Dazu vier Beiträge. Erstens: Ich vergleiche zwei Hauptdiagnosesysteme — AVL und OBDLink — ergänzt durch einen AUTEL-Snapshot. Zweitens: ein standardisiertes Messprotokoll. Drittens: sechs SOH-Methoden in einer Python-App. Und viertens: ich messe, wie Temperatur, SOC-Fenster und Ladeleistung den SOH beeinflussen.',
      en: 'The gap is quick to explain: BMS values are proprietary and differ by 5 to 10 percent. External diagnostic devices deliver different values. And most studies use lab cells, not real vehicles. So a reproducible methodology on a real car is missing. My research question: How do I determine SOH reproducibly — on-board and off-board? This leads to four contributions. First, I compare two primary diagnostic systems — AVL and OBDLink — supplemented by an AUTEL snapshot. Second, a standardized measurement protocol. Third, six SOH methods in a Python app. And fourth, I measure how temperature, SOC window and charging power affect SOH.',
    },
    dataCallouts: [
      '2 Hauptsysteme + 1 ergänzend / 2 primary + 1 supplementary',
      '6 SOH-Berechnungsmethoden / calculation methods',
      '33 Einzelmessungen / individual measurements',
    ],
    questions: [
      {
        q: { de: 'Welche Studien haben Sie als Stand der Technik herangezogen?', en: 'Which studies did you use as state of the art?' },
        a: { de: 'Vor allem Xiong 2018 zu BMS-Algorithmen, Waag 2014 zu Impedanzmethoden und Berecibar 2016 zur Degradationsdiagnose. Aber alle drei arbeiten mit Laborzellen — nicht mit echten Fahrzeugen und nicht mit kommerziellen Diagnosegeräten.', en: 'Mainly Xiong 2018 on BMS algorithms, Waag 2014 on impedance methods and Berecibar 2016 on degradation diagnosis. But all three work with lab cells — not with real vehicles and not with commercial diagnostic devices.' },
      },
    ],
    transition: {
      de: 'Bevor wir zur Methodik kommen, erst kurz die Grundlagen.',
      en: 'Before we get to the methodology, a quick word on the basics.',
    },
  },

  // ============================================================
  // SECTION 3: THEORY (3:00)
  // ============================================================

  'slide-battery-basics': {
    time: '2:50 – 3:30 (40 s)',
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
      de: 'Li-Ionen-Batterien altern auf zwei Wegen. Erstens kalendarisch — sie altern, auch wenn man sie nicht nutzt: Die SEI-Schicht wächst, die Kathode zersetzt sich, der Elektrolyt baut sich ab. Das geht exponentiell schneller, je wärmer die Batterie ist — Stichwort Arrhenius. Zweitens zyklisch — durch jedes Laden und Entladen. Die Zellen dehnen sich aus und ziehen sich zusammen, das gibt Mikrorisse. Bei niedriger Temperatur, hohem SOC und hoher Ladeleistung kann Lithium-Plating entstehen — das ist sicherheitskritisch. Unser Testfahrzeug ist ein VW ID.4 mit NMC-712-Pouch-Zellen: 288 Stück, 77 kWh, 300 bis 408 Volt.',
      en: 'Li-ion batteries age in two ways. First, calendar aging — they age even when you do not use them: the SEI layer grows, the cathode breaks down, the electrolyte decomposes. This goes exponentially faster the warmer the battery is — Arrhenius behaviour. Second, cyclic aging — from every charge and discharge. The cells expand and contract, which causes micro-cracks. At low temperature, high SOC and high charging power, lithium plating can form — that is a safety risk. Our test vehicle is a VW ID.4 with NMC 712 pouch cells: 288 cells, 77 kWh, 300 to 408 volts.',
    },
    dataCallouts: [
      'NMC 712 · 288 Zellen · 77 kWh · 300–408 V',
    ],
    questions: [
      {
        q: { de: 'Warum NMC und nicht LFP?', en: 'Why NMC and not LFP?' },
        a: { de: 'Weil unser VW ID.4 NMC 712 verbaut hat. LFP wäre für die Zukunft spannend zu vergleichen — besonders weil LFP eine flachere OCV-Kurve hat. Das macht die ICA-Analyse schwieriger.', en: 'Because our VW ID.4 has NMC 712 installed. LFP would be exciting to compare in the future — especially because LFP has a flatter OCV curve. That makes ICA analysis harder.' },
      },
    ],
    transition: {
      de: 'Jetzt zu den fünf SOH-Definitionen, mit denen ich arbeite.',
      en: 'Now to the five SOH definitions I work with.',
    },
  },

  'slide-soh-definitions': {
    time: '3:30 – 4:10 (40 s)',
    bullets: {
      de: [
        '5 Methoden nacheinander einblenden — Gleichungen kurz erklären',
        'SOH_cap: BMS-Direktwert (kapazitätsbasiert)',
        'SOH_e: energiebasiert (∫V·I dt / E_nenn) — genaueste Einzelmethode',
        'SOH_c: Coulomb-Counting (∫|I| dt / Q_nenn) — unterschätzt systematisch',
        'SOH_R: Innenwiderstand — HPPC (Hybrid Pulse Power Characterization)',
        'SOH_komb: (SOH_e + SOH_c) / 2 — empfohlener Gesamtwert',
        'Jede Methode erfasst einen anderen Alterungsaspekt',
      ],
      en: [
        'Reveal 5 methods one by one — explain equations briefly',
        'SOH_cap: BMS direct value (capacity-based)',
        'SOH_e: energy-based (∫V·I dt / E_nom) — most accurate single method',
        'SOH_c: Coulomb counting (∫|I| dt / Q_nom) — systematically underestimates',
        'SOH_R: internal resistance — HPPC (Hybrid Pulse Power Characterization)',
        'SOH_comb: (SOH_e + SOH_c) / 2 — recommended overall value',
        'Each method captures a different aspect of aging',
      ],
    },
    script: {
      de: 'Ich rechne mit fünf komplementären SOH-Methoden. SOH_cap nimmt den BMS-Wert direkt — also was das Batterie-Management selbst meldet. SOH_e ist energiebasiert: Ich integriere Spannung mal Strom über die ganze Ladung — die genaueste Einzelmethode. SOH_c ist Coulomb-Counting, also nur den Strom integriert. Das unterschätzt systematisch um etwa 5,5 Prozentpunkte, weil sich bei langer AC-Ladung kleine Messfehler aufaddieren. SOH_R schaut auf den Innenwiderstand — Baseline zu aktuell. Das ist die HPPC-Methode, also Hybrid Pulse Power Characterization. Und der kombinierte SOH — Mittelwert aus SOH_e und SOH_c — gleicht die systematischen Fehler der beiden aus. Das ist mein robustester Gesamtwert.',
      en: 'I work with five complementary SOH methods. SOH_cap takes the BMS value directly — what the battery management itself reports. SOH_e is energy-based: I integrate voltage times current over the whole charge — the most accurate single method. SOH_c is Coulomb counting, only the current integrated. That systematically underestimates by about 5.5 percentage points because small measurement errors add up over a long AC charge. SOH_R looks at the internal resistance — baseline vs. current. That is the HPPC method — Hybrid Pulse Power Characterization. And the combined SOH — the mean of SOH_e and SOH_c — compensates for the systematic errors of both. That is my most robust overall value.',
    },
    dataCallouts: [
      'SOH_e: genaueste Einzelmethode / most accurate single method',
      'SOH_c: ~5,5 Pp systematische Unterschätzung / systematic underestimation',
    ],
    questions: [
      {
        q: { de: 'Warum nicht auch EIS (Impedanzspektroskopie)?', en: 'Why not also EIS (impedance spectroscopy)?' },
        a: { de: 'EIS braucht spezielle Laborausrüstung — das geht nicht über einen OBD-Adapter. Ich habe es theoretisch behandelt, aber nicht implementiert. Mein Fokus liegt auf Methoden, die man im Werkstattalltag tatsächlich einsetzen kann.', en: 'EIS needs specialized lab equipment — you cannot do it through an OBD adapter. I covered it theoretically but did not implement it. My focus is on methods you can actually use in workshop practice.' },
      },
    ],
    transition: {
      de: 'Jetzt zeige ich Ihnen die Hauptdiagnosesysteme und unser Messprotokoll.',
      en: 'Now let me show you the primary diagnostic systems and our measurement protocol.',
    },
  },

  // ============================================================
  // SECTION 4: METHODOLOGY (6:00)
  // ============================================================

  'slide-tools': {
    time: '4:10 – 5:10 (60 s)',
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
      de: 'Ich nutze zwei Hauptdiagnosesysteme — beide greifen über OBD auf das BMS zu. Der AVL HV-Check ist meine Snapshot-Referenz und kostet rund 70 Euro im Jahr als Lizenz. Der OBDLink MX+ ist der eigentliche Mehrwert dieser Arbeit: ein Consumer-Adapter für 130 Euro, einmalig, keine Folgekosten — und liefert kontinuierliche Zeitreihen. Genau das kann der AVL nicht. Der AUTEL kommt nur ergänzend dazu, für punktuelle Snapshot-Vergleiche. Oben das 3-Ebenen-Modell: Im Auto läuft das BMS, die beiden Hauptsysteme lesen on-board aus, und die eigentliche SOH-Berechnung passiert nachgelagert in meiner Python-App.',
      en: 'I use two primary diagnostic systems — both access the BMS via OBD. The AVL HV-Check is my snapshot reference and costs about 70 euros per year on a license. The OBDLink MX+ is the actual added value of this work: a consumer adapter at 130 euros, one-off, no recurring costs — and it delivers continuous time series. That is exactly what the AVL cannot do. The AUTEL only comes in as a supplement, for spot snapshot comparisons. On top the 3-level model: in the car runs the BMS, the two primary systems read on-board, and the actual SOH calculation happens downstream in my Python app.',
    },
    dataCallouts: [
      'AVL: ~70 €/Jahr Lizenz · OBDLink: ~130 € einmalig · AUTEL: ~8.000 €',
      '96 Zellspannungen + 24 Temperatursensoren via OBD',
    ],
    questions: [
      {
        q: { de: 'Warum nicht direkt an der Batterie messen statt über OBD?', en: 'Why not measure directly at the battery instead of via OBD?' },
        a: { de: 'Weil das einen Eingriff ins Hochvoltsystem bedeuten würde — sicherheitskritisch und im Werkstattalltag nicht praktikabel. Über OBD bekomme ich dieselben Daten zerstörungsfrei und standardisiert.', en: 'Because that would mean intervening in the high-voltage system — safety-critical and not practical in workshop use. Via OBD I get the same data non-destructively and standardized.' },
      },
      {
        q: { de: 'Warum ist der AUTEL nicht Hauptsystem?', en: 'Why is the AUTEL not a primary system?' },
        a: { de: 'Weil ich mit dem AUTEL nur Snapshot-Vergleichsmessungen gemacht habe. Die kontinuierlichen Daten — die Grundlage für meine SOH-Berechnungen — kommen vom OBDLink. Deshalb ergänzend, nicht primär.', en: 'Because I only did snapshot comparison measurements with the AUTEL. The continuous data — the basis for my SOH calculations — comes from the OBDLink. So it is supplementary, not primary.' },
      },
    ],
    transition: {
      de: 'Wie genau sieht das Messprotokoll aus?',
      en: 'What exactly does the measurement protocol look like?',
    },
  },

  'slide-protocol': {
    time: '5:10 – 5:50 (40 s)',
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
      de: 'Mein Messprotokoll hat fünf Phasen. Zuerst entlade ich das Fahrzeug bis Display-SOC null Prozent und dokumentiere die Umgebungstemperatur. Dann schließe ich den OBDLink MX+ an und wähle alle relevanten BMS-Parameter aus — SOC, Spannung, Strom, 96 Zellgruppen und 24 Temperatursensoren. Wichtig: Die Aufzeichnung muss vor dem Ladestart laufen, damit ich den kompletten Zyklus von 0 bis 100 Prozent mitbekomme. Den CSV-Export ziehe ich dann in meine Python-App, die rechnet alle SOH-Methoden automatisch durch.',
      en: 'My measurement protocol has five phases. First, I discharge the vehicle to display SOC zero percent and document the ambient temperature. Then I connect the OBDLink MX+ and select all relevant BMS parameters — SOC, voltage, current, 96 cell groups and 24 temperature sensors. Important: recording has to be running before charging starts, so I capture the full 0 to 100 percent cycle. The CSV export then goes into my Python app, which automatically runs all SOH methods.',
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
    time: '5:50 – 6:30 (40 s)',
    bullets: {
      de: [
        'Phase 1: Entladung durch normales Fahren — kein spezieller Modus',
        'Display-SOC = 0 % ≈ BMS-SOC 5,75 %',
        'Nutzbares Fenster: ~90 % der physikalischen Kapazität',
        'Phase 2 (CC-CV-Ladung) folgt direkt — Details im Backup',
      ],
      en: [
        'Phase 1: discharge through normal driving — no special mode',
        'Display SOC = 0 % ≈ BMS SOC 5.75 %',
        'Usable window: ~90 % of physical capacity',
        'Phase 2 (CC-CV charging) follows directly — details in backup',
      ],
    },
    script: {
      de: 'Die Entladung läuft durch normales Fahren bis Display-SOC null Prozent — kein spezieller Modus, einfach fahren. Wichtig zu wissen: Display-SOC null entspricht BMS-SOC etwa 5,75 Prozent. Das BMS hält also eine Pufferreserve zurück. Das nutzbare Fenster ist damit rund 90 Prozent der physikalischen Kapazität. Direkt im Anschluss läuft die CC-CV-Ladung bis 100 Prozent — die Details dazu habe ich im Backup.',
      en: 'Discharge runs through normal driving down to display SOC zero percent — no special mode, just drive. Important to know: display SOC zero corresponds to BMS SOC of about 5.75 percent. The BMS keeps a buffer reserve. So the usable window is around 90 percent of physical capacity. Right after that, the CC-CV charge runs up to 100 percent — details on that are in the backup.',
    },
    dataCallouts: [
      'Display-SOC 0% = BMS-SOC ≈ 5,75%',
      'Nutzbares Fenster / usable window ≈ 90%',
    ],
    questions: [],
    transition: {
      de: 'Damit zu den Versuchsfahrzeugen.',
      en: 'And now to the test vehicles.',
    },
  },

  'slide-charging': {
    time: 'Backup (charging detail demoted in Phase 20)',
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
    time: '6:30 – 7:30 (60 s)',
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
      de: 'Insgesamt 33 Einzelmessungen über ein Jahr — Schwerpunkt MEB-Plattform. Mein Primärfahrzeug ist ein institutseigener VW ID.4: 77-kWh-NMC-712-Batterie, 288 Zellen, 10.801 Kilometer, aktueller BMS-SOH 97,3 Prozent. Als Hauptsysteme nutze ich den AVL HV-Check und den OBDLink — der AUTEL läuft nur ergänzend mit. Dass sich die Methodik auf die MEB-Plattform übertragen lässt, habe ich am Skoda Elroq verifiziert: sieben AVL-Messungen über neun Monate, Streuung gleich null. Der Cupra Born kommt als ergänzendes Verifikationsfahrzeug dazu.',
      en: '33 individual measurements over one year — focus on the MEB platform. My primary vehicle is an institute-owned VW ID.4: 77 kWh NMC 712 battery, 288 cells, 10,801 km, current BMS SOH 97.3 percent. As primary systems I use the AVL HV-Check and the OBDLink — the AUTEL only runs alongside as a supplement. To verify that the methodology transfers to the MEB platform, I checked it on the Skoda Elroq: seven AVL measurements over nine months, zero spread. The Cupra Born comes in as a supplementary verification vehicle.',
    },
    dataCallouts: [
      '33 Einzelmessungen Dez 2024 – Dez 2025',
      'VW ID.4 (Haupt) · Elroq (σ=0%, 7 AVL) · Born (ergänzend)',
      'SOH 97,3% (AVL, VW ID.4 IfE)',
    ],
    questions: [
      {
        q: { de: 'Warum kein BMW i3s als Verifikation?', en: 'Why no BMW i3s as verification?' },
        a: { de: 'Ich habe am BMW i3s zwar Vergleichsmessungen gemacht — und alle drei Systeme stimmen dort auf 0,4 Prozentpunkte überein. Aber ich habe mich bewusst auf die MEB-Plattform konzentriert, weil ich die kontinuierliche OBD-Datenerfassung mit allen sechs Methoden nur dort vollständig durchgezogen habe. Die BMW-Messungen liegen im Backup als kontextueller Vergleich, nicht als Validierung. Die Erweiterung auf andere Plattformen ist im Ausblick formuliert.', en: 'I did do comparison measurements on the BMW i3s — and there all three systems agree to within 0.4 percentage points. But I deliberately focused on the MEB platform, because I only ran the full continuous OBD data acquisition with all six methods there. The BMW measurements live in the backup as a contextual comparison, not as validation. Extending to other platforms is formulated in the outlook.' },
      },
      {
        q: { de: 'Warum nur ein Primärfahrzeug?', en: 'Why only one primary vehicle?' },
        a: { de: 'Für die detaillierte On-Board-Analyse mit allen sechs Methoden habe ich den VW ID.4 genommen. Insgesamt sind es drei MEB-Fahrzeuge — der ID.4 als Hauptfahrzeug, Elroq und Born zur Plattform-Verifikation.', en: 'For the detailed on-board analysis with all six methods I picked the VW ID.4. In total three MEB vehicles — the ID.4 as primary, Elroq and Born for platform verification.' },
      },
    ],
    transition: {
      de: 'Wie die sechs Methoden zusammenwirken, zeigt die Pipeline auf der nächsten Folie.',
      en: 'How the six methods converge is shown by the pipeline on the next slide.',
    },
  },

  'slide-pipeline': {
    time: '7:30 – 8:00 (30 s)',
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
      de: 'Hier sind wir auf Ebene 3 — nachgelagerte Auswertung in meiner Python-App. Aus den OBD-Rohdaten rechne ich sechs SOH-Methoden parallel: BMS-Direktwert, Energie-Integration, Coulomb-Counting, Widerstand und ICA/DVA. Diese sechs Werte konvergieren zu einem kombinierten SOH. Jede Methode hat ihren eigenen blinden Fleck — die Kombination gleicht das aus. Wie das konkret aussieht, zeige ich auf den nächsten Folien.',
      en: 'This is level 3 — post-processing in my Python app. From the OBD raw data I run six SOH methods in parallel: BMS direct readout, energy integration, Coulomb counting, resistance, and ICA/DVA. These six values converge into a combined SOH. Each method has its own blind spot — the combination compensates for that. I will show you what this looks like in concrete numbers on the next slides.',
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
    time: '8:00 – 9:00 (60 s)',
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
      de: 'Hier sehen Sie alle sechs Methoden im Vergleich. Die Streuung ist beachtlich — 10,3 Prozentpunkte: von SOH_kap mit 89,7 Prozent bis SOH_R mit glatten 100. SOH_e ist mit 99,6 Prozent meine beste Einzelmethode — nur 2,3 Prozentpunkte über dem AVL-Referenzwert. SOH_c liegt bei 91,8 Prozent — also rund 5,5 Prozentpunkte zu niedrig. Das passiert, weil sich beim Coulomb-Counting kleine Stromfehler über die ganze AC-Ladung aufaddieren. Wenn ich SOH_e und SOH_c miteinander kombiniere, gleichen sie sich aus: 95,7 Prozent — nur 1,6 Prozentpunkte unter dem AVL. Die Botschaft ist klar: Keine Einzelmethode trifft den wahren SOH. Aber die Kombination ist praxistauglich.',
      en: 'Here you see all six methods side by side. The spread is striking — 10.3 percentage points: from SOH_cap at 89.7 percent to SOH_R at a clean 100. SOH_e is my most accurate single method at 99.6 percent — only 2.3 pp above the AVL reference. SOH_c sits at 91.8 percent — about 5.5 pp too low. That happens because in Coulomb counting small current errors keep adding up over the long AC charge. If I combine SOH_e and SOH_c, they balance each other: 95.7 percent — only 1.6 pp below the AVL. The takeaway is clear: no single method nails the true SOH. But the combination is practically usable.',
    },
    dataCallouts: [
      'SOH_e = 99,6% · SOH_c = 91,8% · Kombiniert = 95,7%',
      'AVL = 97,3% · Δ = 1,6 Pp',
      'Methodendivergenz = 10,3 Pp / method divergence = 10.3 pp',
    ],
    questions: [
      {
        q: { de: 'Warum unterschätzt SOH_c systematisch?', en: 'Why does SOH_c systematically underestimate?' },
        a: { de: 'Bei langer AC-Ladung — wir reden hier über etwa 8 Stunden bei 30 Ampere — addieren sich kleine Stromfehler immer weiter auf. Außerdem gehen Verluste wie Wärme und der BMS-Eigenverbrauch gar nicht in die Stromintegration ein. Und die BMS-Strommessung hat bei kleinen Strömen einen Offset. All das zusammen drückt SOH_c systematisch nach unten.', en: 'During a long AC charge — we are talking about roughly 8 hours at 30 amps — small current errors keep adding up. On top of that, losses like heat and the BMS self-consumption do not show up in the current integration at all. And the BMS current measurement has an offset at low currents. All of that together pushes SOH_c systematically downwards.' },
      },
    ],
    transition: {
      de: 'Wie reproduzierbar sind diese Ergebnisse?',
      en: 'How reproducible are these results?',
    },
  },

  'slide-reproducibility': {
    time: '9:00 – 10:00 (60 s)',
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
      de: 'Die algorithmische Reproduzierbarkeit ist exzellent. Ich habe denselben Datensatz dreimal unabhängig analysiert: SOH_e ist vollständig deterministisch — null Streuung. SOH_c liegt bei 0,3 Prozentpunkten, das kommt von leichten Updates an den Softwareparametern. Der kombinierte SOH streut nur 0,2 Prozentpunkte — das ist exzellent. Auf der rechten Seite die Messwiederholbarkeit beim AVL: über 12 Monate eine Standardabweichung von 1,2 Prozent. Aber das kommt von Fahrzeugzustand und Temperatur, nicht vom Algorithmus selbst.',
      en: 'Algorithmic reproducibility is excellent. I analyzed the same dataset three times independently: SOH_e is fully deterministic — zero spread. SOH_c sits at 0.3 percentage points, which comes from small updates to the software parameters. The combined SOH spreads only 0.2 pp — that is excellent. On the right, the measurement repeatability of the AVL: a standard deviation of 1.2 percent over 12 months. But that comes from vehicle state and temperature, not from the algorithm itself.',
    },
    dataCallouts: [
      'Algorithmisch: 0,2 Pp Streuung / algorithmic: 0.2 pp spread',
      'AVL σ = 1,20% über 12 Monate / over 12 months',
    ],
    questions: [],
    transition: {
      de: 'Jetzt zur ICA/DVA-Analyse — die zeigt charakteristische Alterungssignaturen der NMC-Zellen.',
      en: 'Now to ICA/DVA analysis — it shows the characteristic aging signatures of the NMC cells.',
    },
  },

  'slide-temperature': {
    time: 'Backup (temperature effect demoted in Phase 20 — last backup slide)',
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
    time: 'Backup (resistance demoted in Phase 20)',
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
    time: 'Backup (failure case demoted in Phase 20)',
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
    time: 'Backup',
    bullets: {
      de: [
        'AVL (97,3 %) vs. OBD kombiniert (95,7 %) = Δ 1,6 Pp am VW ID.4',
        '3-Tier-Kosten: AUTEL ~8.000 € · AVL ~70 €/Jahr Lizenz · OBDLink ~130 € einmalig (keine Folgekosten)',
        'OBDLink-Mehrwert: kontinuierliche Daten, die der AVL gar nicht liefert',
        'AUTEL am VW ID.4 nicht ausgelesen — bei BMW i3s stimmten alle drei Systeme auf 0,4 Pp überein',
        'Einzelmethoden: SOH_e überschätzt (+2,3 Pp), SOH_c unterschätzt (−5,5 Pp); Kombination gleicht aus',
        '1,6 Pp liegt innerhalb typischer BMS-Toleranz (±5–10 %) → praxistauglich',
      ],
      en: [
        'AVL (97.3%) vs. OBD combined (95.7%) = Δ 1.6 pp on VW ID.4',
        '3-tier cost: AUTEL ~€8,000 · AVL ~€70/year license · OBDLink ~€130 one-off (no recurring costs)',
        'OBDLink advantage: continuous data the AVL cannot provide',
        'AUTEL not measured on VW ID.4 — on BMW i3s all three systems agreed within 0.4 pp',
        'Individual methods: SOH_e overestimates (+2.3 pp), SOH_c underestimates (−5.5 pp); combination compensates',
        '1.6 pp is within typical BMS tolerance (±5–10%) → practically usable',
      ],
    },
    script: {
      de: 'Backup-Folie zur Inter-System-Übereinstimmung am VW ID.4: Der AVL HV-Check misst 97,3 Prozent, unsere kombinierte On-Board-Methode 95,7 Prozent — Δ 1,6 Prozentpunkte. Die 3-Tier-Kostenstruktur ist hier zentral: das AUTEL als Profi-Diagnose kostet rund 8.000 Euro, der AVL HV-Check etwa 70 Euro pro Jahr im Lizenzmodell, und der OBDLink MX+ einmalig 130 Euro ohne Folgekosten. Der Mehrwert des OBDLink: kontinuierliche Datenerfassung, die der AVL gar nicht leisten kann. SOH_e allein überschätzt um 2,3 Pp, SOH_c unterschätzt um 5,5 Pp — erst die Kombination gleicht diese Fehler aus. Die 1,6 Prozentpunkte Abweichung liegen deutlich innerhalb der typischen BMS-Toleranz.',
      en: 'Backup slide on inter-system agreement at the VW ID.4: AVL HV-Check measures 97.3%, our combined on-board method 95.7% — Δ 1.6 pp. The 3-tier cost structure is central here: AUTEL as professional diagnosis costs around €8,000, AVL HV-Check about €70/year on a license model, and OBDLink MX+ €130 one-off with no recurring costs. The OBDLink advantage: continuous data acquisition the AVL cannot provide. SOH_e alone overestimates by 2.3 pp, SOH_c underestimates by 5.5 pp — only the combination compensates. The 1.6 pp deviation is well within typical BMS tolerance.',
    },
    dataCallouts: [
      'AVL: 97,3 % vs. OBD: 95,7 % = Δ 1,6 Pp',
      'AUTEL ~8.000 € · AVL ~70 €/Jahr · OBDLink ~130 € einmalig',
      'OBDLink-Mehrwert: kontinuierliche Daten + keine Folgekosten',
    ],
    questions: [
      {
        q: { de: 'Warum hat AUTEL beim VW ID.4 nicht funktioniert?', en: 'Why didn\'t AUTEL work on the VW ID.4?' },
        a: { de: 'Beim VW ID.4 konnte mit dem AUTEL kein direkter SOH-Wert ausgelesen werden. Am BMW i3s funktionierte das problemlos — dort stimmten alle drei Systeme auf 0,4 Prozentpunkte überein.', en: 'On the VW ID.4 no direct SOH value could be read with AUTEL. On the BMW i3s it worked perfectly — all three systems agreed within 0.4 pp.' },
      },
    ],
    transition: {
      de: 'Kommen wir zur ICA/DVA-Analyse.',
      en: 'Let\'s move to the ICA/DVA analysis.',
    },
  },

  'slide-ica-dva': {
    time: '10:45 – 11:30 (45 s)',
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
      de: 'Die ICA-Analyse leitet dQ/dV gegen die Spannung ab. Die Peaks zeigen Phasenübergänge — Graphit-Staging in der Anode und Reaktionen in der NMC-Kathode. Die DVA zeigt die zugehörigen Spannungsplateaus. Meine Software erkennt diese Peaks automatisch und speichert Position, Höhe und Halbwertsbreite in der Datenbank — für späteres Langzeittracking. Wichtige Einschränkung: Da unser Fahrzeug mit über 97 Prozent SOH praktisch keine Alterung zeigt, sehe ich noch keine Peakverschiebung. Aber die Infrastruktur steht — für zukünftiges Degradationsmonitoring ist alles vorbereitet.',
      en: 'The ICA analysis takes dQ/dV against voltage. The peaks show phase transitions — graphite staging in the anode and reactions in the NMC cathode. DVA shows the associated voltage plateaus. My software detects these peaks automatically and stores position, height, and FWHM in the database — for later long-term tracking. Important caveat: since our vehicle shows practically no aging at over 97 percent SOH, I do not yet see any peak shift. But the infrastructure is in place — everything is ready for future degradation monitoring.',
    },
    dataCallouts: [
      'OCV-Bereich / range: ~325 V → ~397 V',
      'SOC-Fenster: 5,2% – 96,0% (90,8 Pp)',
    ],
    questions: [
      {
        q: { de: 'Ist die C-Rate bei AC-Ladung nicht zu hoch für ICA?', en: 'Isn\'t the C-rate too high for ICA with AC charging?' },
        a: { de: 'Optimal wäre unter C/10. Mit 11 kW AC auf 77 kWh komme ich bei C/7 raus — also grenzwertig. Die Peaks sind noch erkennbar, aber breiter als bei niedrigerer C-Rate. Wirklich hochaufgelöste ICA bräuchte C/25 — das wären rund 25 Stunden Ladezeit. Im Werkstattalltag nicht praktikabel.', en: 'Optimal would be under C/10. With 11 kW AC on a 77 kWh battery I end up at C/7 — borderline. Peaks are still recognizable but broader than at lower C-rate. Truly high-resolution ICA would need C/25 — that would mean about 25 hours of charging. Not practical in workshop use.' },
      },
    ],
    transition: {
      de: 'Jetzt zur Live-Demo der App — der Pro-Modus für die Forschung.',
      en: 'Now to the live demo of the app — the Pro mode for research.',
    },
  },

  'slide-community': {
    time: 'Backup (community demoted in Phase 20)',
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
    time: '11:30 – 12:15 (45 s)',
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
      de: 'Hier ist die Pro-Version meiner SOH-Analyse-Software live. Ich lade eine OBD-CSV oder einen AVL-PDF-Bericht hoch — die App erkennt das Fahrzeug automatisch und rechnet alle sechs SOH-Methoden parallel durch. Die Ergebnisse sehen Sie als interaktive Plotly-Charts, und ich kann sie als PDF exportieren. Alle Messungen landen in einer SQLite-Datenbank für Langzeitvergleiche.',
      en: 'Here is the Pro version of my SOH analysis software live. I upload an OBD CSV or an AVL PDF report — the app automatically detects the vehicle and runs all six SOH methods in parallel. You see the results as interactive Plotly charts, and I can export them as a PDF. All measurements land in a SQLite database for long-term comparisons.',
    },
    dataCallouts: [],
    questions: [],
    transition: {
      de: 'Und hier die vereinfachte Easy-Version für den Werkstattalltag.',
      en: 'And here the simplified Easy version for workshop use.',
    },
  },

  'slide-demo-easy': {
    time: '12:15 – 13:00 (45 s)',
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
      de: 'Die Easy-Version ist ein 4-Schritt-Assistent für die Werkstatt: Fahrzeug wählen, Datei hochladen, Ergebnis anzeigen, Bericht exportieren. Statt Detailcharts gibt es ein Ampel-System — Grün, Gelb, Rot. Damit kommt jeder Werkstattmitarbeiter ohne technischen Hintergrund klar.',
      en: 'The Easy version is a 4-step wizard for the workshop: pick the vehicle, upload the file, view the result, export the report. Instead of detail charts there is a traffic-light system — green, yellow, red. With that, any workshop technician without a technical background can use it.',
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
    time: '13:00 – 14:15 (75 s)',
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
      de: 'Zu den Stärken: Ich erreiche eine reproduzierbare SOH-Bestimmung mit nur 1,6 Prozentpunkten Abweichung am VW ID.4. Auf der MEB-Plattform habe ich das am Skoda Elroq verifiziert — über sieben Messungen Streuung gleich null. Die kombinierte Methode ist temperaturrobust: nur 0,1 Prozentpunkte Unterschied zwischen 9,8 und 19 Grad. Der entscheidende OBDLink-Mehrwert: kontinuierliche Datenerfassung, die der AVL gar nicht liefern kann — und das bei einmalig 130 Euro ohne Folgekosten. Zum Vergleich: AVL kostet 70 Euro pro Jahr, AUTEL rund 8.000 Euro. Ehrlich zu den Grenzen: Die Arbeit ist MEB-fokussiert — der BMW i3s ist nur eine kontextuelle Vergleichsmessung im Backup. Ich hatte keine DC-Schnellladedaten und das Fahrzeug zeigt mit über 97 Prozent SOH keine signifikante Alterung. Die Gesamtunsicherheit liegt bei rund ±4,6 Prozentpunkten — getrieben vor allem durch die Methodenstreuung und das SOC-Fenster. Eine unabhängige Laborvalidierung nach ISO 12405 war im Rahmen dieser Arbeit nicht möglich.',
      en: 'On the strengths side: I get a reproducible SOH with only 1.6 percentage points deviation on the VW ID.4. On the MEB platform I verified that on the Skoda Elroq — zero spread over seven measurements. The combined method is temperature-robust: only 0.1 percentage points between 9.8 and 19 degrees. The key OBDLink advantage: continuous data acquisition the AVL simply cannot deliver — and that at 130 euros one-off, no recurring costs. By comparison: AVL costs 70 euros per year, AUTEL around 8,000 euros. Honestly on the limitations: the work is MEB-focused — the BMW i3s is only a contextual comparison in the backup. I had no DC fast-charging data and the vehicle shows no significant aging at over 97 percent SOH. The total uncertainty is around ±4.6 pp — driven mainly by method spread and the SOC window. An independent lab validation per ISO 12405 was not feasible within this work.',
    },
    dataCallouts: [
      'AUTEL ~8.000 € · AVL ~70 €/Jahr · OBDLink ~130 € einmalig',
      '±1,6 Pp · σ = 0 % (Elroq) · 0,1 Pp Temperaturrobustheit',
      '±4,6 Pp Gesamtunsicherheit (dominiert durch Methode + SOC)',
    ],
    questions: [
      {
        q: { de: 'Wie ließe sich die größte Limitation adressieren?', en: 'How could the biggest limitation be addressed?' },
        a: { de: 'Im Ausblick formuliert: Erweiterung auf andere Plattformen — BMW i3s, Tesla, LFP-Chemie. Die Methoden bleiben gleich, ich muss nur die PIDs und Kanäle anpassen. Dazu noch Fahrzeuge mit bekannter Degradation, also 50.000 bis 150.000 Kilometer Laufleistung, um die ICA/DVA zu validieren. Und die Temperaturkorrektur als eigene Forschungsfrage.', en: 'I lay this out in the outlook: extending to other platforms — BMW i3s, Tesla, LFP chemistry. The methods stay the same, I only have to adjust the PIDs and channels. On top of that, vehicles with known degradation — somewhere between 50,000 and 150,000 km — to validate ICA/DVA. And temperature correction as its own research question.' },
      },
      {
        q: { de: 'Was kostet das gesamte Setup?', en: 'What does the full setup cost?' },
        a: { de: 'Der OBDLink MX+ kostet einmalig rund 130 Euro. Smartphone oder Tablet hat man heute sowieso, und die Python-App ist Open Source. Keine Folgekosten. Zum Vergleich: AVL HV-Check etwa 70 Euro pro Jahr als Lizenz, AUTEL MaxiSYS Ultra rund 8.000 Euro einmalig.', en: 'The OBDLink MX+ is about 130 euros one-off. You usually already have a smartphone or tablet, and the Python app is open source. No recurring costs. By comparison: AVL HV-Check about 70 euros per year as a license, AUTEL MaxiSYS Ultra around 8,000 euros one-off.' },
      },
    ],
    transition: {
      de: 'Damit zur Kernaussage meiner Arbeit.',
      en: 'This brings us to the core finding of my thesis.',
    },
  },

  'slide-uncertainty': {
    time: 'Backup (uncertainty demoted in Phase 20)',
    bullets: {
      de: [
        'Unsicherheitsbudget: u_gesamt ≈ ±4,6 Pp',
        'u_Methode ~4 Pp (dominiert mit 88%!) — SOH_e vs. SOH_c Streuung',
        'u_SOC ~2 Pp — SOC-Fenster-Qualität',
        'u_Mess ~1 Pp — OBD-AVL Kreuzvalidierung',
        'u_Temp ~0,1 Pp — kompensierende Effekte',
        'Praxisrelevanz: Kategorien 10 Pp auseinander → ±4,6 Pp erlaubt zuverlässige Unterscheidung',
      ],
      en: [
        'Uncertainty budget: u_total ≈ ±4.6 pp',
        'u_method ~4 pp (dominates at 88%!) — SOH_e vs. SOH_c spread',
        'u_SOC ~2 pp — SOC window quality',
        'u_meas ~1 pp — OBD-AVL cross-validation',
        'u_temp ~0.1 pp — compensating effects',
        'Practical relevance: categories 10 pp apart → ±4.6 pp allows reliable distinction',
      ],
    },
    script: {
      de: 'Die Gesamtunsicherheit beträgt etwa plus/minus 4,5 Prozentpunkte — berechnet als Wurzel der Quadratsumme der vier Beiträge. Der dominierende Faktor mit 88 Prozent ist die methodische Unsicherheit — also die Hälfte der Streuung zwischen SOH_e und SOH_c. Der SOC-Fenster-Einfluss beträgt etwa 2 Prozentpunkte, die Messunsicherheit etwa 1, und der Temperatureffekt ist vernachlässigbar mit 0,1. Entscheidend für die Praxisrelevanz: Die Zustandskategorien liegen 10 Prozentpunkte auseinander — über 90 Prozent bedeutet Weiterverwendung, 80 bis 89 stationärer Speicher, unter 70 Recycling. Mit ±4,5 Prozentpunkten können wir diese Kategorien zuverlässig unterscheiden.',
      en: 'Total uncertainty is approximately ±4.6 pp — calculated as the root sum of squares of four contributions. The dominant factor at 88% is methodological uncertainty — the half-spread between SOH_e and SOH_c. SOC window influence is about 2 pp, measurement uncertainty about 1, and temperature effect is negligible at 0.1. Critical for practical relevance: condition categories are 10 pp apart — above 90% means continued use, 80-89% stationary storage, below 70% recycling. With ±4.6 pp we can reliably distinguish these categories.',
    },
    dataCallouts: [
      'u_gesamt / total ≈ ±4,6 Pp',
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
    time: 'Last main slide before backups (Q&A reference, uncounted)',
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
    time: '14:15 – 14:40 (25 s)',
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
      de: 'Die Kernaussage meiner Arbeit lautet: Die Kombination aus energiebasierter und integrativer SOH-Methode liefert eine reproduzierbare Bestimmung des Batteriezustands. Mit einem OBD-Adapter für einmalig 130 Euro — ohne Folgekosten — und einer Abweichung von nur 1,6 Prozentpunkten zur professionellen Off-Board-Referenz. Verifiziert habe ich das auf der MEB-Plattform am Skoda Elroq und Cupra Born. Drei Zahlen zum Mitnehmen: 95,7 Prozent kombinierter SOH, 0,1 Prozentpunkte Temperaturrobustheit, und 1,6 Prozentpunkte Übereinstimmung zwischen OBD und AVL.',
      en: 'The core finding of my thesis: the combination of energy-based and integrative SOH methods delivers a reproducible determination of battery health. With an OBD adapter for 130 euros one-off — no recurring costs — and a deviation of only 1.6 percentage points from the professional off-board reference. I verified that on the MEB platform at the Skoda Elroq and Cupra Born. Three numbers to take home: 95.7 percent combined SOH, 0.1 percentage points temperature robustness, and 1.6 percentage points agreement between OBD and AVL.',
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
    time: '14:40 – 14:55 (15 s)',
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
      de: 'Meine Verfahren lassen sich direkt einsetzen — in Werkstätten, bei Flottenbetreibern, Versicherungen und für die Second-Life-Klassifizierung. Für die Zukunft an erster Stelle: Erweiterung auf andere Plattformen wie BMW i3s, Tesla oder LFP-Chemie. Die Methoden bleiben gleich, ich muss nur Kanäle und PIDs anpassen. Dazu noch Temperaturkorrektur, DC-Schnellladen, gealterte Fahrzeuge, ML-Korrektur und der EU-Batteriepass.',
      en: 'My methods can be used directly — in workshops, by fleet operators, insurers and for second-life classification. For the future, top of the list: extending to other platforms like BMW i3s, Tesla or LFP chemistry. The methods stay the same, I only have to adjust channels and PIDs. On top of that: temperature correction, DC fast charging, aged vehicles, ML correction and the EU battery passport.',
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
    time: '14:55 – 15:00 (5 s)',
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
      de: 'Das CC-CV-Profil zeigt die typische Ladekurve unserer AC-Wallbox-Messungen. Die niedrige C-Rate von 0,1 bis 0,15 C ermöglicht quasi-stationäre Bedingungen. 73,9 kWh kumulierte Ladeenergie über knapp 8 Stunden liefern die Zeitreihe für die Methodenpipeline. SOH_e wird dabei direkt aus dem BMS-Parameter „aktueller Energiegehalt" berechnet (= 99,6 % am VW ID.4 IfE), nicht als simples Verhältnis Lade-Energie/Nenn-Energie. Der DC-Puls-Test bei 51 % SOC zeigt 40 mΩ Ladewiderstand und 33 mΩ Entladewiderstand — eine ca. 22 %-Asymmetrie durch unterschiedliche Grenzflächen-Impedanz.',
      en: 'The CC-CV profile shows the typical charging curve of our AC wallbox measurements. The low C-rate of 0.1 to 0.15 C enables quasi-stationary conditions. 73.9 kWh cumulative charge energy over almost 8 hours provides the time series for the method pipeline. SOH_e is calculated directly from the BMS parameter "current energy content" (= 99.6 % on VW ID.4 IfE), not as a simple ratio of charge energy to nominal energy. The DC pulse test at 51% SOC shows 40 mΩ charge resistance and 33 mΩ discharge resistance — an approximately 22% asymmetry from different interfacial impedance.',
    },
    dataCallouts: [
      '73,9 kWh kumulierte Ladeenergie · SOH_e = 99,6 % (BMS-direkt)',
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
        '±4,6 Pp Unsicherheit bei 10 Pp Kategorieabstand → zuverlässige Einordnung',
      ],
      en: [
        'EU Regulation 2023/1542: digital battery passport mandatory from 2027',
        'Our app already captures most required parameters',
        'Second-life grading: A (≥90%), B (80–89%), C (70–79%), D (<70%)',
        'Our VW ID.4 at 95.7% → Grade A',
        '±4.6 pp uncertainty at 10 pp category spacing → reliable classification',
      ],
    },
    script: {
      de: 'Ab 2027 wird der EU-Batteriepass für Traktionsbatterien über 2 kWh verpflichtend. Unsere Anwendung erfasst bereits den Großteil der geforderten Parameter und könnte als Grundlage für den strukturierten Export dienen. Das Second-Life-Grading ordnet Batterien in vier Kategorien ein — unser VW ID.4 mit 95,7% fällt klar in Kategorie A. Und mit unserer Unsicherheit von ±4,5 Prozentpunkten bei 10 Prozentpunkten Kategorieabstand ist eine zuverlässige Einordnung möglich.',
      en: 'From 2027, the EU battery passport becomes mandatory for traction batteries above 2 kWh. Our application already captures most required parameters and could serve as a basis for structured export. The second-life grading classifies batteries into four categories — our VW ID.4 at 95.7% clearly falls into category A. And with our uncertainty of ±4.6 pp at 10 pp category spacing, reliable classification is possible.',
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
