/**
 * D3.js Charts — interactive data visualizations for results slides 12–15.
 * Uses data from /assets/data/*.json.
 */
import * as d3 from 'd3';

// ── Helpers ──────────────────────────────────────────────────────────

function isEnglish() {
  return document.body.classList.contains('lang-en');
}

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Create or reuse a tooltip div inside a container */
function ensureTooltip(container) {
  let tip = container.querySelector('.chart-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'chart-tooltip';
    container.appendChild(tip);
  }
  return tip;
}

function showTooltip(tip, html, event, container) {
  tip.innerHTML = html;
  tip.classList.add('visible');
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left + 14;
  const y = event.clientY - rect.top - 10;
  tip.style.left = `${Math.min(x, rect.width - 270)}px`;
  tip.style.top = `${y}px`;
}

function hideTooltip(tip) {
  tip.classList.remove('visible');
}

// ── Chart 1: Method Comparison (Slide 12) ────────────────────────────

function renderMethodComparison(container, data) {
  container.innerHTML = '';
  const tip = ensureTooltip(container);

  const width = 720;
  const height = 460;
  const margin = { top: 36, right: 60, bottom: 44, left: 130 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const accent = getCSSVar('--accent');

  // Short labels for chart (details are in the annotation panel)
  const shortLabels = {
    'AVL HV-Check': 'AVL',
    'SOH_e (Energie-direkt)': 'SOHe',
    'SOH_e (Energy-direct)': 'SOHe',
    'SOH_c (Coulomb-Zählung)': 'SOHc',
    'SOH_c (Coulomb-counting)': 'SOHc',
    'SOH kapazitätsbasiert': 'SOHkap',
    'SOH capacity-based': 'SOHkap',
    'SOH kombiniert (e+c)/2': 'Kombiniert',
    'SOH combined (e+c)/2': 'Combined',
    'SOH_R (Widerstand)': 'SOHR',
    'SOH_R (Resistance)': 'SOHR',
  };

  // Build unified list: all methods + AVL as equal peers
  const allMethods = [
    { ...data.reference, delta: 0, note: en ? 'Off-board professional device' : 'Off-Board-Profigerät', note_en: 'Off-board professional device', isRef: true },
    ...data.methods,
  ];

  // Map to short labels
  allMethods.forEach(d => {
    const fullLabel = en ? d.method_en : d.method;
    d._short = shortLabels[fullLabel] || fullLabel;
  });

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const defs = svg.append('defs');
  const glow = defs.append('filter').attr('id', 'dot-glow');
  glow.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'blur');
  const mg = glow.append('feMerge');
  mg.append('feMergeNode').attr('in', 'blur');
  mg.append('feMergeNode').attr('in', 'SourceGraphic');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // X scale: absolute SOH %
  const x = d3.scaleLinear().domain([87, 102]).range([0, innerW]);
  const y = d3.scaleBand()
    .domain(allMethods.map(d => d._short))
    .range([0, innerH])
    .padding(0.25);

  // Alternating row backgrounds
  allMethods.forEach((d, i) => {
    if (i % 2 === 0) {
      g.append('rect')
        .attr('x', -margin.left + 10)
        .attr('y', y(d._short) - y.step() * y.padding() / 2)
        .attr('width', innerW + margin.left - 10 + margin.right - 10)
        .attr('height', y.step())
        .attr('fill', getCSSVar('--text-secondary'))
        .attr('opacity', 0.04)
        .attr('rx', 4);
    }
  });

  // Subtle vertical grid
  [90, 92, 94, 96, 98, 100].forEach(tick => {
    g.append('line')
      .attr('x1', x(tick)).attr('x2', x(tick))
      .attr('y1', -5).attr('y2', innerH)
      .attr('stroke', getCSSVar('--text-secondary'))
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.12);
  });

  // X axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(8).tickFormat(d => `${d} %`))
    .selectAll('text')
    .style('font-size', '10px');

  // Mean line of all methods
  const allValues = allMethods.map(d => d.soh);
  const mean = allValues.reduce((a, b) => a + b, 0) / allValues.length;
  const meanX = x(mean);
  g.append('line')
    .attr('x1', meanX).attr('x2', meanX)
    .attr('y1', -10).attr('y2', innerH)
    .attr('stroke', getCSSVar('--text-secondary'))
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '5,3')
    .attr('opacity', 0.35);

  g.append('text')
    .attr('x', meanX)
    .attr('y', -14)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '9px')
    .attr('font-style', 'italic')
    .text(`μ = ${mean.toFixed(1)} %`);

  // Method labels + lollipops
  allMethods.forEach(d => {
    const cy = y(d._short) + y.bandwidth() / 2;
    const dotX = x(d.soh);
    const isCombined = d.method.includes('kombiniert');
    const isRef = d.isRef;

    // Color scheme
    let color;
    if (isCombined) color = accent;
    else if (isRef) color = getCSSVar('--success');
    else color = getCSSVar('--chart-blue');

    // Y-axis label (short) — starts hidden, animates with stem
    g.append('text')
      .attr('class', 'lollipop-label')
      .attr('x', -14)
      .attr('y', cy)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', isCombined ? accent : (isRef ? getCSSVar('--success') : getCSSVar('--text-primary')))
      .attr('font-size', '13px')
      .attr('font-weight', (isCombined || isRef) ? '700' : '600')
      .attr('opacity', 0)
      .text(d._short);

    // Horizontal lollipop stem from mean to dot
    // Starts at meanX (zero length) — GSAP animates x2 to dotX
    g.append('line')
      .attr('class', 'lollipop-stem')
      .attr('x1', meanX).attr('x2', meanX)
      .attr('data-target-x2', dotX)
      .attr('y1', cy).attr('y2', cy)
      .attr('stroke', color)
      .attr('stroke-width', isCombined ? 3 : 2)
      .attr('opacity', isCombined ? 0.8 : 0.35)
      .attr('stroke-linecap', 'round');

    // Dot — starts at r=0, GSAP pops it in
    const dotR = isCombined ? 10 : (isRef ? 9 : 7);
    g.append('circle')
      .attr('class', 'lollipop-dot')
      .attr('cx', dotX)
      .attr('cy', cy)
      .attr('r', 0)
      .attr('data-target-r', dotR)
      .attr('fill', color)
      .attr('opacity', (isCombined || isRef) ? 1 : 0.85)
      .attr('filter', isCombined ? 'url(#dot-glow)' : null)
      .style('cursor', 'pointer')
      .on('mouseenter', (event) => {
        d3.select(event.target).transition().duration(150).attr('r', dotR + 3);
        const method = en ? d.method_en : d.method;
        const note = en ? (d.note_en || d.note) : d.note;
        let html = `<div class="tooltip-method">${method}</div>`;
        html += `<div class="tooltip-value">SOH: ${d.soh.toFixed(1)} %</div>`;
        if (!isRef) html += `<div class="tooltip-delta">Δ AVL: ${d.delta > 0 ? '+' : ''}${d.delta.toFixed(1)} Pp</div>`;
        html += `<div class="tooltip-note">${note}</div>`;
        showTooltip(tip, html, event, container);
      })
      .on('mouseleave', (event) => {
        d3.select(event.target).transition().duration(150).attr('r', dotR);
        hideTooltip(tip);
      });

    // Value label (right of dot) — starts hidden, GSAP fades in with dots
    g.append('text')
      .attr('class', 'lollipop-value')
      .attr('x', dotX + dotR + 6)
      .attr('y', cy)
      .attr('dominant-baseline', 'middle')
      .attr('fill', color)
      .attr('font-size', (isCombined || isRef) ? '13px' : '11px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text(`${d.soh.toFixed(1)} %`);
  });

  // Condition note (top-right)
  g.append('text')
    .attr('x', innerW)
    .attr('y', -18)
    .attr('text-anchor', 'end')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '9px')
    .attr('opacity', 0.7)
    .text(`${data.conditions.vehicle} · ${en ? 'Session' : 'Sitzung'} ${data.conditions.session} · ${data.conditions.temperature} °C`);
}

// ── Chart 2: Reproducibility (Slide 13) ──────────────────────────────

