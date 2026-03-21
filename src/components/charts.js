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

  // Line connecting points
  const line = d3.line()
    .x(d => x(d.dateObj))
    .y(d => y(d.soh));

  g.append('path')
    .datum(points)
    .attr('fill', 'none')
    .attr('stroke', success)
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.5)
    .attr('d', line);

  // Data points
  g.selectAll('.point')
    .data(points)
    .join('circle')
    .attr('class', 'point')
    .attr('cx', d => x(d.dateObj))
    .attr('cy', d => y(d.soh))
    .attr('r', 7)
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

  // Value labels on points
  points.forEach((d, i) => {
    // Offset duplicate Apr 2025 points vertically
    const yOff = (i === 2 && points[3] && points[3].soh === d.soh) ? -16 : (i === 3 ? 20 : -14);
    g.append('text')
      .attr('x', x(d.dateObj))
      .attr('y', y(d.soh) + yOff)
      .attr('text-anchor', 'middle')
      .attr('fill', getCSSVar('--text-primary'))
      .attr('font-size', '11px')
      .attr('font-weight', '600')
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
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisBottom(x).tickSize(innerH).tickFormat('').ticks(8))
    .attr('transform', 'translate(0,0)');

  // X axis
  g.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(8).tickFormat(d => `${d} %`));

  // Y axis labels
  g.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll('text')
    .style('font-size', '14px')
    .style('fill', getCSSVar('--text-primary'));

  g.select('.axis .domain').remove();

  // Range bars (min to max)
  datasets.forEach(d => {
    const label = en ? d.name_en : d.name;
    const barY = y(label);
    const barH = y.bandwidth();

    // Full range bar (light)
    g.append('rect')
      .attr('x', x(d.min))
      .attr('y', barY)
      .attr('width', x(d.max) - x(d.min))
      .attr('height', barH)
      .attr('rx', barH / 2)
      .attr('fill', chartBlue)
      .attr('opacity', 0.2);

    // Mean marker
    g.append('line')
      .attr('x1', x(d.mean)).attr('x2', x(d.mean))
      .attr('y1', barY - 4).attr('y2', barY + barH + 4)
      .attr('stroke', chartBlue)
      .attr('stroke-width', 2.5);

    // Mean label
    g.append('text')
      .attr('x', x(d.mean))
      .attr('y', barY - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', chartBlue)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text(`μ = ${d.mean} %`);

    // Min/max labels
    g.append('text')
      .attr('x', x(d.min) - 4)
      .attr('y', barY + barH / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('font-size', '10px')
      .text(`${d.min}`);

    g.append('text')
      .attr('x', x(d.max) + 4)
      .attr('y', barY + barH / 2)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'middle')
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('font-size', '10px')
      .text(`${d.max}`);

    // n label
    g.append('text')
      .attr('x', x(d.mean))
      .attr('y', barY + barH + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', getCSSVar('--text-secondary'))
      .attr('font-size', '10px')
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
        .attr('d', `M${cx},${cy - size} L${cx + size},${cy} L${cx},${cy + size} L${cx - size},${cy} Z`)
        .attr('fill', own.label.includes('FP') ? getCSSVar('--warning') : accent)
        .attr('stroke', getCSSVar('--bg-surface'))
        .attr('stroke-width', 1.5)
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
  legendDiv.className = 'chart-legend';
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

// ── Init ─────────────────────────────────────────────────────────────

export async function initCharts() {
  // Fetch all data in parallel
  const [methodsData, reproData, tempData, resistData, avlTimelineData, communityData, chargingData] = await Promise.all([
    fetch('/assets/data/soh-methods.json').then(r => r.json()),
    fetch('/assets/data/reproducibility.json').then(r => r.json()),
    fetch('/assets/data/temperature-comparison.json').then(r => r.json()),
    fetch('/assets/data/resistance.json').then(r => r.json()),
    fetch('/assets/data/avl-timeline.json').then(r => r.json()),
    fetch('/assets/data/community-comparison.json').then(r => r.json()),
    fetch('/assets/data/charging-profile.json').then(r => r.json()),
  ]);

  const charts = [
    { id: 'chart-method-comparison', render: renderMethodComparison, data: methodsData },
    { id: 'chart-reproducibility', render: renderReproducibility, data: reproData },
    { id: 'chart-temperature', render: renderTemperature, data: tempData },
    { id: 'chart-resistance', render: renderResistance, data: resistData },
    { id: 'chart-avl-timeline', render: renderAVLTimeline, data: avlTimelineData },
    { id: 'chart-community', render: renderCommunityComparison, data: communityData },
    { id: 'chart-charging-profile', render: renderChargingProfile, data: chargingData },
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
