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

  const width = 900;
  const height = 480;
  const margin = { top: 30, right: 80, bottom: 40, left: 240 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const accent = getCSSVar('--accent');
  const chartBlue = getCSSVar('--chart-blue');

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3.scaleLinear().domain([85, 102]).range([0, innerW]);
  const y = d3.scaleBand()
    .domain(data.methods.map(d => en ? d.method_en : d.method))
    .range([0, innerH])
    .padding(0.3);

  // Grid lines
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisBottom(x).tickSize(innerH).tickFormat('').ticks(6))
    .attr('transform', 'translate(0,0)');

  // X axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d} %`));

  // Y axis
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll('text')
    .style('font-size', '14px')
    .style('fill', getCSSVar('--text-primary'));

  // Remove y-axis line
  g.select('.axis .domain').remove();

  // Reference line (AVL)
  const refX = x(data.reference.soh);
  g.append('line')
    .attr('class', 'reference-line')
    .attr('x1', refX).attr('x2', refX)
    .attr('y1', -10).attr('y2', innerH + 5);

  g.append('text')
    .attr('class', 'reference-label')
    .attr('x', refX)
    .attr('y', -15)
    .attr('text-anchor', 'middle')
    .text(`AVL: ${data.reference.soh} %`);

  // Bars
  g.selectAll('.bar')
    .data(data.methods)
    .join('rect')
    .attr('class', 'bar')
    .attr('y', d => y(en ? d.method_en : d.method))
    .attr('x', x(85))
    .attr('width', d => x(d.soh) - x(85))
    .attr('height', y.bandwidth())
    .attr('rx', 4)
    .attr('fill', d => d.method.includes('kombiniert') ? accent : chartBlue)
    .on('mousemove', (event, d) => {
      const method = en ? d.method_en : d.method;
      const note = en ? d.note_en : d.note;
      showTooltip(tip, `
        <div class="tooltip-method">${method}</div>
        <div class="tooltip-value">SOH: ${d.soh.toFixed(1)} %</div>
        <div class="tooltip-delta">${d.delta > 0 ? '+' : ''}${d.delta.toFixed(1)} Pp ${en ? 'vs. reference' : 'vs. Referenz'}</div>
        <div class="tooltip-note">${note}</div>
      `, event, container);
    })
    .on('mouseleave', () => hideTooltip(tip));

  // Value + delta labels
  data.methods.forEach(d => {
    const barY = y(en ? d.method_en : d.method) + y.bandwidth() / 2;
    const barEnd = x(d.soh);

    // SOH value
    g.append('text')
      .attr('class', 'bar-value')
      .attr('x', barEnd + 6)
      .attr('y', barY - 3)
      .attr('dominant-baseline', 'middle')
      .text(`${d.soh.toFixed(1)} %`);

    // Delta
    const deltaClass = d.method.includes('kombiniert') ? 'best' : (d.delta >= 0 ? 'positive' : 'negative');
    g.append('text')
      .attr('class', `delta-label ${deltaClass}`)
      .attr('x', barEnd + 6)
      .attr('y', barY + 14)
      .attr('dominant-baseline', 'middle')
      .text(`${d.delta > 0 ? '+' : ''}${d.delta.toFixed(1)} Pp`);
  });
}

// ── Chart 2: Reproducibility (Slide 13) ──────────────────────────────