function renderReproducibility(container, data) {
  container.innerHTML = '';

  const en = isEnglish();
  const chartBlue = getCSSVar('--chart-blue');
  const chartYellow = getCSSVar('--chart-yellow');
  const accent = getCSSVar('--accent');
  const success = getCSSVar('--success');

  const runs = data.algorithmic.runs;
  const methods = ['soh_e', 'soh_c', 'combined'];
  const methodLabels = en
    ? ['SOHe', 'SOHc', 'Combined']
    : ['SOHe', 'SOHc', 'Kombiniert'];
  const methodColors = [chartBlue, chartYellow, accent];

  const width = 480;
  const height = 320;
  const cellW = 90;
  const cellH = 52;
  const cellGap = 8;
  const cellR = 8;
  const labelW = 100;
  const headerH = 36;
  const deltaColW = 70;

  // Grid origin
  const ox = labelW;
  const oy = headerH + 10;

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  // Column headers (Run 1, 2, 3, Δ)
  const runLabels = runs.map((_, i) => en ? `Run ${i + 1}` : `Lauf ${i + 1}`);
  runLabels.forEach((label, col) => {
    svg.append('text')
      .attr('x', ox + col * (cellW + cellGap) + cellW / 2)
      .attr('y', oy - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text(label);
  });
  // Delta header
  const deltaX = ox + 3 * (cellW + cellGap);
  svg.append('text')
    .attr('x', deltaX + deltaColW / 2)
    .attr('y', oy - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .text(en ? 'Spread' : 'Streuung');

  // Row for each method — animated: row-by-row cascade, cells left→right
  methods.forEach((method, row) => {
    const color = methodColors[row];
    const isCombined = row === 2;
    const rowY = oy + row * (cellH + cellGap);
    const vals = runs.map(r => r[method]);
    const spread = (Math.max(...vals) - Math.min(...vals)).toFixed(1);

    // Row label — starts hidden
    svg.append('text')
      .attr('class', 'repro-label')
      .attr('data-row', row)
      .attr('x', ox - 14)
      .attr('y', rowY + cellH / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', isCombined ? accent : getCSSVar('--text-primary'))
      .attr('font-size', '14px')
      .attr('font-weight', isCombined ? '700' : '600')
      .attr('opacity', 0)
      .text(methodLabels[row]);

    // Value cells
    runs.forEach((run, col) => {
      const val = run[method];
      const cx = ox + col * (cellW + cellGap);

      // Cell background — starts hidden
      svg.append('rect')
        .attr('class', 'repro-cell-bg')
        .attr('data-row', row)
        .attr('data-col', col)
        .attr('x', cx)
        .attr('y', rowY)
        .attr('width', cellW)
        .attr('height', cellH)
        .attr('rx', cellR)
        .attr('fill', color)
        .attr('opacity', 0);

      // Value text — starts hidden
      svg.append('text')
        .attr('class', 'repro-cell-val')
        .attr('data-row', row)
        .attr('data-col', col)
        .attr('x', cx + cellW / 2)
        .attr('y', rowY + cellH / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', isCombined ? accent : getCSSVar('--text-primary'))
        .attr('font-size', '18px')
        .attr('font-weight', '700')
        .attr('opacity', 0)
        .text(`${val.toFixed(1)} %`);
    });

    // Delta cell — starts hidden
    svg.append('rect')
      .attr('class', 'repro-delta-bg')
      .attr('data-row', row)
      .attr('x', deltaX)
      .attr('y', rowY)
      .attr('width', deltaColW)
      .attr('height', cellH)
      .attr('rx', cellR)
      .attr('fill', success)
      .attr('opacity', 0);

    svg.append('text')
      .attr('class', 'repro-delta-val')
      .attr('data-row', row)
      .attr('x', deltaX + deltaColW / 2)
      .attr('y', rowY + cellH / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', success)
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text(`${spread} Pp`);

    // Store target opacities as data attributes for animation reset
    svg.selectAll(`.repro-cell-bg[data-row="${row}"]`).attr('data-target-opacity', isCombined ? 0.18 : 0.12);
    svg.selectAll(`.repro-delta-bg[data-row="${row}"]`).attr('data-target-opacity', spread === '0.0' ? 0.2 : 0.1);
  });

  // Bottom badge — starts hidden
  const badgeY = oy + 3 * (cellH + cellGap) + 8;
  const badgeW = 3 * (cellW + cellGap) - cellGap;
  svg.append('rect')
    .attr('class', 'repro-badge-bg')
    .attr('x', ox)
    .attr('y', badgeY)
    .attr('width', badgeW + deltaColW + cellGap)
    .attr('height', 28)
    .attr('rx', 14)
    .attr('fill', success)
    .attr('opacity', 0);

  svg.append('text')
    .attr('class', 'repro-badge-text')
    .attr('x', ox + (badgeW + deltaColW + cellGap) / 2)
    .attr('y', badgeY + 15)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', success)
    .attr('font-size', '12px')
    .attr('font-weight', '700')
    .attr('opacity', 0)
    .text(en
      ? `Max spread: ${data.algorithmic.spread_pp} Pp — ${data.algorithmic.rating_en}`
      : `Max. Streuung: ${data.algorithmic.spread_pp} Pp — ${data.algorithmic.rating}`);
}

// ── Chart 3: Temperature Effect (Slide 14) ───────────────────────────

function renderTemperature(container, data) {
  container.innerHTML = '';
  const tip = ensureTooltip(container);

  const width = 600;
  const height = 400;
  const margin = { top: 30, right: 70, bottom: 30, left: 120 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const chartBlue = getCSSVar('--chart-blue');
  const chartYellow = getCSSVar('--chart-yellow');
  const accent = getCSSVar('--accent');

  const sessions = data.sessions;
  const methods = ['soh_e', 'soh_c', 'combined'];
  const methodLabels = en
    ? ['SOHe', 'SOHc', 'Combined']
    : ['SOHe', 'SOHc', 'Kombiniert'];
  const methodColors = [chartBlue, chartYellow, accent];

  // Compute deltas: Session B (cold) minus Session A (warm)
  const deltaValues = methods.map(m => sessions[1][m] - sessions[0][m]);

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const defs = svg.append('defs');
  const glow = defs.append('filter').attr('id', 'temp-glow');
  glow.append('feGaussianBlur').attr('stdDeviation', '2').attr('result', 'blur');
  const mg = glow.append('feMerge');
  mg.append('feMergeNode').attr('in', 'blur');
  mg.append('feMergeNode').attr('in', 'SourceGraphic');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Y scale: one row per method
  const yBand = d3.scaleBand()
    .domain(methodLabels)
    .range([0, innerH])
    .padding(0.3);

  // X scale: delta in Pp (symmetric around 0)
  const maxAbs = Math.max(...deltaValues.map(Math.abs));
  const xDomain = Math.ceil(maxAbs + 0.5);
  const x = d3.scaleLinear().domain([-xDomain, xDomain]).range([0, innerW]);
  const zeroX = x(0);

  // Alternating row backgrounds
  methodLabels.forEach((label, i) => {
    if (i % 2 === 0) {
      g.append('rect')
        .attr('class', 'temp-bg')
        .attr('x', -margin.left + 10)
        .attr('y', yBand(label) - yBand.step() * yBand.padding() / 2)
        .attr('width', innerW + margin.left - 10 + margin.right - 10)
        .attr('height', yBand.step())
        .attr('fill', getCSSVar('--text-secondary'))
        .attr('opacity', 0)
        .attr('rx', 4);
    }
  });

  // Zero line (center axis)
  g.append('line')
    .attr('class', 'temp-axis')
    .attr('x1', zeroX).attr('x2', zeroX)
    .attr('y1', -10).attr('y2', innerH + 10)
    .attr('stroke', getCSSVar('--text-secondary'))
    .attr('stroke-width', 1.5)
    .attr('opacity', 0);

  g.append('text')
    .attr('class', 'temp-axis')
    .attr('x', zeroX)
    .attr('y', -16)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '10px')
    .attr('opacity', 0)
    .text('0');

  // Axis labels at top
  g.append('text')
    .attr('class', 'temp-axis')
    .attr('x', x(-xDomain))
    .attr('y', -16)
    .attr('text-anchor', 'start')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '9px')
    .attr('opacity', 0)
    .text(en ? '← lower at 9.8°C' : '← niedriger bei 9,8 °C');

  g.append('text')
    .attr('class', 'temp-axis')
    .attr('x', x(xDomain))
    .attr('y', -16)
    .attr('text-anchor', 'end')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '9px')
    .attr('opacity', 0)
    .text(en ? 'higher at 9.8°C →' : 'höher bei 9,8 °C →');

  // X axis ticks
  const xAxisG = g.append('g')
    .attr('class', 'axis temp-x-axis')
    .attr('transform', `translate(0,${innerH + 5})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => d === 0 ? '' : `${d > 0 ? '+' : ''}${d} Pp`));
  xAxisG.selectAll('text').style('font-size', '9px');
  xAxisG.attr('opacity', 0);

  // Butterfly bars
  methods.forEach((method, mIdx) => {
    const label = methodLabels[mIdx];
    const cy = yBand(label) + yBand.bandwidth() / 2;
    const delta = deltaValues[mIdx];
    const color = methodColors[mIdx];
    const isCombined = mIdx === 2;
    const barH = yBand.bandwidth() * 0.7;

    // Bar from zero to delta
    const barX = delta >= 0 ? zeroX : x(delta);
    const barW = Math.abs(x(delta) - zeroX);

    g.append('rect')
      .attr('class', 'temp-bar')
      .attr('data-target-x', barX)
      .attr('data-target-width', Math.max(barW, 2))
      .attr('data-target-opacity', isCombined ? 0.85 : 0.6)
      .attr('x', zeroX)
      .attr('y', cy - barH / 2)
      .attr('width', 0)
      .attr('height', barH)
      .attr('rx', 4)
      .attr('fill', color)
      .attr('opacity', 0)
      .attr('filter', isCombined ? 'url(#temp-glow)' : null)
      .style('cursor', 'pointer')
      .on('mouseenter', (event) => {
        const v1 = sessions[0][method];
        const v2 = sessions[1][method];
        showTooltip(tip, `
          <div class="tooltip-method">${label}</div>
          <div class="tooltip-value">19 °C: ${v1.toFixed(1)} % → 9,8 °C: ${v2.toFixed(1)} %</div>
          <div class="tooltip-delta">Δ: ${delta > 0 ? '+' : ''}${delta.toFixed(1)} Pp</div>
        `, event, container);
      })
      .on('mouseleave', () => hideTooltip(tip));

    // Method label (left)
    g.append('text')
      .attr('class', 'temp-label')
      .attr('x', -14)
      .attr('y', cy)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', isCombined ? accent : getCSSVar('--text-primary'))
      .attr('font-size', '14px')
      .attr('font-weight', isCombined ? '700' : '600')
      .attr('opacity', 0)
      .text(label);

    // Delta value at end of bar
    const valX = x(delta) + (delta >= 0 ? 8 : -8);
    const valAnchor = delta >= 0 ? 'start' : 'end';
    g.append('text')
      .attr('class', 'temp-delta')
      .attr('x', valX)
      .attr('y', cy)
      .attr('text-anchor', valAnchor)
      .attr('dominant-baseline', 'middle')
      .attr('fill', color)
      .attr('font-size', isCombined ? '16px' : '13px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text(`${delta > 0 ? '+' : ''}${en ? delta.toFixed(1) : delta.toFixed(1).replace('.', ',')} Pp`);

    // Absolute values below method label
    const v1 = sessions[0][method];
    const v2 = sessions[1][method];
    g.append('text')
      .attr('class', 'temp-abs')
      .attr('x', -14)
      .attr('y', cy + 16)
      .attr('text-anchor', 'end')
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('font-size', '9px')
      .attr('opacity', 0)
      .text(`${v1.toFixed(1)} → ${v2.toFixed(1)} %`);
  });
}

// ── Chart 4: Resistance Comparison (Slide 15) ────────────────────────

function renderResistance(container, data) {
  container.innerHTML = '';

  const en = isEnglish();
  const success = getCSSVar('--success');
  const v = data.vehicles[0];

  const width = 520;
  const height = 340;
  const margin = { top: 20, right: 80, bottom: 20, left: 140 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const barData = [
    { label: en ? 'Charging' : 'Laden', value: v.r_charge_mohm, sub: 'R_i,charge' },
    { label: en ? 'Relaxation' : 'Relaxation', value: v.r_discharge_mohm, sub: 'R_i,relaxation' },
  ];

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const defs = svg.append('defs');
  const glow = defs.append('filter').attr('id', 'res-glow');
  glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
  const mg = glow.append('feMerge');
  mg.append('feMergeNode').attr('in', 'blur');
  mg.append('feMergeNode').attr('in', 'SourceGraphic');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Y scale: one row per measurement
  const yBand = d3.scaleBand()
    .domain(barData.map(d => d.label))
    .range([0, innerH * 0.5])
    .padding(0.4);

  // X scale: 0 to 60 mΩ
  const x = d3.scaleLinear().domain([0, 55]).range([0, innerW]);

  // Horizontal gauge bars
  barData.forEach((d, i) => {
    const cy = yBand(d.label) + yBand.bandwidth() / 2;
    const barH = yBand.bandwidth();
    const barW = x(d.value);
    const colorShade = i === 0 ? success : d3.color(success).darker(0.4).formatHex();

    // Track background
    g.append('rect')
      .attr('class', 'res-track')
      .attr('x', 0)
      .attr('y', cy - barH / 2)
      .attr('width', innerW)
      .attr('height', barH)
      .attr('rx', barH / 2)
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('opacity', 0);

    // Value bar
    g.append('rect')
      .attr('class', 'res-bar')
      .attr('data-target-width', barW)
      .attr('x', 0)
      .attr('y', cy - barH / 2)
      .attr('width', 0)
      .attr('height', barH)
      .attr('rx', barH / 2)
      .attr('fill', colorShade)
      .attr('opacity', 0)
      .attr('filter', 'url(#res-glow)');

    // Label (left)
    g.append('text')
      .attr('class', 'res-label')
      .attr('x', -14)
      .attr('y', cy)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', getCSSVar('--text-primary'))
      .attr('font-size', '15px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(d.label);

    // Value (right of bar)
    g.append('text')
      .attr('class', 'res-value')
      .attr('data-target-x', barW + 12)
      .attr('x', 12)
      .attr('y', cy)
      .attr('dominant-baseline', 'middle')
      .attr('fill', colorShade)
      .attr('font-size', '20px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text(`${d.value} mΩ`);
  });

  // Condition badges below
  const badgeY = innerH * 0.5 + 40;
  const conditions = [
    { icon: '⚡', label: 'DC-Puls' },
    { icon: '🔋', label: `${v.soc_percent} % SOC` },
    { icon: '🌡', label: `${v.temp_celsius} °C` },
  ];
  const badgeSpacing = 120;
  const badgeStartX = innerW / 2 - badgeSpacing;

  conditions.forEach((c, i) => {
    const bx = badgeStartX + i * badgeSpacing;
    g.append('rect')
      .attr('class', 'res-badge-bg')
      .attr('x', bx - 40)
      .attr('y', badgeY - 12)
      .attr('width', 100)
      .attr('height', 26)
      .attr('rx', 13)
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('opacity', 0);
    g.append('text')
      .attr('class', 'res-badge-text')
      .attr('x', bx + 10)
      .attr('y', badgeY + 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('font-size', '11px')
      .attr('opacity', 0)
      .text(`${c.icon} ${c.label}`);
  });

  // Explanation text
  const noteY = badgeY + 50;
  g.append('text')
    .attr('class', 'res-note')
    .attr('x', innerW / 2)
    .attr('y', noteY)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '10px')
    .attr('opacity', 0)
    .text(en
      ? 'Asymmetric R_i due to electrode-electrolyte interface impedance'
      : 'Asymmetrisches R_i durch Impedanz der Elektroden-Elektrolyt-Grenzfläche');
}

// ── Chart 5: AVL SOH Timeline (Slide 13, right panel) ────────────────

function renderAVLTimeline(container, data) {
  container.innerHTML = '';
  const tip = ensureTooltip(container);

  const width = 600;
  const height = 400;
  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const accent = getCSSVar('--accent');
  const success = getCSSVar('--success');

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const measurements = data.measurements;
  const parseDate = d3.timeParse('%Y-%m-%d');
  const points = measurements.map(m => ({
    ...m,
    dateObj: parseDate(m.date),
  }));

  // Scales
  const xExtent = d3.extent(points, d => d.dateObj);
  // Add 15-day padding on each side
  const xPad = 15 * 24 * 60 * 60 * 1000;
  const x = d3.scaleTime()
    .domain([new Date(xExtent[0].getTime() - xPad), new Date(xExtent[1].getTime() + xPad)])
    .range([0, innerW]);

  const y = d3.scaleLinear().domain([95, 102]).range([innerH, 0]);

  // Grid
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-innerW).tickFormat('').ticks(7));

  // Mean line
  const meanY = y(data.stats.mean);
  g.append('line')
    .attr('x1', 0).attr('x2', innerW)
    .attr('y1', meanY).attr('y2', meanY)
    .attr('stroke', accent)
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '6,4')
    .attr('opacity', 0.7);

  g.append('text')
    .attr('x', innerW - 4)
    .attr('y', meanY - 8)
    .attr('text-anchor', 'end')
    .attr('fill', accent)
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .text(`μ = ${data.stats.mean} %`);

  // σ band
  const bandTop = y(data.stats.mean + data.stats.sigma);
  const bandBottom = y(data.stats.mean - data.stats.sigma);
  g.append('rect')
    .attr('x', 0).attr('y', bandTop)
    .attr('width', innerW)
    .attr('height', bandBottom - bandTop)
    .attr('fill', accent)
    .attr('opacity', 0.08);

  // Axes
  const formatMonth = en ? d3.timeFormat('%b %Y') : d3.timeFormat('%b %Y');
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(formatMonth))
    .selectAll('text')
    .style('font-size', '11px')
    .style('fill', getCSSVar('--text-primary'))
    .attr('transform', 'rotate(-25)')
    .attr('text-anchor', 'end');

  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).ticks(7).tickFormat(d => `${d} %`));

  // Line connecting points — starts with zero length (stroke-dashoffset)
  const line = d3.line()
    .x(d => x(d.dateObj))
    .y(d => y(d.soh));

  const linePath = g.append('path')
    .datum(points)
    .attr('class', 'avl-line')
    .attr('fill', 'none')
    .attr('stroke', success)
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.5)
    .attr('d', line);

  // Set stroke-dasharray/offset for line-draw animation
  const lineNode = linePath.node();
  const lineLen = lineNode.getTotalLength();
  linePath
    .attr('stroke-dasharray', lineLen)
    .attr('stroke-dashoffset', lineLen);

  // Data points — start at r=0
  g.selectAll('.avl-dot')
    .data(points)
    .join('circle')
    .attr('class', 'avl-dot')
    .attr('cx', d => x(d.dateObj))
    .attr('cy', d => y(d.soh))
    .attr('r', 0)
    .attr('data-target-r', 7)
    .attr('fill', success)
    .attr('stroke', getCSSVar('--bg-surface'))
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('mousemove', (event, d) => {
      const dateStr = d3.timeFormat('%d.%m.%Y')(d.dateObj);
      showTooltip(tip, `
        <div class="tooltip-method">${dateStr}</div>
        <div class="tooltip-value">SOH: ${d.soh} %</div>
        <div class="tooltip-note">${d.km.toLocaleString('de-DE')} km · ${d.temp} °C</div>
      `, event, container);
    })
    .on('mouseleave', () => hideTooltip(tip));

  // Value labels on points — start hidden
  points.forEach((d, i) => {
    // Offset duplicate Apr 2025 points vertically
    const yOff = (i === 2 && points[3] && points[3].soh === d.soh) ? -16 : (i === 3 ? 20 : -14);
    g.append('text')
      .attr('class', 'avl-value')
      .attr('x', x(d.dateObj))
      .attr('y', y(d.soh) + yOff)
      .attr('text-anchor', 'middle')
      .attr('fill', getCSSVar('--text-primary'))
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(`${d.soh} %`);
  });

  // Stats annotation
  g.append('text')
    .attr('x', innerW / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('fill', success)
    .attr('font-size', '13px')
    .attr('font-weight', '700')
    .text(`σ = ${data.stats.sigma} % · n = ${data.stats.n} · ${en ? data.stats.timespan_en : data.stats.timespan}`);
}

// ── Chart 6: Community Data Positioning (Slide 18) ───────────────────

function renderCommunityComparison(container, data) {
  container.innerHTML = '';
  const tip = ensureTooltip(container);

  const width = 900;
  const height = 400;
  const margin = { top: 40, right: 40, bottom: 40, left: 200 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const accent = getCSSVar('--accent');
  const chartBlue = getCSSVar('--chart-blue');
  const success = getCSSVar('--success');

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const datasets = data.datasets;

  // X scale: SOH range
  const x = d3.scaleLinear().domain([65, 108]).range([0, innerW]);

  // Y scale: dataset rows
  const y = d3.scaleBand()
    .domain(datasets.map(d => en ? d.name_en : d.name))
    .range([0, innerH])
    .padding(0.5);

  // Grid
  const gridG = g.append('g')
    .attr('class', 'grid comm-grid')
    .call(d3.axisBottom(x).tickSize(innerH).tickFormat('').ticks(8))
    .attr('transform', 'translate(0,0)');
  gridG.attr('opacity', 0);

  // X axis
  const xAxisG = g.append('g')
    .attr('class', 'axis comm-x-axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(8).tickFormat(d => `${d} %`));
  xAxisG.attr('opacity', 0);

  // Y axis labels
  const yAxisG = g.append('g')
    .attr('class', 'axis comm-y-axis')
    .call(d3.axisLeft(y).tickSize(0));
  yAxisG.selectAll('text')
    .style('font-size', '18px')
    .style('font-weight', '600')
    .attr('class', 'community-label');
  yAxisG.attr('opacity', 0);

  g.select('.axis .domain').remove();

  // Range bars (min to max)
  datasets.forEach(d => {
    const label = en ? d.name_en : d.name;
    const barY = y(label);
    const barH = y.bandwidth();

    // Full range bar (light)
    const rangeW = x(d.max) - x(d.min);
    g.append('rect')
      .attr('class', 'comm-range')
      .attr('data-target-width', rangeW)
      .attr('x', x(d.mean))
      .attr('y', barY)
      .attr('width', 0)
      .attr('height', barH)
      .attr('rx', barH / 2)
      .attr('fill', chartBlue)
      .attr('opacity', 0)
      .attr('data-target-x', x(d.min));

    // Mean marker
    g.append('line')
      .attr('class', 'comm-mean')
      .attr('x1', x(d.mean)).attr('x2', x(d.mean))
      .attr('y1', barY - 4).attr('y2', barY + barH + 4)
      .attr('stroke', chartBlue)
      .attr('stroke-width', 2.5)
      .attr('opacity', 0);

    // Mean label
    g.append('text')
      .attr('class', 'comm-mean-label')
      .attr('x', x(d.mean))
      .attr('y', barY - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', chartBlue)
      .attr('font-size', '15px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(`μ = ${d.mean} %`);

    // Min/max labels
    g.append('text')
      .attr('class', 'comm-minmax')
      .attr('x', x(d.min) - 6)
      .attr('y', barY + barH / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '14px')
      .attr('opacity', 0)
      .text(`${d.min}`);

    g.append('text')
      .attr('class', 'comm-minmax')
      .attr('x', x(d.max) + 6)
      .attr('y', barY + barH / 2)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '14px')
      .attr('opacity', 0)
      .text(`${d.max}`);

    // n label
    g.append('text')
      .attr('class', 'comm-n')
      .attr('x', x(d.mean))
      .attr('y', barY + barH + 18)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('opacity', 0)
      .text(`n = ${d.n}`);
  });

  // Own measurement markers (diamonds)
  data.own_measurements.forEach(own => {
    // Place on each dataset row
    datasets.forEach(d => {
      const label = en ? d.name_en : d.name;
      const barY = y(label);
      const barH = y.bandwidth();
      const cx = x(own.soh);
      const cy = barY + barH / 2;

      // Diamond marker
      const size = 8;
      g.append('path')
        .attr('class', 'comm-diamond')
        .attr('d', `M${cx},${cy - size} L${cx + size},${cy} L${cx},${cy + size} L${cx - size},${cy} Z`)
        .attr('fill', own.label.includes('FP') ? getCSSVar('--warning') : accent)
        .attr('stroke', getCSSVar('--bg-surface'))
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .style('cursor', 'pointer')
        .on('mousemove', (event) => {
          showTooltip(tip, `
            <div class="tooltip-method">${own.label}</div>
            <div class="tooltip-value">SOH: ${own.soh} % (${own.method})</div>
            <div class="tooltip-note">${own.km.toLocaleString('de-DE')} km</div>
          `, event, container);
        })
        .on('mouseleave', () => hideTooltip(tip));
    });
  });

  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.className = 'chart-legend comm-legend';
  legendDiv.style.opacity = '0';
  const items = [
    { color: chartBlue, label: en ? 'Community range' : 'Community-Bereich', opacity: '0.2' },
    { color: accent, label: 'VW ID.4 (IfE, 10.801 km)' },
    { color: getCSSVar('--warning'), label: 'VW ID.4 (FP, 65.467 km)' },
  ];
  items.forEach(item => {
    const el = document.createElement('span');
    el.className = 'chart-legend-item';
    el.innerHTML = `<span class="chart-legend-swatch" style="background:${item.color};${item.opacity ? `opacity:${item.opacity}` : ''}"></span>${item.label}`;
    legendDiv.appendChild(el);
  });
  container.appendChild(legendDiv);
}

// ── Chart 7: Discharge Protocol Flowchart (Slide 10) ─────────────────

function renderDischargeProtocol(container, data) {
  container.innerHTML = '';

  const width = 900;
  const height = 520;
  const en = isEnglish();

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  // ── Layout constants ──
  const flowX = 260;         // center of flowchart boxes
  const boxW = 380;
  const boxH = 60;
  const gap = 18;            // vertical gap between boxes
  const startY = 20;
  const arrowLen = gap;

  const steps = data.steps;

  // ── Draw flowchart boxes + arrows ──
  steps.forEach((step, i) => {
    const yPos = startY + i * (boxH + arrowLen);

    // Box
    const boxG = svg.append('g')
      .attr('transform', `translate(${flowX - boxW / 2}, ${yPos})`);

    // Rounded rect with left accent border
    boxG.append('rect')
      .attr('width', boxW)
      .attr('height', boxH)
      .attr('rx', 8)
      .attr('fill', getCSSVar('--bg-surface'))
      .attr('stroke', step.color)
      .attr('stroke-width', 2.5);

    // Left color accent strip
    boxG.append('rect')
      .attr('width', 6)
      .attr('height', boxH)
      .attr('rx', 3)
      .attr('fill', step.color);

    // Step number circle
    boxG.append('circle')
      .attr('cx', 30)
      .attr('cy', boxH / 2)
      .attr('r', 14)
      .attr('fill', step.color);

    boxG.append('text')
      .attr('x', 30)
      .attr('y', boxH / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#ffffff')
      .attr('font-size', '13px')
      .attr('font-weight', '700')
      .text(step.id);

    // Label (bold)
    boxG.append('text')
      .attr('x', 56)
      .attr('y', boxH / 2 - 10)
      .attr('fill', getCSSVar('--text-primary'))
      .attr('font-size', '15px')
      .attr('font-weight', '700')
      .text(en ? step.label_en : step.label);

    // Detail
    boxG.append('text')
      .attr('x', 56)
      .attr('y', boxH / 2 + 12)
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('font-size', '12px')
      .text(en ? step.detail_en : step.detail);

    // Arrow to next box
    if (i < steps.length - 1) {
      const arrowY1 = yPos + boxH;
      const arrowY2 = yPos + boxH + arrowLen;
      svg.append('line')
        .attr('x1', flowX).attr('x2', flowX)
        .attr('y1', arrowY1).attr('y2', arrowY2 - 4)
        .attr('stroke', getCSSVar('--text-secondary'))
        .attr('stroke-width', 2)
        .attr('opacity', 0.5);

      // Arrow head
      svg.append('path')
        .attr('d', `M${flowX - 5},${arrowY2 - 8} L${flowX},${arrowY2 - 2} L${flowX + 5},${arrowY2 - 8}`)
        .attr('fill', getCSSVar('--text-secondary'))
        .attr('opacity', 0.5);
    }
  });

  // ── SOC gauge on the right side ──
  const gaugeX = 660;
  const gaugeY = 50;
  const gaugeW = 60;
  const gaugeH = 300;

  // Gauge background
  svg.append('rect')
    .attr('x', gaugeX)
    .attr('y', gaugeY)
    .attr('width', gaugeW)
    .attr('height', gaugeH)
    .attr('rx', 8)
    .attr('fill', getCSSVar('--bg-surface'))
    .attr('stroke', getCSSVar('--text-secondary'))
    .attr('stroke-width', 1.5)
    .attr('opacity', 0.6);

  // Starting SOC fill (top portion)
  const startPct = data.soc_gauge.start / 100;
  const startFillH = gaugeH * startPct;
  svg.append('rect')
    .attr('x', gaugeX + 3)
    .attr('y', gaugeY + gaugeH - startFillH + 3)
    .attr('width', gaugeW - 6)
    .attr('height', startFillH - 6)
    .attr('rx', 5)
    .attr('fill', '#3b82f6')
    .attr('opacity', 0.2);

  // Ending SOC fill (BMS ~5.75%)
  const endPct = data.soc_gauge.bms_at_zero / 100;
  const endFillH = gaugeH * endPct;
  svg.append('rect')
    .attr('x', gaugeX + 3)
    .attr('y', gaugeY + gaugeH - endFillH + 3)
    .attr('width', gaugeW - 6)
    .attr('height', endFillH - 6)
    .attr('rx', 5)
    .attr('fill', '#f59e0b')
    .attr('opacity', 0.5);

  // Gauge labels
  svg.append('text')
    .attr('x', gaugeX + gaugeW / 2)
    .attr('y', gaugeY - 10)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-primary'))
    .attr('font-size', '13px')
    .attr('font-weight', '700')
    .text('SOC');

  // Start label
  svg.append('text')
    .attr('x', gaugeX + gaugeW + 10)
    .attr('y', gaugeY + gaugeH - startFillH + 14)
    .attr('fill', '#3b82f6')
    .attr('font-size', '12px')
    .attr('font-weight', '600')
    .text(`${en ? 'Start' : 'Start'}: ~${data.soc_gauge.start} %`);

  // End label — Display SOC
  svg.append('text')
    .attr('x', gaugeX + gaugeW + 10)
    .attr('y', gaugeY + gaugeH - 20)
    .attr('fill', '#f59e0b')
    .attr('font-size', '12px')
    .attr('font-weight', '600')
    .text(`Display: 0 %`);

  // BMS annotation
  svg.append('text')
    .attr('x', gaugeX + gaugeW + 10)
    .attr('y', gaugeY + gaugeH - 4)
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '11px')
    .text(`BMS: ≈ ${data.soc_gauge.bms_at_zero} %`);

  // Arrow from start to end
  const arrowStartY = gaugeY + gaugeH - startFillH + 30;
  const arrowEndY = gaugeY + gaugeH - 35;
  svg.append('line')
    .attr('x1', gaugeX - 15).attr('x2', gaugeX - 15)
    .attr('y1', arrowStartY).attr('y2', arrowEndY)
    .attr('stroke', getCSSVar('--accent'))
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowDown)');

  // Arrow marker def
  svg.append('defs').append('marker')
    .attr('id', 'arrowDown')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 5).attr('refY', 10)
    .attr('markerWidth', 6).attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,0 L5,10 L10,0')
    .attr('fill', getCSSVar('--accent'));

  svg.append('text')
    .attr('x', gaugeX - 20)
    .attr('y', (arrowStartY + arrowEndY) / 2)
    .attr('text-anchor', 'end')
    .attr('fill', getCSSVar('--accent'))
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .text(en ? 'Driving' : 'Fahrt');

  // ── Insight bar at bottom ──
  const insightY = height - 50;
  const insightText = en ? data.insight.en : data.insight.de;

  svg.append('rect')
    .attr('x', 30)
    .attr('y', insightY)
    .attr('width', width - 60)
    .attr('height', 36)
    .attr('rx', 6)
    .attr('fill', getCSSVar('--accent'))
    .attr('opacity', 0.08);

  svg.append('rect')
    .attr('x', 30)
    .attr('y', insightY)
    .attr('width', 4)
    .attr('height', 36)
    .attr('rx', 2)
    .attr('fill', getCSSVar('--accent'));

  svg.append('text')
    .attr('x', 46)
    .attr('y', insightY + 22)
    .attr('fill', getCSSVar('--text-primary'))
    .attr('font-size', '12px')
    .text(insightText);
}

// ── Chart 8: CC-CV Charging Profile (Slide 11) ──────────────────────

function renderChargingProfile(container, data) {
  container.innerHTML = '';
  const tip = ensureTooltip(container);

  const width = 363;
  const height = 194;
  const margin = { top: 18, right: 35, bottom: 28, left: 32 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const accent = getCSSVar('--accent');
  const chartBlue = '#3b82f6';
  const chartOrange = '#f97316';

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const profile = data.profile;
  const transitionSOC = data.transition_soc;

  // ── Scales ──
  const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);
  const yVoltage = d3.scaleLinear().domain([290, 430]).range([innerH, 0]);
  const yCurrent = d3.scaleLinear().domain([0, 20]).range([innerH, 0]);

  // ── Shaded regions ──
  // CC region (0–80%)
  g.append('rect')
    .attr('x', x(0))
    .attr('y', 0)
    .attr('width', x(transitionSOC) - x(0))
    .attr('height', innerH)
    .attr('fill', chartBlue)
    .attr('opacity', 0.05);

  // CV region (80–100%)
  g.append('rect')
    .attr('x', x(transitionSOC))
    .attr('y', 0)
    .attr('width', x(100) - x(transitionSOC))
    .attr('height', innerH)
    .attr('fill', chartOrange)
    .attr('opacity', 0.05);

  // Phase labels at top
  g.append('text')
    .attr('x', x(transitionSOC / 2))
    .attr('y', -4)
    .attr('text-anchor', 'middle')
    .attr('fill', chartBlue)
    .attr('font-size', '6px')
    .attr('font-weight', '700')
    .text(en ? data.cc_phase.label_en : data.cc_phase.label);

  g.append('text')
    .attr('x', x(transitionSOC + (100 - transitionSOC) / 2))
    .attr('y', -4)
    .attr('text-anchor', 'middle')
    .attr('fill', chartOrange)
    .attr('font-size', '6px')
    .attr('font-weight', '700')
    .text(en ? data.cv_phase.label_en : data.cv_phase.label);

  // ── Transition line ──
  g.append('line')
    .attr('x1', x(transitionSOC)).attr('x2', x(transitionSOC))
    .attr('y1', -2).attr('y2', innerH)
    .attr('stroke', getCSSVar('--text-secondary'))
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '6,4')
    .attr('opacity', 0.6);

  g.append('text')
    .attr('x', x(transitionSOC))
    .attr('y', -9)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '5px')
    .text(`${transitionSOC} % SOC`);

  // ── Grid ──
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(yVoltage).tickSize(-innerW).tickFormat('').ticks(5));

  // ── X axis ──
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(10).tickFormat(d => `${d} %`))
    .selectAll('text')
    .style('font-size', '5px');

  g.append('text')
    .attr('x', innerW / 2)
    .attr('y', innerH + 20)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '6px')
    .text('SOC (%)');

  // ── Left Y axis (Voltage) ──
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(yVoltage).ticks(5).tickFormat(d => `${d} V`))
    .selectAll('text')
    .style('fill', chartBlue)
    .style('font-size', '5px');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerH / 2)
    .attr('y', -22)
    .attr('text-anchor', 'middle')
    .attr('fill', chartBlue)
    .attr('font-size', '6px')
    .attr('font-weight', '600')
    .text(en ? 'Voltage (V)' : 'Spannung (V)');

  // ── Right Y axis (Current) ──
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${innerW},0)`)
    .call(d3.axisRight(yCurrent).ticks(4).tickFormat(d => `${d} A`))
    .selectAll('text')
    .style('fill', chartOrange)
    .style('font-size', '5px');

  g.append('text')
    .attr('transform', 'rotate(90)')
    .attr('x', innerH / 2)
    .attr('y', -innerW - 25)
    .attr('text-anchor', 'middle')
    .attr('fill', chartOrange)
    .attr('font-size', '6px')
    .attr('font-weight', '600')
    .text(en ? 'Current (A)' : 'Strom (A)');

  // ── Voltage line ──
  const voltageLine = d3.line()
    .x(d => x(d.soc))
    .y(d => yVoltage(d.voltage))
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(profile)
    .attr('fill', 'none')
    .attr('stroke', chartBlue)
    .attr('stroke-width', 1.5)
    .attr('d', voltageLine);

  // ── Current line ──
  const currentLine = d3.line()
    .x(d => x(d.soc))
    .y(d => yCurrent(d.current))
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(profile)
    .attr('fill', 'none')
    .attr('stroke', chartOrange)
    .attr('stroke-width', 1.5)
    .attr('d', currentLine);

  // ── Key value annotations ──
  // CC constant current label
  g.append('text')
    .attr('x', x(40))
    .attr('y', yCurrent(16) - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', chartOrange)
    .attr('font-size', '5px')
    .attr('font-weight', '600')
    .text(`I = ${profile[0].current} A`);

  // CV constant voltage label
  g.append('text')
    .attr('x', x(92))
    .attr('y', yVoltage(408) - 6)
    .attr('text-anchor', 'middle')
    .attr('fill', chartBlue)
    .attr('font-size', '5px')
    .attr('font-weight', '600')
    .text(`U = ${profile[profile.length - 1].voltage} V`);

  // End current annotation
  g.append('text')
    .attr('x', x(100) + 2)
    .attr('y', yCurrent(0.5) + 2)
    .attr('text-anchor', 'start')
    .attr('fill', accent)
    .attr('font-size', '5px')
    .attr('font-weight', '600')
    .text(`I < ${data.end_current_a} A`);

  // ── Interactive overlay ──
  const bisect = d3.bisector(d => d.soc).left;
  const focusV = g.append('circle').attr('r', 2).attr('fill', chartBlue).style('display', 'none');
  const focusI = g.append('circle').attr('r', 2).attr('fill', chartOrange).style('display', 'none');
  const focusLine = g.append('line')
    .attr('stroke', getCSSVar('--text-secondary'))
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')
    .style('display', 'none');

  g.append('rect')
    .attr('width', innerW)
    .attr('height', innerH)
    .attr('fill', 'transparent')
    .on('mousemove', (event) => {
      const svgNode = svg.node();
      const bcr = svgNode.getBoundingClientRect();
      const vb = svgNode.viewBox.baseVal;
      const mx = (event.clientX - bcr.left) / bcr.width * vb.width - margin.left;
      const soc = x.invert(mx);
      const idx = bisect(profile, soc, 1);
      const d0 = profile[idx - 1];
      const d1 = profile[idx] || d0;
      const d = soc - d0.soc > d1.soc - soc ? d1 : d0;

      focusV.attr('cx', x(d.soc)).attr('cy', yVoltage(d.voltage)).style('display', null);
      focusI.attr('cx', x(d.soc)).attr('cy', yCurrent(d.current)).style('display', null);
      focusLine.attr('x1', mx).attr('x2', mx).attr('y1', 0).attr('y2', innerH).style('display', null);

      const phase = d.soc <= transitionSOC ? (en ? 'CC Phase' : 'CC-Phase') : (en ? 'CV Phase' : 'CV-Phase');
      showTooltip(tip, `
        <div class="tooltip-method">${phase} · SOC ${d.soc} %</div>
        <div class="tooltip-value" style="color:${chartBlue}">${en ? 'Voltage' : 'Spannung'}: ${d.voltage} V</div>
        <div class="tooltip-value" style="color:${chartOrange}">${en ? 'Current' : 'Strom'}: ${d.current} A</div>
      `, event, container);
    })
    .on('mouseleave', () => {
      focusV.style('display', 'none');
      focusI.style('display', 'none');
      focusLine.style('display', 'none');
      hideTooltip(tip);
    });

  // ── Legend ──
  const legendDiv = document.createElement('div');
  legendDiv.className = 'chart-legend';
  const items = [
    { color: chartBlue, label: en ? 'Voltage (V)' : 'Spannung (V)' },
    { color: chartOrange, label: en ? 'Current (A)' : 'Strom (A)' },
  ];
  items.forEach(item => {
    const el = document.createElement('span');
    el.className = 'chart-legend-item';
    el.innerHTML = `<span class="chart-legend-swatch" style="background:${item.color}"></span>${item.label}`;
    legendDiv.appendChild(el);
  });

  // SOH method usage annotation
  const sohNote = document.createElement('div');
  sohNote.className = 'chart-legend';
  sohNote.style.marginTop = '2px';
  sohNote.style.fontSize = '8px';
  sohNote.style.opacity = '0.8';
  sohNote.innerHTML = `<span style="color:${chartBlue}">CC → ${en ? data.cc_phase.soh_use_en : data.cc_phase.soh_use}</span> · <span style="color:${chartOrange}">CV → ${en ? data.cv_phase.soh_use_en : data.cv_phase.soh_use}</span>`;

  container.appendChild(legendDiv);
  container.appendChild(sohNote);
}

// ── Convergence Flow (Pipeline) ─────────────────────────────────────

function renderConvergenceFlow(container) {
  container.innerHTML = '';

  const en = isEnglish();
  const width = 1100;
  const height = 700;

  const methods = [
    { id: 'sohe', label: 'SOH\u2091', value: '99,6 %', color: getCSSVar('--chart-blue'), type: en ? 'Energy-based' : 'Energiebasiert' },
    { id: 'sohc', label: 'SOH\u1D04', value: '91,8 %', color: getCSSVar('--chart-blue'), type: en ? 'Capacity-based' : 'Kapazitätsbasiert' },
    { id: 'cap',  label: 'SOH\u2096\u2090\u209A', value: '89,7 %', color: getCSSVar('--success'), type: en ? 'Capacity-based' : 'Kapazitätsbasiert' },
    { id: 'sohr', label: 'SOH\u1D3F', value: '100,0 %', color: getCSSVar('--warning'), type: en ? 'Resistance-based' : 'Widerstandsbasiert' },
    { id: 'ica',  label: 'ICA', value: en ? 'Diagnostic' : 'Diagnostisch', color: '#9F7AEA', type: en ? 'Incremental' : 'Inkrementell' },
    { id: 'dva',  label: 'DVA', value: en ? 'Diagnostic' : 'Diagnostisch', color: '#9F7AEA', type: en ? 'Differential' : 'Differentiell' },
  ];

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  // Positions
  const inputX = 150;
  const methodX = 420;
  const mergeX = 780;
  const outputX = 950;
  const centerY = height / 2 - 80;
  const spacing = 75;
  const methodYs = methods.map((_, i) => centerY + (i - 2.5) * spacing);

  // ── Gradient defs ──
  const defs = svg.append('defs');
  methods.forEach((m, i) => {
    const grad = defs.append('linearGradient')
      .attr('id', `flow-grad-${m.id}`)
      .attr('x1', '0%').attr('x2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', m.color).attr('stop-opacity', 0.6);
    grad.append('stop').attr('offset', '100%').attr('stop-color', getCSSVar('--accent')).attr('stop-opacity', 0.7);
  });

  // Glow filter
  const glow = defs.append('filter').attr('id', 'flow-glow');
  glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
  const merge = glow.append('feMerge');
  merge.append('feMergeNode').attr('in', 'blur');
  merge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Electron glow filter (brighter, larger radius)
  const eGlow = defs.append('filter').attr('id', 'electron-glow').attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
  eGlow.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'blur');
  const eMerge = eGlow.append('feMerge');
  eMerge.append('feMergeNode').attr('in', 'blur');
  eMerge.append('feMergeNode').attr('in', 'blur');
  eMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // ── Input node ──
  const inputG = svg.append('g').attr('class', 'conv-node conv-input').attr('transform', `translate(${inputX}, ${centerY})`);
  inputG.append('rect')
    .attr('class', 'conv-node-bg')
    .attr('x', -80).attr('y', -55)
    .attr('width', 160).attr('height', 110)
    .attr('rx', 14)
    .attr('fill', 'rgba(76, 154, 255, 0.12)')
    .attr('stroke', getCSSVar('--chart-blue'))
    .attr('stroke-width', 1.5);
  inputG.append('text')
    .attr('y', -8)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--chart-blue'))
    .attr('font-size', '16px')
    .attr('font-weight', '700')
    .text(en ? 'OBD Raw Data' : 'OBD-Rohdaten');
  inputG.append('text')
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '11px')
    .text('194 Sensoren · CSV');

  // ── Flow paths: input → methods ──
  methods.forEach((m, i) => {
    const sy = centerY;
    const ey = methodYs[i];
    const path = d3.path();
    path.moveTo(inputX + 80, sy);
    path.bezierCurveTo(inputX + 160, sy, methodX - 80, ey, methodX - 50, ey);

    svg.append('path')
      .attr('d', path.toString())
      .attr('fill', 'none')
      .attr('stroke', m.color)
      .attr('stroke-width', 3)
      .attr('opacity', 0.25);

    svg.append('path')
      .attr('class', `conv-path-in conv-path-in-${i}`)
      .attr('data-method-idx', i)
      .attr('data-color', m.color)
      .attr('d', path.toString())
      .attr('fill', 'none')
      .attr('stroke', m.color)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.7)
      .attr('filter', 'url(#flow-glow)');
  });

  // ── Method nodes ──
  methods.forEach((m, i) => {
    const my = methodYs[i];
    const mg = svg.append('g').attr('class', `conv-node conv-method conv-method-${i}`).attr('data-color', m.color).attr('transform', `translate(${methodX}, ${my})`);

    mg.append('rect')
      .attr('class', 'conv-node-bg')
      .attr('x', -50).attr('y', -28)
      .attr('width', 100).attr('height', 56)
      .attr('rx', 10)
      .attr('fill', `rgba(${hexToRgb(m.color)}, 0.1)`)
      .attr('stroke', m.color)
      .attr('stroke-width', 1.5);

    mg.append('text')
      .attr('y', -6)
      .attr('text-anchor', 'middle')
      .attr('fill', m.color)
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .text(m.label);

    mg.append('text')
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('font-size', '11px')
      .text(m.value);
  });

  // ── Flow paths: methods → merge point ──
  methods.forEach((m, i) => {
    const sy = methodYs[i];
    const path = d3.path();
    path.moveTo(methodX + 50, sy);
    path.bezierCurveTo(methodX + 180, sy, mergeX - 120, centerY, mergeX, centerY);

    svg.append('path')
      .attr('d', path.toString())
      .attr('fill', 'none')
      .attr('stroke', `url(#flow-grad-${m.id})`)
      .attr('stroke-width', 3)
      .attr('opacity', 0.3);

    svg.append('path')
      .attr('class', `conv-path-out conv-path-out-${i}`)
      .attr('data-method-idx', i)
      .attr('data-color', m.color)
      .attr('d', path.toString())
      .attr('fill', 'none')
      .attr('stroke', `url(#flow-grad-${m.id})`)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8)
      .attr('filter', 'url(#flow-glow)');
  });

  // ── Merge point glow ──
  svg.append('circle')
    .attr('cx', mergeX).attr('cy', centerY)
    .attr('r', 20)
    .attr('fill', 'rgba(226, 0, 26, 0.15)')
    .attr('filter', 'url(#flow-glow)');

  // ── Flow: merge → output ──
  const outPath = d3.path();
  outPath.moveTo(mergeX + 20, centerY);
  outPath.bezierCurveTo(mergeX + 80, centerY, outputX - 100, centerY, outputX - 70, centerY);

  svg.append('path')
    .attr('d', outPath.toString())
    .attr('fill', 'none')
    .attr('stroke', getCSSVar('--accent'))
    .attr('stroke-width', 4)
    .attr('opacity', 0.4);

  svg.append('path')
    .attr('class', 'conv-path-merge')
    .attr('d', outPath.toString())
    .attr('fill', 'none')
    .attr('stroke', getCSSVar('--accent'))
    .attr('stroke-width', 2)
    .attr('opacity', 0.9)
    .attr('filter', 'url(#flow-glow)');

  // ── Output node ──
  const outputG = svg.append('g').attr('class', 'conv-node conv-output').attr('transform', `translate(${outputX}, ${centerY})`);
  outputG.append('rect')
    .attr('class', 'conv-node-bg')
    .attr('x', -70).attr('y', -55)
    .attr('width', 140).attr('height', 110)
    .attr('rx', 14)
    .attr('fill', 'rgba(226, 0, 26, 0.1)')
    .attr('stroke', getCSSVar('--accent'))
    .attr('stroke-width', 2);

  outputG.append('text')
    .attr('y', -15)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-primary'))
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .text(en ? 'Combined' : 'Kombiniert');

  outputG.append('text')
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--accent'))
    .attr('font-size', '28px')
    .attr('font-weight', '800')
    .text('95,7 %');

  // ── AVL reference branch (bottom) ──
  const avlY = centerY + 230;
  const avlColor = getCSSVar('--success');

  // AVL input node (below OBD)
  const avlInputG = svg.append('g').attr('class', 'conv-node conv-avl-input').attr('transform', `translate(${inputX}, ${avlY})`);
  avlInputG.append('rect')
    .attr('class', 'conv-node-bg')
    .attr('x', -80).attr('y', -40)
    .attr('width', 160).attr('height', 80)
    .attr('rx', 14)
    .attr('fill', `rgba(0, 201, 167, 0.1)`)
    .attr('stroke', avlColor)
    .attr('stroke-width', 1.5);
  avlInputG.append('text')
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .attr('fill', avlColor)
    .attr('font-size', '16px')
    .attr('font-weight', '700')
    .text('AVL HV-Check');
  avlInputG.append('text')
    .attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '11px')
    .text(en ? 'Off-Board Reference' : 'Off-Board-Referenz');

  // AVL output node (below Kombiniert)
  const avlOutputG = svg.append('g').attr('class', 'conv-node conv-avl-output').attr('transform', `translate(${outputX}, ${avlY})`);
  avlOutputG.append('rect')
    .attr('class', 'conv-node-bg')
    .attr('x', -70).attr('y', -45)
    .attr('width', 140).attr('height', 90)
    .attr('rx', 14)
    .attr('fill', `rgba(0, 201, 167, 0.1)`)
    .attr('stroke', avlColor)
    .attr('stroke-width', 2);
  avlOutputG.append('text')
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-primary'))
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .text(en ? 'AVL Reference' : 'AVL-Referenz');
  avlOutputG.append('text')
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .attr('fill', avlColor)
    .attr('font-size', '28px')
    .attr('font-weight', '800')
    .text('97,3 %');

  // AVL flow path: input → output
  const avlPath = d3.path();
  avlPath.moveTo(inputX + 80, avlY);
  avlPath.bezierCurveTo(inputX + 300, avlY, outputX - 300, avlY, outputX - 70, avlY);

  svg.append('path')
    .attr('d', avlPath.toString())
    .attr('fill', 'none')
    .attr('stroke', avlColor)
    .attr('stroke-width', 3)
    .attr('opacity', 0.25);

  svg.append('path')
    .attr('class', 'conv-path-avl')
    .attr('data-color', avlColor)
    .attr('d', avlPath.toString())
    .attr('fill', 'none')
    .attr('stroke', avlColor)
    .attr('stroke-width', 1.5)
    .attr('opacity', 0.7)
    .attr('filter', 'url(#flow-glow)');

  // Deviation label between the two output nodes
  const midY = (centerY + avlY) / 2;
  svg.append('text')
    .attr('x', outputX)
    .attr('y', midY + 5)
    .attr('text-anchor', 'middle')
    .attr('fill', getCSSVar('--text-secondary'))
    .attr('font-size', '13px')
    .attr('font-weight', '600')
    .text('Δ = −1,6 Pp');

  // Dashed connector between the two output boxes
  svg.append('line')
    .attr('x1', outputX).attr('x2', outputX)
    .attr('y1', centerY + 55).attr('y2', avlY - 45)
    .attr('stroke', getCSSVar('--text-secondary'))
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
    .attr('opacity', 0.4);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// ── Vehicle Measurement Timeline ────────────────────────────────────

