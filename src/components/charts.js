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

// ── Init ─────────────────────────────────────────────────────────────

export async function initCharts() {
  // Fetch all data in parallel
  const [methodsData, reproData, tempData, resistData, avlTimelineData, communityData] = await Promise.all([
    fetch('/assets/data/soh-methods.json').then(r => r.json()),
    fetch('/assets/data/reproducibility.json').then(r => r.json()),
    fetch('/assets/data/temperature-comparison.json').then(r => r.json()),
    fetch('/assets/data/resistance.json').then(r => r.json()),
    fetch('/assets/data/avl-timeline.json').then(r => r.json()),
    fetch('/assets/data/community-comparison.json').then(r => r.json()),
  ]);

  const charts = [
    { id: 'chart-method-comparison', render: renderMethodComparison, data: methodsData },
    { id: 'chart-reproducibility', render: renderReproducibility, data: reproData },
    { id: 'chart-temperature', render: renderTemperature, data: tempData },
    { id: 'chart-resistance', render: renderResistance, data: resistData },
    { id: 'chart-avl-timeline', render: renderAVLTimeline, data: avlTimelineData },
    { id: 'chart-community', render: renderCommunityComparison, data: communityData },
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