function renderReproducibility(container, data) {
  container.innerHTML = '';
  const tip = ensureTooltip(container);

  const width = 700;
  const height = 480;
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const chartBlue = getCSSVar('--chart-blue');
  const chartYellow = getCSSVar('--chart-yellow');
  const accent = getCSSVar('--accent');

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const runs = data.algorithmic.runs;
  const methods = ['soh_e', 'soh_c', 'combined'];
  const methodLabels = en
    ? ['SOH_e', 'SOH_c', 'Combined']
    : ['SOH_e', 'SOH_c', 'Kombiniert'];
  const methodColors = [chartBlue, chartYellow, accent];

  // Scales
  const x0 = d3.scaleBand()
    .domain(runs.map((_, i) => `${en ? 'Run' : 'Lauf'} ${i + 1}`))
    .range([0, innerW])
    .padding(0.3);

  const x1 = d3.scaleBand()
    .domain(methods)
    .range([0, x0.bandwidth()])
    .padding(0.08);

  const y = d3.scaleLinear().domain([88, 102]).range([innerH, 0]);

  // Grid
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-innerW).tickFormat('').ticks(7));

  // Axes
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x0).tickSize(0))
    .selectAll('text')
    .style('font-size', '14px')
    .style('fill', getCSSVar('--text-primary'));

  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).ticks(7).tickFormat(d => `${d} %`));

  // Bars
  runs.forEach((run, runIdx) => {
    const groupLabel = `${en ? 'Run' : 'Lauf'} ${runIdx + 1}`;
    methods.forEach((method, mIdx) => {
      const val = run[method];
      g.append('rect')
        .attr('class', 'bar')
        .attr('x', x0(groupLabel) + x1(method))
        .attr('y', y(val))
        .attr('width', x1.bandwidth())
        .attr('height', innerH - y(val))
        .attr('rx', 3)
        .attr('fill', methodColors[mIdx])
        .on('mousemove', (event) => {
          showTooltip(tip, `
            <div class="tooltip-method">${methodLabels[mIdx]}</div>
            <div class="tooltip-value">${val.toFixed(1)} %</div>
            <div class="tooltip-note">${groupLabel}</div>
          `, event, container);
        })
        .on('mouseleave', () => hideTooltip(tip));

      // Value on top
      g.append('text')
        .attr('class', 'bar-value')
        .attr('x', x0(groupLabel) + x1(method) + x1.bandwidth() / 2)
        .attr('y', y(val) - 6)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(`${val.toFixed(1)}`);
    });
  });

  // Spread annotation
  const success = getCSSVar('--success');
  g.append('text')
    .attr('class', 'annotation-badge')
    .attr('x', innerW / 2)
    .attr('y', -12)
    .attr('text-anchor', 'middle')
    .attr('fill', success)
    .text(`${en ? 'Spread' : 'Streuung'}: ${data.algorithmic.spread_pp} Pp — ${en ? data.algorithmic.rating_en : data.algorithmic.rating}`);

  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.className = 'chart-legend';
  methodLabels.forEach((label, i) => {
    const item = document.createElement('span');
    item.className = 'chart-legend-item';
    item.innerHTML = `<span class="chart-legend-swatch" style="background:${methodColors[i]}"></span>${label}`;
    legendDiv.appendChild(item);
  });
  container.appendChild(legendDiv);
}

// ── Chart 3: Temperature Effect (Slide 14) ───────────────────────────

function renderTemperature(container, data) {
  container.innerHTML = '';
  const tip = ensureTooltip(container);

  const width = 900;
  const height = 480;
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const chartBlue = getCSSVar('--chart-blue');
  const chartYellow = getCSSVar('--chart-yellow');
  const accent = getCSSVar('--accent');

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const sessions = data.sessions;
  const methods = ['soh_e', 'soh_c', 'combined'];
  const methodLabels = en
    ? ['SOH_e', 'SOH_c', 'Combined']
    : ['SOH_e', 'SOH_c', 'Kombiniert'];
  const methodColors = [chartBlue, chartYellow, accent];

  // Scales
  const x0 = d3.scaleBand()
    .domain(sessions.map(s => en ? s.label_en : s.label))
    .range([0, innerW])
    .padding(0.3);

  const x1 = d3.scaleBand()
    .domain(methods)
    .range([0, x0.bandwidth()])
    .padding(0.08);

  const y = d3.scaleLinear().domain([88, 103]).range([innerH, 0]);

  // Grid
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-innerW).tickFormat('').ticks(6));

  // Axes
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x0).tickSize(0))
    .selectAll('text')
    .style('font-size', '15px')
    .style('fill', getCSSVar('--text-primary'));

  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).ticks(6).tickFormat(d => `${d} %`));

  // Bars
  sessions.forEach(session => {
    const groupLabel = en ? session.label_en : session.label;
    methods.forEach((method, mIdx) => {
      const val = session[method];
      g.append('rect')
        .attr('class', 'bar')
        .attr('x', x0(groupLabel) + x1(method))
        .attr('y', y(val))
        .attr('width', x1.bandwidth())
        .attr('height', innerH - y(val))
        .attr('rx', 3)
        .attr('fill', methodColors[mIdx])
        .on('mousemove', (event) => {
          showTooltip(tip, `
            <div class="tooltip-method">${methodLabels[mIdx]} @ ${groupLabel}</div>
            <div class="tooltip-value">${val.toFixed(1)} %</div>
          `, event, container);
        })
        .on('mouseleave', () => hideTooltip(tip));

      // Value on top
      g.append('text')
        .attr('class', 'bar-value')
        .attr('x', x0(groupLabel) + x1(method) + x1.bandwidth() / 2)
        .attr('y', y(val) - 6)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .text(`${val.toFixed(1)}`);
    });
  });

  // Delta annotations between temperature groups
  const deltas = [
    { method: 'soh_e', delta: '+1,2', delta_en: '+1.2' },
    { method: 'soh_c', delta: '−1,3', delta_en: '−1.3' },
    { method: 'combined', delta: '−0,1', delta_en: '−0.1' },
  ];

  const group1 = en ? sessions[0].label_en : sessions[0].label;
  const group2 = en ? sessions[1].label_en : sessions[1].label;

  deltas.forEach((d, i) => {
    const x1Pos = x0(group1) + x1(d.method) + x1.bandwidth() / 2;
    const x2Pos = x0(group2) + x1(d.method) + x1.bandwidth() / 2;
    const midX = (x1Pos + x2Pos) / 2;
    const topY = y(103) + 5;

    // Delta text
    const deltaText = en ? d.delta_en : d.delta;
    const color = d.method === 'combined' ? accent : getCSSVar('--text-secondary');
    g.append('text')
      .attr('x', midX)
      .attr('y', topY)
      .attr('text-anchor', 'middle')
      .attr('fill', color)
      .attr('font-size', d.method === 'combined' ? '14px' : '12px')
      .attr('font-weight', d.method === 'combined' ? '700' : '600')
      .text(`${deltaText} Pp`);
  });

  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.className = 'chart-legend';
  methodLabels.forEach((label, i) => {
    const item = document.createElement('span');
    item.className = 'chart-legend-item';
    item.innerHTML = `<span class="chart-legend-swatch" style="background:${methodColors[i]}"></span>${label}`;
    legendDiv.appendChild(item);
  });
  container.appendChild(legendDiv);
}