function renderVehicleTimeline(container, data) {
  container.innerHTML = '';
  const tip = ensureTooltip(container);

  const width = 900;
  const height = 140;
  const margin = { top: 30, right: 30, bottom: 35, left: 30 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const parseDate = d3.timeParse('%Y-%m-%d');

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const measurements = data.measurements.map(m => ({
    ...m,
    dateObj: parseDate(m.date),
  }));

  const systems = data.systems;

  // X scale: time
  const xDomain = [parseDate(data.period.start), parseDate(data.period.end)];
  const x = d3.scaleTime().domain(xDomain).range([0, innerW]);

  // Horizontal axis line
  g.append('line')
    .attr('x1', 0).attr('x2', innerW)
    .attr('y1', innerH / 2).attr('y2', innerH / 2)
    .attr('stroke', getCSSVar('--text-secondary'))
    .attr('stroke-width', 1)
    .attr('opacity', 0.3);

  // Vertical year markers
  [2024, 2025, 2026].forEach(year => {
    const xPos = x(new Date(year, 0, 1));
    if (xPos > 0 && xPos < innerW) {
      g.append('line')
        .attr('x1', xPos).attr('x2', xPos)
        .attr('y1', 0).attr('y2', innerH)
        .attr('stroke', getCSSVar('--text-secondary'))
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.2);
    }
  });

  // X axis
  const formatMonth = d3.timeFormat('%b %y');
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(d3.timeMonth.every(3)).tickFormat(formatMonth))
    .selectAll('text')
    .style('font-size', '8px');

  // System lanes: spread dots vertically by system
  const laneY = { AVL: innerH / 2 - 18, OBD: innerH / 2, AUTEL: innerH / 2 + 18 };

  // Dots
  measurements.forEach(m => {
    const cx = x(m.dateObj);
    const cy = laneY[m.system] + (m.offset_y ? 12 : 0);
    const color = systems[m.system].color;

    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 5)
      .attr('fill', color)
      .attr('stroke', 'rgba(0,0,0,0.3)')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseenter', (event) => {
        d3.select(event.target).transition().duration(150).attr('r', 8);
        const label = en ? m.label_en : m.label;
        let html = `<div class="tooltip-method">${label}</div>`;
        html += `<div class="tooltip-value">${m.date}</div>`;
        if (m.km) html += `<div class="tooltip-value">${m.km.toLocaleString('de-DE')} km</div>`;
        if (m.soh != null) html += `<div class="tooltip-value">SOH: ${m.soh} %</div>`;
        if (m.temp != null) html += `<div class="tooltip-value">${m.temp} °C</div>`;
        showTooltip(tip, html, event, container);
      })
      .on('mouseleave', (event) => {
        d3.select(event.target).transition().duration(150).attr('r', 5);
        hideTooltip(tip);
      });
  });

  // Legend — below chart as HTML
  const legend = document.createElement('div');
  legend.className = 'chart-legend';
  legend.style.marginTop = '4px';
  Object.entries(systems).forEach(([, sys]) => {
    const item = document.createElement('span');
    item.className = 'chart-legend-item';
    item.innerHTML = `<span class="chart-legend-swatch" style="background:${sys.color}"></span>${sys.label} (n=${sys.count})`;
    legend.appendChild(item);
  });
  container.appendChild(legend);
}