// ── Chart 4: Resistance Comparison (Slide 15) ────────────────────────

function renderResistance(container, data) {
  container.innerHTML = '';
  const tip = ensureTooltip(container);

  const width = 600;
  const height = 480;
  const margin = { top: 30, right: 30, bottom: 60, left: 70 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const en = isEnglish();
  const success = getCSSVar('--success');
  const warning = getCSSVar('--warning');

  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const vehicles = data.vehicles;
  const barData = [
    { label: 'VW ID.4', sublabel: en ? 'Charging' : 'Laden', value: vehicles[0].r_charge_mohm, color: success },
    { label: 'VW ID.4', sublabel: en ? 'Discharging' : 'Entladen', value: vehicles[0].r_discharge_mohm, color: d3.color(success).darker(0.5).formatHex() },
  ];

  // Scales
  const x = d3.scaleBand()
    .domain(barData.map(d => `${d.label}\n${d.sublabel}`))
    .range([0, innerW])
    .padding(0.35);

  const y = d3.scaleLinear().domain([0, 60]).range([innerH, 0]);

  // Grid
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-innerW).tickFormat('').ticks(6));

  // Y axis
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).ticks(6).tickFormat(d => `${d} mΩ`));

  // X axis labels (custom — two-line)
  barData.forEach(d => {
    const xPos = x(`${d.label}\n${d.sublabel}`) + x.bandwidth() / 2;
    g.append('text')
      .attr('x', xPos)
      .attr('y', innerH + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', getCSSVar('--text-primary'))
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(d.label);
    g.append('text')
      .attr('x', xPos)
      .attr('y', innerH + 38)
      .attr('text-anchor', 'middle')
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('font-size', '12px')
      .text(`(${d.sublabel})`);
  });

  // Bars
  barData.forEach(d => {
    const key = `${d.label}\n${d.sublabel}`;
    g.append('rect')
      .attr('class', 'bar')
      .attr('x', x(key))
      .attr('y', y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', innerH - y(d.value))
      .attr('rx', 4)
      .attr('fill', d.color)
      .on('mousemove', (event) => {
        const note = en ? vehicles[0].note_en : vehicles[0].note;
        showTooltip(tip, `
          <div class="tooltip-method">${d.label} — ${d.sublabel}</div>
          <div class="tooltip-value">R<sub>i</sub>: ${d.value} mΩ</div>
          <div class="tooltip-note">${note}</div>
        `, event, container);
      })
      .on('mouseleave', () => hideTooltip(tip));

    // Value on top
    g.append('text')
      .attr('class', 'bar-value')
      .attr('x', x(key) + x.bandwidth() / 2)
      .attr('y', y(d.value) - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .text(`${d.value} mΩ`);
  });
}

// ── Init ─────────────────────────────────────────────────────────────

export async function initCharts() {
  // Fetch all data in parallel
  const [methodsData, reproData, tempData, resistData] = await Promise.all([
    fetch('/assets/data/soh-methods.json').then(r => r.json()),
    fetch('/assets/data/reproducibility.json').then(r => r.json()),
    fetch('/assets/data/temperature-comparison.json').then(r => r.json()),
    fetch('/assets/data/resistance.json').then(r => r.json()),
  ]);

  const charts = [
    { id: 'chart-method-comparison', render: renderMethodComparison, data: methodsData },
    { id: 'chart-reproducibility', render: renderReproducibility, data: reproData },
    { id: 'chart-temperature', render: renderTemperature, data: tempData },
    { id: 'chart-resistance', render: renderResistance, data: resistData },
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