// ── Init ─────────────────────────────────────────────────────────────

export async function initCharts() {
  // Fetch all data in parallel
  const [methodsData, reproData, tempData, resistData, avlTimelineData, communityData, chargingData, vehicleTimelineData] = await Promise.all([
    fetch('/assets/data/soh-methods.json').then(r => r.json()),
    fetch('/assets/data/reproducibility.json').then(r => r.json()),
    fetch('/assets/data/temperature-comparison.json').then(r => r.json()),
    fetch('/assets/data/resistance.json').then(r => r.json()),
    fetch('/assets/data/avl-timeline.json').then(r => r.json()),
    fetch('/assets/data/community-comparison.json').then(r => r.json()),
    fetch('/assets/data/charging-profile.json').then(r => r.json()),
    fetch('/assets/data/vehicle-timeline.json').then(r => r.json()),
  ]);

  const charts = [
    { id: 'chart-method-comparison', render: renderMethodComparison, data: methodsData },
    { id: 'chart-reproducibility', render: renderReproducibility, data: reproData },
    { id: 'chart-temperature', render: renderTemperature, data: tempData },
    { id: 'chart-resistance', render: renderResistance, data: resistData },
    { id: 'chart-avl-timeline', render: renderAVLTimeline, data: avlTimelineData },
    { id: 'chart-community', render: renderCommunityComparison, data: communityData },
    { id: 'chart-charging-profile', render: renderChargingProfile, data: chargingData },
    { id: 'chart-vehicle-timeline', render: renderVehicleTimeline, data: vehicleTimelineData },
    { id: 'chart-convergence', render: renderConvergenceFlow, data: null },
  ];

  // Initial render
  charts.forEach(({ id, render, data }) => {
    const container = document.getElementById(id);
    if (container) render(container, data);
  });

  // Re-render on language toggle
  const observer = new MutationObserver(() => {
    charts.forEach(({ id, render, data }) => {
      const container = document.getElementById(id);
      if (container) render(container, data);
    });
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}
