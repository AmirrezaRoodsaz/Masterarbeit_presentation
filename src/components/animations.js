/**
 * GSAP Animations — pipeline build animation (slide 11) + fragment enhancements.
 */
import gsap from 'gsap';
import { getSettings } from './settings-store.js';

// Prevent GSAP from fast-forwarding animations when the window regains focus
// (e.g. after clicking on the speaker view popup and back)
gsap.ticker.lagSmoothing(500, 33);

// Speaker view iframes load with ?receiver — always disable animations there
const isSpeakerViewIframe = /[?&]receiver\b/.test(window.location.search);

function animationsEnabled() {
  if (isSpeakerViewIframe) return false;
  return getSettings().display.animationsEnabled !== false;
}

// ── Pipeline Animation (Slide 11) ────────────────────────────────────

const PIPELINE_ELEMENTS = [
  '#pipeline-raw',
  '#pipeline-arrow-1',
  '#method-sohe', '#method-sohc', '#method-cap',
  '#method-sohr', '#method-ica', '#method-dva',
  '#pipeline-arrow-2',
  '#pipeline-combined',
];

let pipelineTL = null;

function buildPipelineTimeline() {
  const tl = gsap.timeline({ paused: true });

  // Set initial state — all hidden
  gsap.set(PIPELINE_ELEMENTS, { opacity: 0, scale: 0.85 });
  gsap.set('#pipeline-combined .pipeline-result', { opacity: 0 });

  // 1. Input node fades in
  tl.to('#pipeline-raw', {
    opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out',
  }, 0);

  // 2. Arrow 1
  tl.to('#pipeline-arrow-1', {
    opacity: 0.5, scale: 1, duration: 0.4, ease: 'power1.out',
  }, 0.7);

  // 3. Method nodes stagger in
  const methods = ['#method-sohe', '#method-sohc', '#method-cap', '#method-sohr', '#method-ica', '#method-dva'];
  tl.to(methods, {
    opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)',
    stagger: 0.12,
  }, 1.1);

  // 4. Arrow 2
  tl.to('#pipeline-arrow-2', {
    opacity: 0.5, scale: 1, duration: 0.4, ease: 'power1.out',
  }, 2.8);

  // 5. Output node fades in with slight scale
  tl.to('#pipeline-combined', {
    opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out',
  }, 3.2);

  // 6. Result value counter animation
  const resultEl = document.querySelector('#pipeline-combined .pipeline-result');
  if (resultEl) {
    const targetValue = 95.7;
    const counter = { val: 0 };
    tl.to('#pipeline-combined .pipeline-result', {
      opacity: 1, duration: 0.3,
    }, 3.8);
    tl.to(counter, {
      val: targetValue,
      duration: 1.5,
      ease: 'power1.out',
      snap: { val: 0.1 },
      onUpdate() {
        resultEl.textContent = `${counter.val.toFixed(1).replace('.', ',')} %`;
      },
    }, 3.9);
  }

  // 7. Subtle accent glow on output
  tl.to('#pipeline-combined', {
    boxShadow: '0 0 24px rgba(226, 0, 26, 0.35)',
    duration: 0.6,
    ease: 'power1.inOut',
  }, 5.0);

  return tl;
}

function getSlideId(slide) {
  return slide ? slide.getAttribute('id') : null;
}

// ── Fragment Enhancement ─────────────────────────────────────────────

function initFragmentAnimations(deck) {
  // Generic fragments — start hidden (exclude agenda, cycle, slide-up/right, and custom-animated charts)
  const genericFragments = document.querySelectorAll('.reveal .fragment:not(.agenda-reveal):not(.cycle-reveal):not(.slide-up):not(.slide-right):not(#chart-method-comparison):not(.repro-panel)');
  gsap.set(genericFragments, { opacity: 0, y: 20 });

  // Slide-up fragments — start below the slide
  const slideUpFragments = document.querySelectorAll('.reveal .fragment.slide-up');
  gsap.set(slideUpFragments, { opacity: 0, y: 150 });

  // Slide-right fragments — start off-screen right
  const slideRightFragments = document.querySelectorAll('.reveal .fragment.slide-right');
  gsap.set(slideRightFragments, { opacity: 0, x: 200 });

  // Agenda fragments — start dim, full color (no grayscale)
  const agendaFragments = document.querySelectorAll('.reveal .fragment.agenda-reveal');
  gsap.set(agendaFragments, { opacity: 0.15, y: 0 });

  // Cycle-reveal fragments (slide 3 pentagon) — text hidden, segments dimmed
  const cycleFragments = document.querySelectorAll('.reveal .fragment.cycle-reveal');
  cycleFragments.forEach(el => {
    if (el.classList.contains('takeaway-box')) {
      // Takeaway box — starts below the slide
      gsap.set(el, { opacity: 0, y: 150 });
    } else {
      const isLeft = el.closest('.cycle-texts-left');
      const isRight = el.closest('.cycle-texts-right');
      gsap.set(el, { opacity: 0, x: isLeft ? -30 : isRight ? 30 : 0 });
    }
  });
  // Dim all cycle segments and icons in slides with cycle-reveal fragments
  const cycleSlides = new Set();
  cycleFragments.forEach(f => { const s = f.closest('section'); if (s) cycleSlides.add(s); });
  cycleSlides.forEach(section => {
    section.querySelectorAll('.cycle-segment[data-segment]').forEach(seg => gsap.set(seg, { opacity: 0.3 }));
    section.querySelectorAll('.cycle-icon-g[data-segment]').forEach(icon => gsap.set(icon, { opacity: 0.3 }));
  });

  deck.on('fragmentshown', (event) => {
    const noAnim = !animationsEnabled();
    event.fragments.forEach(el => {
      if (el.classList.contains('agenda-reveal')) {
        agendaFragments.forEach(af => af.classList.remove('agenda-active'));
        gsap.to(el, { opacity: 1, duration: noAnim ? 0 : 0.6, ease: 'power2.out' });
        el.classList.add('agenda-active');
      } else if (el.classList.contains('cycle-reveal')) {
        if (el.classList.contains('takeaway-box')) {
          gsap.to(el, { opacity: 1, y: 0, duration: noAnim ? 0 : 0.7, ease: 'back.out(1.2)' });
          return;
        }
        gsap.to(el, { opacity: 1, x: 0, duration: noAnim ? 0 : 0.5, ease: 'power2.out' });
        const segNum = el.dataset.segment;
        if (segNum) {
          const section = el.closest('section');
          const seg = section.querySelector(`.cycle-segment[data-segment="${segNum}"]`);
          const icon = section.querySelector(`.cycle-icon-g[data-segment="${segNum}"]`);
          const color = seg ? seg.getAttribute('fill') : '#E2001A';
          if (seg) gsap.to(seg, { opacity: 1, filter: `drop-shadow(0 0 14px ${color})`, duration: noAnim ? 0 : 0.6, ease: 'power2.out' });
          if (icon) gsap.to(icon, { opacity: 1, filter: `drop-shadow(0 0 8px ${color})`, duration: noAnim ? 0 : 0.6, ease: 'power2.out' });
        }
      } else if (el.classList.contains('slide-up')) {
        gsap.to(el, { opacity: 1, y: 0, duration: noAnim ? 0 : 0.7, ease: 'back.out(1.2)' });
      } else if (el.classList.contains('slide-right')) {
        gsap.to(el, { opacity: 1, x: 0, duration: noAnim ? 0 : 0.7, ease: 'power2.out' });
      } else if (el.id === 'chart-method-comparison') {
        gsap.to(el, { opacity: 1, y: 0, duration: noAnim ? 0 : 0.3, ease: 'power2.out' });
        if (noAnim) showMethodComparisonFinal();
      } else if (el.classList.contains('repro-panel')) {
        gsap.to(el, { opacity: 1, y: 0, duration: noAnim ? 0 : 0.3, ease: 'power2.out' });
        if (noAnim) showReproMatrixFinal();
      } else {
        gsap.to(el, { opacity: 1, y: 0, duration: noAnim ? 0 : 0.45, ease: 'power2.out' });
      }
    });
  });

  deck.on('fragmenthidden', (event) => {
    const noAnim = !animationsEnabled();
    event.fragments.forEach(el => {
      if (el.classList.contains('agenda-reveal')) {
        el.classList.remove('agenda-active');
        gsap.to(el, { opacity: 0.15, duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
        const visibleItems = [...agendaFragments].filter(af => af.classList.contains('visible'));
        if (visibleItems.length > 0) visibleItems[visibleItems.length - 1].classList.add('agenda-active');
      } else if (el.classList.contains('cycle-reveal')) {
        if (el.classList.contains('takeaway-box')) {
          gsap.to(el, { opacity: 0, y: 150, duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
          return;
        }
        const isLeft = el.closest('.cycle-texts-left');
        const isRight = el.closest('.cycle-texts-right');
        gsap.to(el, { opacity: 0, x: isLeft ? -30 : isRight ? 30 : 0, duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
        const segNum = el.dataset.segment;
        if (segNum) {
          const section = el.closest('section');
          const seg = section.querySelector(`.cycle-segment[data-segment="${segNum}"]`);
          const icon = section.querySelector(`.cycle-icon-g[data-segment="${segNum}"]`);
          if (seg) gsap.to(seg, { opacity: 0.3, filter: 'none', duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
          if (icon) gsap.to(icon, { opacity: 0.3, filter: 'none', duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
        }
      } else if (el.classList.contains('slide-up')) {
        gsap.to(el, { opacity: 0, y: 150, duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
      } else if (el.classList.contains('slide-right')) {
        gsap.to(el, { opacity: 0, x: 200, duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
      } else if (el.id === 'chart-method-comparison') {
        resetMethodComparison();
        gsap.to(el, { opacity: 0, y: 20, duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
      } else if (el.classList.contains('repro-panel')) {
        resetReproMatrix();
        gsap.to(el, { opacity: 0, y: 20, duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
      } else {
        gsap.to(el, { opacity: 0, y: 20, duration: noAnim ? 0 : 0.3, ease: 'power2.in' });
      }
    });
  });
}

// ── Slide 12: Method Comparison Lollipop Animation ───────────────────

function animateMethodComparison() {
  const container = document.getElementById('chart-method-comparison');
  if (!container) return;

  const svg = container.querySelector('svg');
  if (!svg) return;

  const stems = svg.querySelectorAll('.lollipop-stem');
  const dots = svg.querySelectorAll('.lollipop-dot');
  const values = svg.querySelectorAll('.lollipop-value');
  const labels = svg.querySelectorAll('.lollipop-label');

  if (stems.length === 0) return;

  const tl = gsap.timeline();

  // 1. Fade in Y-axis labels with stagger
  tl.to(labels, {
    opacity: 1,
    duration: 0.3,
    stagger: 0.06,
    ease: 'power2.out',
  }, 0);

  // 2. Draw stems from mean outward (animate x2 from meanX to target)
  stems.forEach((stem, i) => {
    const targetX2 = parseFloat(stem.getAttribute('data-target-x2'));
    tl.to(stem, {
      attr: { x2: targetX2 },
      duration: 0.5,
      ease: 'power2.out',
    }, 0.1 + i * 0.08);
  });

  // 3. Pop dots in after stems finish
  const dotsStart = 0.1 + stems.length * 0.08 + 0.15;
  dots.forEach((dot, i) => {
    const targetR = parseFloat(dot.getAttribute('data-target-r'));
    tl.to(dot, {
      attr: { r: targetR },
      duration: 0.35,
      ease: 'back.out(2.5)',
    }, dotsStart + i * 0.06);
  });

  // 4. Fade in value labels alongside dots
  values.forEach((val, i) => {
    tl.to(val, {
      opacity: 1,
      duration: 0.25,
      ease: 'power2.out',
    }, dotsStart + i * 0.06 + 0.1);
  });

  return tl;
}

function showMethodComparisonFinal() {
  const container = document.getElementById('chart-method-comparison');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  svg.querySelectorAll('.lollipop-stem').forEach(stem => {
    stem.setAttribute('x2', stem.getAttribute('data-target-x2'));
  });
  svg.querySelectorAll('.lollipop-dot').forEach(dot => {
    dot.setAttribute('r', dot.getAttribute('data-target-r'));
  });
  svg.querySelectorAll('.lollipop-value').forEach(val => val.setAttribute('opacity', '1'));
  svg.querySelectorAll('.lollipop-label').forEach(label => label.setAttribute('opacity', '1'));
}

function resetMethodComparison() {
  const container = document.getElementById('chart-method-comparison');
  if (!container) return;

  const svg = container.querySelector('svg');
  if (!svg) return;

  const stems = svg.querySelectorAll('.lollipop-stem');
  const dots = svg.querySelectorAll('.lollipop-dot');
  const values = svg.querySelectorAll('.lollipop-value');
  const labels = svg.querySelectorAll('.lollipop-label');

  // Reset stems to zero length (x2 = x1)
  stems.forEach(stem => {
    const x1 = stem.getAttribute('x1');
    stem.setAttribute('x2', x1);
  });

  // Reset dots to r=0
  dots.forEach(dot => dot.setAttribute('r', '0'));

  // Hide values and labels
  values.forEach(val => val.setAttribute('opacity', '0'));
  labels.forEach(label => label.setAttribute('opacity', '0'));
}

// ── Slide 13: Reproducibility Matrix + AVL Timeline ─────────────────

function animateReproMatrix() {
  const container = document.getElementById('chart-reproducibility');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const tl = gsap.timeline();
  const rows = 3; // SOHe, SOHc, Kombiniert
  const cols = 3; // Run 1, 2, 3

  for (let row = 0; row < rows; row++) {
    const rowStart = row * 0.35;

    // Row label fades in
    const label = svg.querySelector(`.repro-label[data-row="${row}"]`);
    if (label) {
      tl.to(label, { opacity: 1, duration: 0.25, ease: 'power2.out' }, rowStart);
    }

    // Value cells cascade left → right
    for (let col = 0; col < cols; col++) {
      const bg = svg.querySelector(`.repro-cell-bg[data-row="${row}"][data-col="${col}"]`);
      const val = svg.querySelector(`.repro-cell-val[data-row="${row}"][data-col="${col}"]`);
      const targetOp = bg ? parseFloat(bg.getAttribute('data-target-opacity')) : 0.12;
      const cellStart = rowStart + 0.08 + col * 0.1;

      if (bg) tl.to(bg, { opacity: targetOp, duration: 0.3, ease: 'power2.out' }, cellStart);
      if (val) tl.to(val, { opacity: 1, duration: 0.25, ease: 'power2.out' }, cellStart + 0.08);
    }

    // Delta cell pops in with green glow
    const deltaBg = svg.querySelector(`.repro-delta-bg[data-row="${row}"]`);
    const deltaVal = svg.querySelector(`.repro-delta-val[data-row="${row}"]`);
    const deltaTargetOp = deltaBg ? parseFloat(deltaBg.getAttribute('data-target-opacity')) : 0.1;
    const deltaStart = rowStart + 0.08 + cols * 0.1 + 0.05;

    if (deltaBg) {
      // Pop in with brief overshoot glow
      tl.to(deltaBg, { opacity: deltaTargetOp * 2.5, duration: 0.2, ease: 'power2.out' }, deltaStart);
      tl.to(deltaBg, { opacity: deltaTargetOp, duration: 0.4, ease: 'power2.out' }, deltaStart + 0.2);
    }
    if (deltaVal) tl.to(deltaVal, { opacity: 1, duration: 0.25, ease: 'power2.out' }, deltaStart + 0.05);
  }

  // Bottom badge slides up
  const badgeBg = svg.querySelector('.repro-badge-bg');
  const badgeText = svg.querySelector('.repro-badge-text');
  const badgeStart = rows * 0.35 + 0.15;

  if (badgeBg) tl.fromTo(badgeBg, { opacity: 0, y: 10 }, { opacity: 0.12, y: 0, duration: 0.4, ease: 'back.out(1.5)' }, badgeStart);
  if (badgeText) tl.fromTo(badgeText, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' }, badgeStart + 0.08);

  return tl;
}

function resetReproMatrix() {
  const container = document.getElementById('chart-reproducibility');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  svg.querySelectorAll('.repro-label, .repro-cell-val, .repro-delta-val, .repro-badge-text').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.repro-cell-bg, .repro-delta-bg, .repro-badge-bg').forEach(el => el.setAttribute('opacity', '0'));
}

function showReproMatrixFinal() {
  const container = document.getElementById('chart-reproducibility');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  svg.querySelectorAll('.repro-label').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.repro-cell-val').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.repro-delta-val').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.repro-badge-text').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.repro-cell-bg').forEach(el => el.setAttribute('opacity', el.getAttribute('data-target-opacity')));
  svg.querySelectorAll('.repro-delta-bg').forEach(el => el.setAttribute('opacity', el.getAttribute('data-target-opacity')));
  svg.querySelectorAll('.repro-badge-bg').forEach(el => el.setAttribute('opacity', '0.12'));
}

function animateAVLTimeline() {
  const container = document.getElementById('chart-avl-timeline');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const linePath = svg.querySelector('.avl-line');
  const dots = svg.querySelectorAll('.avl-dot');
  const values = svg.querySelectorAll('.avl-value');

  if (!linePath) return;

  const tl = gsap.timeline();

  // 1. Line draws left → right
  tl.to(linePath, {
    attr: { 'stroke-dashoffset': 0 },
    duration: 1.2,
    ease: 'power2.inOut',
  }, 0);

  // 2. Dots pop in sequentially as the line reaches them
  dots.forEach((dot, i) => {
    const targetR = parseFloat(dot.getAttribute('data-target-r'));
    const dotStart = 0.2 + i * (1.0 / dots.length);
    tl.to(dot, {
      attr: { r: targetR },
      duration: 0.3,
      ease: 'back.out(2.5)',
    }, dotStart);
  });

  // 3. Value labels fade in with dots
  values.forEach((val, i) => {
    const valStart = 0.35 + i * (1.0 / values.length);
    tl.to(val, { opacity: 1, duration: 0.25, ease: 'power2.out' }, valStart);
  });

  return tl;
}

function resetAVLTimeline() {
  const container = document.getElementById('chart-avl-timeline');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const linePath = svg.querySelector('.avl-line');
  if (linePath) {
    const len = linePath.getTotalLength();
    linePath.setAttribute('stroke-dashoffset', String(len));
  }
  svg.querySelectorAll('.avl-dot').forEach(dot => dot.setAttribute('r', '0'));
  svg.querySelectorAll('.avl-value').forEach(val => val.setAttribute('opacity', '0'));
}

function showAVLTimelineFinal() {
  const container = document.getElementById('chart-avl-timeline');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const linePath = svg.querySelector('.avl-line');
  if (linePath) linePath.setAttribute('stroke-dashoffset', '0');
  svg.querySelectorAll('.avl-dot').forEach(dot => dot.setAttribute('r', dot.getAttribute('data-target-r')));
  svg.querySelectorAll('.avl-value').forEach(val => val.setAttribute('opacity', '1'));
}

// ── Slide 14: Temperature Butterfly Chart Animation ──────────────────

function animateTemperature() {
  const container = document.getElementById('chart-temperature');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const bars = svg.querySelectorAll('.temp-bar');
  const labels = svg.querySelectorAll('.temp-label');
  const deltas = svg.querySelectorAll('.temp-delta');
  const absVals = svg.querySelectorAll('.temp-abs');
  const axes = svg.querySelectorAll('.temp-axis');
  const bgs = svg.querySelectorAll('.temp-bg');
  const xAxis = svg.querySelector('.temp-x-axis');

  if (bars.length === 0) return;

  const tl = gsap.timeline();

  // 1. Fade in axis framework (zero line, labels, ticks, row backgrounds)
  tl.to(axes, { opacity: (i, el) => el.tagName === 'line' ? 0.3 : 0.6, duration: 0.4, ease: 'power2.out' }, 0);
  tl.to(bgs, { opacity: 0.04, duration: 0.3, ease: 'power2.out' }, 0);
  if (xAxis) tl.to(xAxis, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0);

  // 2. Method labels fade in with stagger
  tl.to(labels, { opacity: 1, duration: 0.35, stagger: 0.15, ease: 'power2.out' }, 0.2);

  // 3. Bars grow from zero line outward — staggered per method
  bars.forEach((bar, i) => {
    const targetX = parseFloat(bar.getAttribute('data-target-x'));
    const targetW = parseFloat(bar.getAttribute('data-target-width'));
    const targetOp = parseFloat(bar.getAttribute('data-target-opacity'));
    const barStart = 0.4 + i * 0.25;

    tl.to(bar, { opacity: targetOp, duration: 0.15, ease: 'power2.out' }, barStart);
    tl.to(bar, {
      attr: { x: targetX, width: targetW },
      duration: 0.6,
      ease: 'power2.out',
    }, barStart);
  });

  // 4. Delta values pop in after their bar
  deltas.forEach((val, i) => {
    tl.to(val, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.75 + i * 0.25);
  });

  // 5. Absolute values fade in subtly
  absVals.forEach((val, i) => {
    tl.to(val, { opacity: 0.6, duration: 0.25, ease: 'power2.out' }, 0.85 + i * 0.25);
  });

  // 6. Animate annotations panel
  const slide = document.getElementById('slide-temperature');
  if (slide) {
    const notes = slide.querySelectorAll('.temp-annotations .method-note');
    const header = slide.querySelector('.temp-annotations .method-annotations-header');
    if (header) {
      gsap.set(header, { opacity: 0, x: 20 });
      tl.to(header, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.5);
    }
    notes.forEach((note, i) => {
      gsap.set(note, { opacity: 0, x: 20 });
      tl.to(note, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 0.7 + i * 0.25);
    });
  }

  // 7. Takeaway box slides up
  if (slide) {
    const takeaway = slide.querySelector('.takeaway-box');
    if (takeaway) {
      gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
      tl.to(takeaway, { opacity: 1, y: 0, marginTop: '-20px', duration: 0.6, ease: 'back.out(1.4)' }, 1.6);
    }
  }

  return tl;
}

function resetTemperature() {
  const container = document.getElementById('chart-temperature');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  // Reset bars to zero width at zero line
  const zeroLine = svg.querySelector('line.temp-axis');
  const x0 = zeroLine ? parseFloat(zeroLine.getAttribute('x1')) : 0;
  svg.querySelectorAll('.temp-bar').forEach(bar => {
    bar.setAttribute('x', String(x0));
    bar.setAttribute('width', '0');
    bar.setAttribute('opacity', '0');
  });

  // Hide all text elements
  svg.querySelectorAll('.temp-label, .temp-delta').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.temp-abs').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.temp-axis').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.temp-bg').forEach(el => el.setAttribute('opacity', '0'));
  const xAxis = svg.querySelector('.temp-x-axis');
  if (xAxis) xAxis.setAttribute('opacity', '0');

  // Reset annotations
  const slide = document.getElementById('slide-temperature');
  if (slide) {
    const header = slide.querySelector('.temp-annotations .method-annotations-header');
    const notes = slide.querySelectorAll('.temp-annotations .method-note');
    if (header) gsap.set(header, { opacity: 0, x: 20 });
    notes.forEach(n => gsap.set(n, { opacity: 0, x: 20 }));
    const takeaway = slide.querySelector('.takeaway-box');
    if (takeaway) gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
  }
}

function showTemperatureFinal() {
  const container = document.getElementById('chart-temperature');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  // Show bars at final position
  svg.querySelectorAll('.temp-bar').forEach(bar => {
    bar.setAttribute('x', bar.getAttribute('data-target-x'));
    bar.setAttribute('width', bar.getAttribute('data-target-width'));
    bar.setAttribute('opacity', bar.getAttribute('data-target-opacity'));
  });

  // Show all text
  svg.querySelectorAll('.temp-label').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.temp-delta').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.temp-abs').forEach(el => el.setAttribute('opacity', '0.6'));
  svg.querySelectorAll('.temp-axis').forEach(el => {
    el.setAttribute('opacity', el.tagName === 'line' ? '0.3' : '0.6');
  });
  svg.querySelectorAll('.temp-bg').forEach(el => el.setAttribute('opacity', '0.04'));
  const xAxis = svg.querySelector('.temp-x-axis');
  if (xAxis) xAxis.setAttribute('opacity', '1');

  // Show annotations
  const slide = document.getElementById('slide-temperature');
  if (slide) {
    const header = slide.querySelector('.temp-annotations .method-annotations-header');
    const notes = slide.querySelectorAll('.temp-annotations .method-note');
    if (header) gsap.set(header, { opacity: 1, x: 0 });
    notes.forEach(n => gsap.set(n, { opacity: 1, x: 0 }));
    const takeaway = slide.querySelector('.takeaway-box');
    if (takeaway) gsap.set(takeaway, { opacity: 1, y: 0, marginTop: '-20px' });
  }
}

// ── Slide 15: Resistance Gauge Bar Animation ─────────────────────────

function animateResistance() {
  const container = document.getElementById('chart-resistance');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const tracks = svg.querySelectorAll('.res-track');
  const bars = svg.querySelectorAll('.res-bar');
  const labels = svg.querySelectorAll('.res-label');
  const values = svg.querySelectorAll('.res-value');
  const badgeBgs = svg.querySelectorAll('.res-badge-bg');
  const badgeTexts = svg.querySelectorAll('.res-badge-text');
  const note = svg.querySelector('.res-note');

  if (bars.length === 0) return;

  const tl = gsap.timeline();

  // 1. Labels fade in
  tl.to(labels, { opacity: 1, duration: 0.3, stagger: 0.15, ease: 'power2.out' }, 0);

  // 2. Track backgrounds appear
  tl.to(tracks, { opacity: 0.06, duration: 0.3, stagger: 0.15, ease: 'power2.out' }, 0.1);

  // 3. Bars grow from left to right
  bars.forEach((bar, i) => {
    const targetW = parseFloat(bar.getAttribute('data-target-width'));
    const barStart = 0.3 + i * 0.3;
    tl.to(bar, { opacity: 0.7, duration: 0.15, ease: 'power2.out' }, barStart);
    tl.to(bar, { attr: { width: targetW }, duration: 0.7, ease: 'power2.out' }, barStart);
  });

  // 4. Value labels slide in with their bar
  values.forEach((val, i) => {
    const targetX = parseFloat(val.getAttribute('data-target-x'));
    const valStart = 0.5 + i * 0.3;
    tl.to(val, { opacity: 1, attr: { x: targetX }, duration: 0.5, ease: 'power2.out' }, valStart);
  });

  // 5. Badges pop in with stagger
  const badgeStart = 1.1;
  tl.to(badgeBgs, { opacity: 0.08, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, badgeStart);
  tl.to(badgeTexts, { opacity: 1, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, badgeStart + 0.05);

  // 6. Note text fades in
  if (note) tl.to(note, { opacity: 0.6, duration: 0.3, ease: 'power2.out' }, badgeStart + 0.4);

  // 7. Annotations panel
  const slide = document.getElementById('slide-resistance');
  if (slide) {
    const headers = slide.querySelectorAll('.resistance-annotations .method-annotations-header');
    const notes = slide.querySelectorAll('.resistance-annotations .method-note');
    headers.forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
    notes.forEach(n => gsap.set(n, { opacity: 0, x: 20 }));

    headers.forEach((h, i) => {
      tl.to(h, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.3 + i * 0.6);
    });
    notes.forEach((n, i) => {
      tl.to(n, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.5 + i * 0.2);
    });

    // 8. Takeaway box
    const takeaway = slide.querySelector('.takeaway-box');
    if (takeaway) {
      gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
      tl.to(takeaway, { opacity: 1, y: 0, marginTop: '-20px', duration: 0.6, ease: 'back.out(1.4)' }, 1.8);
    }
  }

  return tl;
}

function resetResistance() {
  const container = document.getElementById('chart-resistance');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  svg.querySelectorAll('.res-track').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.res-bar').forEach(bar => {
    bar.setAttribute('width', '0');
    bar.setAttribute('opacity', '0');
  });
  svg.querySelectorAll('.res-label').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.res-value').forEach(val => {
    val.setAttribute('x', '12');
    val.setAttribute('opacity', '0');
  });
  svg.querySelectorAll('.res-badge-bg').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.res-badge-text').forEach(el => el.setAttribute('opacity', '0'));
  const note = svg.querySelector('.res-note');
  if (note) note.setAttribute('opacity', '0');

  const slide = document.getElementById('slide-resistance');
  if (slide) {
    slide.querySelectorAll('.resistance-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
    slide.querySelectorAll('.resistance-annotations .method-note').forEach(n => gsap.set(n, { opacity: 0, x: 20 }));
    const takeaway = slide.querySelector('.takeaway-box');
    if (takeaway) gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
  }
}

function showResistanceFinal() {
  const container = document.getElementById('chart-resistance');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  svg.querySelectorAll('.res-track').forEach(el => el.setAttribute('opacity', '0.06'));
  svg.querySelectorAll('.res-bar').forEach(bar => {
    bar.setAttribute('width', bar.getAttribute('data-target-width'));
    bar.setAttribute('opacity', '0.7');
  });
  svg.querySelectorAll('.res-label').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.res-value').forEach(val => {
    val.setAttribute('x', val.getAttribute('data-target-x'));
    val.setAttribute('opacity', '1');
  });
  svg.querySelectorAll('.res-badge-bg').forEach(el => el.setAttribute('opacity', '0.08'));
  svg.querySelectorAll('.res-badge-text').forEach(el => el.setAttribute('opacity', '1'));
  const note = svg.querySelector('.res-note');
  if (note) note.setAttribute('opacity', '0.6');

  const slide = document.getElementById('slide-resistance');
  if (slide) {
    slide.querySelectorAll('.resistance-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 1, x: 0 }));
    slide.querySelectorAll('.resistance-annotations .method-note').forEach(n => gsap.set(n, { opacity: 1, x: 0 }));
    const takeaway = slide.querySelector('.takeaway-box');
    if (takeaway) gsap.set(takeaway, { opacity: 1, y: 0, marginTop: '-20px' });
  }
}

// ── Slide: Failure Case (Fehlerfall) Animation ──────────────────────

function animateFailure() {
  const slide = document.getElementById('slide-failure');
  if (!slide) return;

  const goodCase = slide.querySelector('.failure-case.good');
  const badCase = slide.querySelector('.failure-case.bad');
  const vs = slide.querySelector('.failure-vs');
  const headers = slide.querySelectorAll('.failure-annotations .method-annotations-header');
  const notes = slide.querySelectorAll('.failure-annotations .method-note');
  const takeaway = slide.querySelector('.takeaway-box');

  const tl = gsap.timeline();

  // 1. Good case card slides in from left
  if (goodCase) {
    gsap.set(goodCase, { opacity: 0, x: -40 });
    tl.to(goodCase, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0);
  }

  // 2. "vs." pops in
  if (vs) {
    gsap.set(vs, { opacity: 0, scale: 0.5 });
    tl.to(vs, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 0.3);
  }

  // 3. Bad case card slides in from right
  if (badCase) {
    gsap.set(badCase, { opacity: 0, x: 40 });
    tl.to(badCase, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.4);
  }

  // 4. Inside each card: stagger the rows
  const goodRows = goodCase ? goodCase.querySelectorAll('.failure-row') : [];
  const goodDelta = goodCase ? goodCase.querySelector('.failure-delta') : null;
  const badRows = badCase ? badCase.querySelectorAll('.failure-row') : [];
  const badDelta = badCase ? badCase.querySelector('.failure-delta') : null;

  goodRows.forEach(r => gsap.set(r, { opacity: 0, y: 10 }));
  badRows.forEach(r => gsap.set(r, { opacity: 0, y: 10 }));
  if (goodDelta) gsap.set(goodDelta, { opacity: 0, y: 10 });
  if (badDelta) gsap.set(badDelta, { opacity: 0, y: 10 });

  tl.to(goodRows, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, 0.5);
  if (goodDelta) tl.to(goodDelta, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.8);

  tl.to(badRows, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, 0.7);
  if (badDelta) tl.to(badDelta, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 1.0);

  // 5. Annotations slide in
  headers.forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
  notes.forEach(n => gsap.set(n, { opacity: 0, x: 20 }));
  headers.forEach(h => {
    tl.to(h, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.6);
  });
  notes.forEach((n, i) => {
    tl.to(n, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.8 + i * 0.2);
  });

  // 6. Takeaway
  if (takeaway) {
    gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
    tl.to(takeaway, { opacity: 1, y: 0, marginTop: '-20px', duration: 0.6, ease: 'back.out(1.4)' }, 1.5);
  }

  return tl;
}

function resetFailure() {
  const slide = document.getElementById('slide-failure');
  if (!slide) return;

  const goodCase = slide.querySelector('.failure-case.good');
  const badCase = slide.querySelector('.failure-case.bad');
  const vs = slide.querySelector('.failure-vs');

  if (goodCase) gsap.set(goodCase, { opacity: 0, x: -40 });
  if (badCase) gsap.set(badCase, { opacity: 0, x: 40 });
  if (vs) gsap.set(vs, { opacity: 0, scale: 0.5 });

  slide.querySelectorAll('.failure-row').forEach(r => gsap.set(r, { opacity: 0, y: 10 }));
  slide.querySelectorAll('.failure-delta').forEach(d => gsap.set(d, { opacity: 0, y: 10 }));

  slide.querySelectorAll('.failure-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
  slide.querySelectorAll('.failure-annotations .method-note').forEach(n => gsap.set(n, { opacity: 0, x: 20 }));

  const takeaway = slide.querySelector('.takeaway-box');
  if (takeaway) gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
}

function showFailureFinal() {
  const slide = document.getElementById('slide-failure');
  if (!slide) return;

  const goodCase = slide.querySelector('.failure-case.good');
  const badCase = slide.querySelector('.failure-case.bad');
  const vs = slide.querySelector('.failure-vs');

  if (goodCase) gsap.set(goodCase, { opacity: 1, x: 0 });
  if (badCase) gsap.set(badCase, { opacity: 1, x: 0 });
  if (vs) gsap.set(vs, { opacity: 1, scale: 1 });

  slide.querySelectorAll('.failure-row').forEach(r => gsap.set(r, { opacity: 1, y: 0 }));
  slide.querySelectorAll('.failure-delta').forEach(d => gsap.set(d, { opacity: 1, y: 0 }));

  slide.querySelectorAll('.failure-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 1, x: 0 }));
  slide.querySelectorAll('.failure-annotations .method-note').forEach(n => gsap.set(n, { opacity: 1, x: 0 }));

  const takeaway = slide.querySelector('.takeaway-box');
  if (takeaway) gsap.set(takeaway, { opacity: 1, y: 0, marginTop: '-20px' });
}

// ── Slide: Inter-System Agreement Animation ─────────────────────────

function animateIntersystem() {
  const slide = document.getElementById('slide-intersystem');
  if (!slide) return;

  const avl = slide.querySelector('.intersystem-system.avl');
  const obd = slide.querySelector('.intersystem-system.obd');
  const bridge = slide.querySelector('.intersystem-bridge');
  const headers = slide.querySelectorAll('.intersystem-annotations .method-annotations-header');
  const notes = slide.querySelectorAll('.intersystem-annotations .method-note');
  const takeaway = slide.querySelector('.takeaway-box');

  const tl = gsap.timeline();

  // 1. AVL card slides in from left
  if (avl) {
    gsap.set(avl, { opacity: 0, x: -50 });
    tl.to(avl, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0);
  }

  // 2. OBD card slides in from right
  if (obd) {
    gsap.set(obd, { opacity: 0, x: 50 });
    tl.to(obd, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.2);
  }

  // 3. Delta bridge connects them
  if (bridge) {
    const lines = bridge.querySelectorAll('.intersystem-delta-line');
    const badge = bridge.querySelector('.intersystem-delta-badge');
    gsap.set(bridge, { opacity: 0 });
    lines.forEach(l => gsap.set(l, { scaleX: 0, transformOrigin: 'center center' }));
    if (badge) gsap.set(badge, { opacity: 0, scale: 0.5 });

    tl.to(bridge, { opacity: 1, duration: 0.1 }, 0.5);
    tl.to(lines, { scaleX: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, 0.5);
    if (badge) tl.to(badge, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.7);
  }

  // 4. Annotations slide in
  headers.forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
  notes.forEach(n => gsap.set(n, { opacity: 0, x: 20 }));
  headers.forEach(h => {
    tl.to(h, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.4);
  });
  notes.forEach((n, i) => {
    tl.to(n, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.6 + i * 0.15);
  });

  // 5. Takeaway
  if (takeaway) {
    gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
    tl.to(takeaway, { opacity: 1, y: 0, marginTop: '-20px', duration: 0.6, ease: 'back.out(1.4)' }, 1.4);
  }

  return tl;
}

function resetIntersystem() {
  const slide = document.getElementById('slide-intersystem');
  if (!slide) return;

  const avl = slide.querySelector('.intersystem-system.avl');
  const obd = slide.querySelector('.intersystem-system.obd');
  const bridge = slide.querySelector('.intersystem-bridge');

  if (avl) gsap.set(avl, { opacity: 0, x: -50 });
  if (obd) gsap.set(obd, { opacity: 0, x: 50 });
  if (bridge) {
    gsap.set(bridge, { opacity: 0 });
    bridge.querySelectorAll('.intersystem-delta-line').forEach(l => gsap.set(l, { scaleX: 0 }));
    const badge = bridge.querySelector('.intersystem-delta-badge');
    if (badge) gsap.set(badge, { opacity: 0, scale: 0.5 });
  }

  slide.querySelectorAll('.intersystem-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
  slide.querySelectorAll('.intersystem-annotations .method-note').forEach(n => gsap.set(n, { opacity: 0, x: 20 }));

  const takeaway = slide.querySelector('.takeaway-box');
  if (takeaway) gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
}

function showIntersystemFinal() {
  const slide = document.getElementById('slide-intersystem');
  if (!slide) return;

  const avl = slide.querySelector('.intersystem-system.avl');
  const obd = slide.querySelector('.intersystem-system.obd');
  const bridge = slide.querySelector('.intersystem-bridge');

  if (avl) gsap.set(avl, { opacity: 1, x: 0 });
  if (obd) gsap.set(obd, { opacity: 1, x: 0 });
  if (bridge) {
    gsap.set(bridge, { opacity: 1 });
    bridge.querySelectorAll('.intersystem-delta-line').forEach(l => gsap.set(l, { scaleX: 1 }));
    const badge = bridge.querySelector('.intersystem-delta-badge');
    if (badge) gsap.set(badge, { opacity: 1, scale: 1 });
  }

  slide.querySelectorAll('.intersystem-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 1, x: 0 }));
  slide.querySelectorAll('.intersystem-annotations .method-note').forEach(n => gsap.set(n, { opacity: 1, x: 0 }));

  const takeaway = slide.querySelector('.takeaway-box');
  if (takeaway) gsap.set(takeaway, { opacity: 1, y: 0, marginTop: '-20px' });
}

// ── Slide: ICA/DVA Analysis Animation ────────────────────────────────

function animateIcaDva() {
  const slide = document.getElementById('slide-ica-dva');
  if (!slide) return;

  const cards = slide.querySelectorAll('.ica-card');
  const headers = slide.querySelectorAll('.ica-annotations .method-annotations-header');
  const notes = slide.querySelectorAll('.ica-annotations .method-note');
  const takeaway = slide.querySelector('.takeaway-box');

  const tl = gsap.timeline();

  // 1. Cards stagger in from below
  cards.forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 30 });
    tl.to(card, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, i * 0.2);
  });

  // 2. Stat rows inside each card stagger in
  cards.forEach((card, ci) => {
    const rows = card.querySelectorAll('.ica-stat-row');
    rows.forEach((row, ri) => {
      gsap.set(row, { opacity: 0, x: -15 });
      tl.to(row, { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' }, 0.2 + ci * 0.2 + ri * 0.08);
    });
  });

  // 3. Annotations slide in
  headers.forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
  notes.forEach(n => gsap.set(n, { opacity: 0, x: 20 }));
  headers.forEach(h => {
    tl.to(h, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.3);
  });
  notes.forEach((n, i) => {
    tl.to(n, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.5 + i * 0.15);
  });

  // 4. Takeaway
  if (takeaway) {
    gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
    tl.to(takeaway, { opacity: 1, y: 0, marginTop: '-20px', duration: 0.6, ease: 'back.out(1.4)' }, 1.2);
  }

  return tl;
}

function resetIcaDva() {
  const slide = document.getElementById('slide-ica-dva');
  if (!slide) return;

  slide.querySelectorAll('.ica-card').forEach(c => gsap.set(c, { opacity: 0, y: 30 }));
  slide.querySelectorAll('.ica-stat-row').forEach(r => gsap.set(r, { opacity: 0, x: -15 }));
  slide.querySelectorAll('.ica-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
  slide.querySelectorAll('.ica-annotations .method-note').forEach(n => gsap.set(n, { opacity: 0, x: 20 }));

  const takeaway = slide.querySelector('.takeaway-box');
  if (takeaway) gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
}

function showIcaDvaFinal() {
  const slide = document.getElementById('slide-ica-dva');
  if (!slide) return;

  slide.querySelectorAll('.ica-card').forEach(c => gsap.set(c, { opacity: 1, y: 0 }));
  slide.querySelectorAll('.ica-stat-row').forEach(r => gsap.set(r, { opacity: 1, x: 0 }));
  slide.querySelectorAll('.ica-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 1, x: 0 }));
  slide.querySelectorAll('.ica-annotations .method-note').forEach(n => gsap.set(n, { opacity: 1, x: 0 }));

  const takeaway = slide.querySelector('.takeaway-box');
  if (takeaway) gsap.set(takeaway, { opacity: 1, y: 0, marginTop: '-20px' });
}

// ── Slide 24: Strengths & Limitations (Discussion) ───────────────────

function animateDiscussion() {
  const slide = document.getElementById('slide-discussion');
  if (!slide) return;

  const strengthLabel = slide.querySelector('.discussion-section-label.success');
  const limitLabel = slide.querySelector('.discussion-section-label.danger');
  const divider = slide.querySelector('.discussion-divider');
  const successRows = slide.querySelectorAll('.discussion-row.success');
  const dangerRows = slide.querySelectorAll('.discussion-row.danger');

  const tl = gsap.timeline();

  // 1. "Stärken" label
  if (strengthLabel) {
    gsap.set(strengthLabel, { opacity: 0, x: -20 });
    tl.to(strengthLabel, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0);
  }

  // 2. Strength rows stagger in — bar grows, key + desc fade in
  successRows.forEach((row, i) => {
    const bar = row.querySelector('.discussion-bar');
    gsap.set(row, { opacity: 0, x: -20 });
    tl.to(row, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.15 + i * 0.12);
  });

  // 3. Divider
  if (divider) {
    gsap.set(divider, { opacity: 0, scaleX: 0, transformOrigin: 'left center' });
    tl.to(divider, { opacity: 1, scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.65);
  }

  // 4. "Limitationen" label
  if (limitLabel) {
    gsap.set(limitLabel, { opacity: 0, x: -20 });
    tl.to(limitLabel, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.8);
  }

  // 5. Limitation rows stagger in
  dangerRows.forEach((row, i) => {
    gsap.set(row, { opacity: 0, x: -20 });
    tl.to(row, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.9 + i * 0.12);
  });

  return tl;
}

function resetDiscussion() {
  const slide = document.getElementById('slide-discussion');
  if (!slide) return;

  const labels = slide.querySelectorAll('.discussion-section-label');
  const rows = slide.querySelectorAll('.discussion-row');
  const divider = slide.querySelector('.discussion-divider');

  labels.forEach(l => gsap.set(l, { opacity: 0, x: -20 }));
  rows.forEach(r => gsap.set(r, { opacity: 0, x: -20 }));
  if (divider) gsap.set(divider, { opacity: 0, scaleX: 0 });
}

function showDiscussionFinal() {
  const slide = document.getElementById('slide-discussion');
  if (!slide) return;

  slide.querySelectorAll('.discussion-section-label').forEach(l => gsap.set(l, { opacity: 1, x: 0 }));
  slide.querySelectorAll('.discussion-row').forEach(r => gsap.set(r, { opacity: 1, x: 0 }));
  const divider = slide.querySelector('.discussion-divider');
  if (divider) gsap.set(divider, { opacity: 1, scaleX: 1 });
}

// ── Slide 25: Uncertainty Budget ─────────────────────────────────────

function animateUncertainty() {
  const slide = document.getElementById('slide-uncertainty');
  if (!slide) return;

  const equation = slide.querySelector('.equation-block');
  const rows = slide.querySelectorAll('.uncertainty-row');
  const headers = slide.querySelectorAll('.uncertainty-annotations .method-annotations-header');
  const notes = slide.querySelectorAll('.uncertainty-annotations .method-note');

  const tl = gsap.timeline();

  // 1. Equation block fades in
  if (equation) {
    gsap.set(equation, { opacity: 0, y: -15 });
    tl.to(equation, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0);
  }

  // 2. Uncertainty bars grow from left — staggered, largest first (already in DOM order)
  rows.forEach((row, i) => {
    const bar = row.querySelector('.uncertainty-bar');
    const label = row.querySelector('.uncertainty-label');
    const value = row.querySelector('.uncertainty-value');
    const desc = row.querySelector('.uncertainty-desc');

    gsap.set(row, { opacity: 0 });
    if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });

    const rowStart = 0.4 + i * 0.2;
    tl.to(row, { opacity: 1, duration: 0.2, ease: 'power2.out' }, rowStart);
    if (bar) tl.to(bar, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, rowStart + 0.05);
  });

  // 3. Annotations
  headers.forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
  notes.forEach(n => gsap.set(n, { opacity: 0, x: 20 }));
  headers.forEach(h => {
    tl.to(h, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.3);
  });
  notes.forEach((n, i) => {
    tl.to(n, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.5 + i * 0.15);
  });

  return tl;
}

function resetUncertainty() {
  const slide = document.getElementById('slide-uncertainty');
  if (!slide) return;

  const equation = slide.querySelector('.equation-block');
  if (equation) gsap.set(equation, { opacity: 0, y: -15 });

  slide.querySelectorAll('.uncertainty-row').forEach(row => {
    gsap.set(row, { opacity: 0 });
    const bar = row.querySelector('.uncertainty-bar');
    if (bar) gsap.set(bar, { scaleX: 0 });
  });

  slide.querySelectorAll('.uncertainty-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
  slide.querySelectorAll('.uncertainty-annotations .method-note').forEach(n => gsap.set(n, { opacity: 0, x: 20 }));
}

function showUncertaintyFinal() {
  const slide = document.getElementById('slide-uncertainty');
  if (!slide) return;

  const equation = slide.querySelector('.equation-block');
  if (equation) gsap.set(equation, { opacity: 1, y: 0 });

  slide.querySelectorAll('.uncertainty-row').forEach(row => {
    gsap.set(row, { opacity: 1 });
    const bar = row.querySelector('.uncertainty-bar');
    if (bar) gsap.set(bar, { scaleX: 1 });
  });

  slide.querySelectorAll('.uncertainty-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 1, x: 0 }));
  slide.querySelectorAll('.uncertainty-annotations .method-note').forEach(n => gsap.set(n, { opacity: 1, x: 0 }));
}

// ── Slide 27: Kernaussage (Conclusion) ───────────────────────────────

function animateConclusion() {
  const slide = document.getElementById('slide-conclusion');
  if (!slide) return;

  const claim = slide.querySelector('.core-claim');
  const statCards = slide.querySelectorAll('.stat-card');

  const tl = gsap.timeline();

  // 1. Core claim text fades in and scales up slightly
  if (claim) {
    gsap.set(claim, { opacity: 0, y: 20, scale: 0.97 });
    tl.to(claim, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }, 0);
  }

  // 2. Stat cards pop in with stagger
  statCards.forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 30, scale: 0.9 });
    tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 0.6 + i * 0.2);
  });

  return tl;
}

function resetConclusion() {
  const slide = document.getElementById('slide-conclusion');
  if (!slide) return;

  const claim = slide.querySelector('.core-claim');
  if (claim) gsap.set(claim, { opacity: 0, y: 20, scale: 0.97 });

  slide.querySelectorAll('.stat-card').forEach(c => gsap.set(c, { opacity: 0, y: 30, scale: 0.9 }));
}

function showConclusionFinal() {
  const slide = document.getElementById('slide-conclusion');
  if (!slide) return;

  const claim = slide.querySelector('.core-claim');
  if (claim) gsap.set(claim, { opacity: 1, y: 0, scale: 1 });

  slide.querySelectorAll('.stat-card').forEach(c => gsap.set(c, { opacity: 1, y: 0, scale: 1 }));
}

// ── Slide 28: Ausblick (Applications & Future Work) ──────────────────

function animateOutlook() {
  const slide = document.getElementById('slide-outlook');
  if (!slide) return;

  const h3s = slide.querySelectorAll('h3');
  const appItems = slide.querySelectorAll('.application-item');
  const listItems = slide.querySelectorAll('.styled-list li');
  const sticker = slide.querySelector('.slide-sticker');

  const tl = gsap.timeline();

  // 1. "Praxisanwendungen" heading
  if (h3s[0]) {
    gsap.set(h3s[0], { opacity: 0, x: -20 });
    tl.to(h3s[0], { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0);
  }

  // 2. Application items stagger in
  appItems.forEach((item, i) => {
    gsap.set(item, { opacity: 0, y: 20 });
    tl.to(item, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.15 + i * 0.12);
  });

  // 3. "Zukünftige Forschung" heading
  if (h3s[1]) {
    gsap.set(h3s[1], { opacity: 0, x: -20 });
    tl.to(h3s[1], { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.7);
  }

  // 4. Future research list items stagger in
  listItems.forEach((li, i) => {
    gsap.set(li, { opacity: 0, x: -15 });
    tl.to(li, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 0.85 + i * 0.1);
  });

  // 5. Sticker fades in
  if (sticker) {
    gsap.set(sticker, { opacity: 0, scale: 0.8, rotate: -5 });
    tl.to(sticker, { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.5)' }, 0.5);
  }

  return tl;
}

function resetOutlook() {
  const slide = document.getElementById('slide-outlook');
  if (!slide) return;

  slide.querySelectorAll('h3').forEach(h => gsap.set(h, { opacity: 0, x: -20 }));
  slide.querySelectorAll('.application-item').forEach(item => gsap.set(item, { opacity: 0, y: 20 }));
  slide.querySelectorAll('.styled-list li').forEach(li => gsap.set(li, { opacity: 0, x: -15 }));

  const sticker = slide.querySelector('.slide-sticker');
  if (sticker) gsap.set(sticker, { opacity: 0, scale: 0.8, rotate: -5 });
}

function showOutlookFinal() {
  const slide = document.getElementById('slide-outlook');
  if (!slide) return;

  slide.querySelectorAll('h3').forEach(h => gsap.set(h, { opacity: 1, x: 0 }));
  slide.querySelectorAll('.application-item').forEach(item => gsap.set(item, { opacity: 1, y: 0 }));
  slide.querySelectorAll('.styled-list li').forEach(li => gsap.set(li, { opacity: 1, x: 0 }));

  const sticker = slide.querySelector('.slide-sticker');
  if (sticker) gsap.set(sticker, { opacity: 1, scale: 1, rotate: 0 });
}

// ── Slide 18: Community Dataset Comparison Animation ─────────────────

function animateCommunity() {
  const container = document.getElementById('chart-community');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const grid = svg.querySelector('.comm-grid');
  const xAxis = svg.querySelector('.comm-x-axis');
  const yAxis = svg.querySelector('.comm-y-axis');
  const ranges = svg.querySelectorAll('.comm-range');
  const means = svg.querySelectorAll('.comm-mean');
  const meanLabels = svg.querySelectorAll('.comm-mean-label');
  const minmaxes = svg.querySelectorAll('.comm-minmax');
  const ns = svg.querySelectorAll('.comm-n');
  const diamonds = svg.querySelectorAll('.comm-diamond');
  const legend = container.querySelector('.comm-legend');

  if (ranges.length === 0) return;

  const tl = gsap.timeline();

  // 1. Axes fade in
  if (grid) tl.to(grid, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0);
  if (xAxis) tl.to(xAxis, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0);
  if (yAxis) tl.to(yAxis, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.1);

  // 2. Mean markers appear first (vertical lines)
  tl.to(means, { opacity: 1, duration: 0.3, stagger: 0.2, ease: 'power2.out' }, 0.3);
  tl.to(meanLabels, { opacity: 1, duration: 0.3, stagger: 0.2, ease: 'power2.out' }, 0.4);

  // 3. Range bars expand from mean outward
  ranges.forEach((bar, i) => {
    const targetX = parseFloat(bar.getAttribute('data-target-x'));
    const targetW = parseFloat(bar.getAttribute('data-target-width'));
    const rangeStart = 0.5 + i * 0.25;
    tl.to(bar, { opacity: 0.2, duration: 0.15, ease: 'power2.out' }, rangeStart);
    tl.to(bar, { attr: { x: targetX, width: targetW }, duration: 0.6, ease: 'power2.out' }, rangeStart);
  });

  // 4. Min/max and n labels
  tl.to(minmaxes, { opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, 1.0);
  tl.to(ns, { opacity: 1, duration: 0.3, stagger: 0.15, ease: 'power2.out' }, 1.1);

  // 5. Diamond markers pop in with scale
  diamonds.forEach((d, i) => {
    gsap.set(d, { scale: 0, transformOrigin: 'center center' });
    tl.to(d, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.5)' }, 1.4 + i * 0.08);
  });

  // 6. Legend fades in
  if (legend) tl.to(legend, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 1.6);

  // 7. Annotations panel
  const slide = document.getElementById('slide-community');
  if (slide) {
    const headers = slide.querySelectorAll('.community-annotations .method-annotations-header');
    const notes = slide.querySelectorAll('.community-annotations .method-note');
    headers.forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
    notes.forEach(n => gsap.set(n, { opacity: 0, x: 20 }));

    headers.forEach((h, i) => {
      tl.to(h, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.3);
    });
    notes.forEach((n, i) => {
      tl.to(n, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, 0.5 + i * 0.15);
    });

    // 8. Takeaway
    const takeaway = slide.querySelector('.takeaway-box');
    if (takeaway) {
      gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
      tl.to(takeaway, { opacity: 1, y: 0, marginTop: '-20px', duration: 0.6, ease: 'back.out(1.4)' }, 2.0);
    }
  }

  return tl;
}

function resetCommunity() {
  const container = document.getElementById('chart-community');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const grid = svg.querySelector('.comm-grid');
  const xAxis = svg.querySelector('.comm-x-axis');
  const yAxis = svg.querySelector('.comm-y-axis');
  if (grid) grid.setAttribute('opacity', '0');
  if (xAxis) xAxis.setAttribute('opacity', '0');
  if (yAxis) yAxis.setAttribute('opacity', '0');

  svg.querySelectorAll('.comm-range').forEach(bar => {
    const meanX = parseFloat(bar.getAttribute('x'));
    bar.setAttribute('width', '0');
    bar.setAttribute('opacity', '0');
  });
  svg.querySelectorAll('.comm-mean').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.comm-mean-label').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.comm-minmax').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.comm-n').forEach(el => el.setAttribute('opacity', '0'));
  svg.querySelectorAll('.comm-diamond').forEach(el => {
    el.setAttribute('opacity', '0');
    gsap.set(el, { scale: 0 });
  });

  const legend = container.querySelector('.comm-legend');
  if (legend) legend.style.opacity = '0';

  const slide = document.getElementById('slide-community');
  if (slide) {
    slide.querySelectorAll('.community-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 0, x: 20 }));
    slide.querySelectorAll('.community-annotations .method-note').forEach(n => gsap.set(n, { opacity: 0, x: 20 }));
    const takeaway = slide.querySelector('.takeaway-box');
    if (takeaway) gsap.set(takeaway, { opacity: 0, y: 80, marginTop: '0px' });
  }
}

function showCommunityFinal() {
  const container = document.getElementById('chart-community');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  const grid = svg.querySelector('.comm-grid');
  const xAxis = svg.querySelector('.comm-x-axis');
  const yAxis = svg.querySelector('.comm-y-axis');
  if (grid) grid.setAttribute('opacity', '1');
  if (xAxis) xAxis.setAttribute('opacity', '1');
  if (yAxis) yAxis.setAttribute('opacity', '1');

  svg.querySelectorAll('.comm-range').forEach(bar => {
    bar.setAttribute('x', bar.getAttribute('data-target-x'));
    bar.setAttribute('width', bar.getAttribute('data-target-width'));
    bar.setAttribute('opacity', '0.2');
  });
  svg.querySelectorAll('.comm-mean').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.comm-mean-label').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.comm-minmax').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.comm-n').forEach(el => el.setAttribute('opacity', '1'));
  svg.querySelectorAll('.comm-diamond').forEach(el => {
    el.setAttribute('opacity', '1');
    gsap.set(el, { scale: 1 });
  });

  const legend = container.querySelector('.comm-legend');
  if (legend) legend.style.opacity = '1';

  const slide = document.getElementById('slide-community');
  if (slide) {
    slide.querySelectorAll('.community-annotations .method-annotations-header').forEach(h => gsap.set(h, { opacity: 1, x: 0 }));
    slide.querySelectorAll('.community-annotations .method-note').forEach(n => gsap.set(n, { opacity: 1, x: 0 }));
    const takeaway = slide.querySelector('.takeaway-box');
    if (takeaway) gsap.set(takeaway, { opacity: 1, y: 0, marginTop: '-20px' });
  }
}

// ── Convergence Flow Electron Animation (slide-pipeline) ────────────

let convergenceElectronTL = null;
let electronElements = []; // track created SVG elements for cleanup

function buildConvergenceElectronAnimation() {
  const container = document.getElementById('chart-convergence');
  if (!container) return null;
  const svg = container.querySelector('svg');
  if (!svg) return null;

  // Clean up previous electrons
  cleanupElectrons();

  const pathsIn = svg.querySelectorAll('.conv-path-in');
  const pathsOut = svg.querySelectorAll('.conv-path-out');
  const pathMerge = svg.querySelector('.conv-path-merge');
  const pathAvl = svg.querySelector('.conv-path-avl');
  const methodNodes = svg.querySelectorAll('.conv-method');
  const outputNode = svg.querySelector('.conv-output');
  const avlOutputNode = svg.querySelector('.conv-avl-output');

  if (pathsIn.length === 0) return null;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

  // Helper: create an electron circle on the SVG
  function createElectron(color, r = 5) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('r', String(r));
    el.setAttribute('fill', color);
    el.setAttribute('opacity', '0');
    el.setAttribute('filter', 'url(#electron-glow)');
    svg.appendChild(el);
    electronElements.push(el);
    return el;
  }

  // Helper: animate an electron along a path
  function animateAlongPath(timeline, electron, pathEl, duration, startTime, opts = {}) {
    const len = pathEl.getTotalLength();
    const progress = { t: 0 };

    // Fade in at start
    timeline.fromTo(electron, { opacity: 0 }, { opacity: 1, duration: 0.1 }, startTime);

    // Move along path (fromTo ensures t resets to 0 on loop)
    timeline.fromTo(progress, { t: 0 }, {
      t: 1,
      duration,
      ease: opts.ease || 'power1.inOut',
      onUpdate() {
        const pt = pathEl.getPointAtLength(progress.t * len);
        electron.setAttribute('cx', String(pt.x));
        electron.setAttribute('cy', String(pt.y));
      },
    }, startTime);

    // Fade out at end
    timeline.to(electron, { opacity: 0, duration: 0.15 }, startTime + duration - 0.15);
  }

  // Helper: pulse a node's background
  function pulseNode(timeline, node, startTime) {
    const bg = node.querySelector('.conv-node-bg');
    if (!bg) return;
    const origStroke = bg.getAttribute('stroke-width');
    timeline.to(bg, {
      attr: { 'stroke-width': 3.5 },
      filter: 'url(#electron-glow)',
      duration: 0.25,
      ease: 'power2.out',
    }, startTime);
    timeline.to(bg, {
      attr: { 'stroke-width': parseFloat(origStroke) },
      filter: 'none',
      duration: 0.5,
      ease: 'power2.inOut',
    }, startTime + 0.25);
  }

  // ── Phase 1: OBD → methods (staggered, one by one) ──
  const inDuration = 0.6;
  const inStagger = 0.25;

  pathsIn.forEach((pathEl, i) => {
    const color = pathEl.getAttribute('data-color') || '#4C9AFF';
    const electron = createElectron(color);
    const t0 = i * inStagger;

    animateAlongPath(tl, electron, pathEl, inDuration, t0);

    // Pulse method node when electron arrives
    const methodNode = methodNodes[i];
    if (methodNode) {
      pulseNode(tl, methodNode, t0 + inDuration - 0.2);
    }
  });

  // ── Phase 2: All methods → merge → output (simultaneous) ──
  const phase2Start = pathsIn.length * inStagger + inDuration + 0.15;
  const outDuration = 0.7;

  pathsOut.forEach((pathEl, i) => {
    const color = pathEl.getAttribute('data-color') || '#E2001A';
    const electron = createElectron(color);
    animateAlongPath(tl, electron, pathEl, outDuration, phase2Start);
  });

  // Merge → output
  if (pathMerge) {
    const mergeElectron = createElectron('#E2001A', 6);
    const mergeStart = phase2Start + outDuration - 0.1;
    animateAlongPath(tl, mergeElectron, pathMerge, 0.5, mergeStart);

    // Pulse output node
    if (outputNode) {
      pulseNode(tl, outputNode, mergeStart + 0.35);
    }
  }

  // ── Phase 3: AVL HV-Check → AVL Referenz (runs in parallel with phase 1) ──
  if (pathAvl) {
    const avlColor = pathAvl.getAttribute('data-color') || '#00C9A7';
    const avlElectron = createElectron(avlColor, 5);
    const avlStart = 0.3; // slight delay after OBD starts
    animateAlongPath(tl, avlElectron, pathAvl, 1.2, avlStart);

    if (avlOutputNode) {
      pulseNode(tl, avlOutputNode, avlStart + 1.0);
    }
  }

  return tl;
}

function cleanupElectrons() {
  electronElements.forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
  electronElements = [];
}

function stopConvergenceElectrons() {
  if (convergenceElectronTL) {
    convergenceElectronTL.kill();
    convergenceElectronTL = null;
  }
  cleanupElectrons();
}

// ── Init ─────────────────────────────────────────────────────────────

export function initAnimations(deck) {
  // Build pipeline timeline (but don't play yet)
  const pipelineContainer = document.getElementById('gsap-pipeline');
  if (pipelineContainer) {
    pipelineTL = buildPipelineTimeline();

    // Play when entering slide 11, reset when leaving
    deck.on('slidechanged', (event) => {
      const currentId = getSlideId(event.currentSlide);
      const prevId = getSlideId(event.previousSlide);

      if (currentId === 'slide-pipeline') {
        if (animationsEnabled()) {
          pipelineTL.restart();
          stopConvergenceElectrons();
          setTimeout(() => {
            convergenceElectronTL = buildConvergenceElectronAnimation();
          }, 5500);
        } else {
          pipelineTL.progress(1);
        }
      } else if (prevId === 'slide-pipeline') {
        pipelineTL.pause(0);
        stopConvergenceElectrons();
      }
    });

    // If we're already on the pipeline slide at load time
    const currentSlide = deck.getCurrentSlide();
    if (getSlideId(currentSlide) === 'slide-pipeline') {
      pipelineTL.play();
      // Start electrons after pipeline build
      setTimeout(() => {
        convergenceElectronTL = buildConvergenceElectronAnimation();
      }, 5500);
    }
  }

  // Slide 12 method comparison — animate lollipop chart when fragment is shown
  deck.on('fragmentshown', (event) => {
    event.fragments.forEach(el => {
      if (el.id === 'chart-method-comparison') {
        if (animationsEnabled()) animateMethodComparison();
        else showMethodComparisonFinal();
      }
    });
  });

  deck.on('fragmenthidden', (event) => {
    event.fragments.forEach(el => {
      if (el.id === 'chart-method-comparison') {
        resetMethodComparison();
      }
    });
  });

  // Also handle navigating into slide 12 when fragments are already visible (backward nav)
  deck.on('slidechanged', (event) => {
    const currentId = getSlideId(event.currentSlide);
    if (currentId === 'slide-method-comparison') {
      const chartEl = document.getElementById('chart-method-comparison');
      if (chartEl && chartEl.classList.contains('visible')) {
        // Already visible from backward nav — show final state instantly
        const svg = chartEl.querySelector('svg');
        if (svg) {
          svg.querySelectorAll('.lollipop-stem').forEach(stem => {
            stem.setAttribute('x2', stem.getAttribute('data-target-x2'));
          });
          svg.querySelectorAll('.lollipop-dot').forEach(dot => {
            dot.setAttribute('r', dot.getAttribute('data-target-r'));
          });
          svg.querySelectorAll('.lollipop-value').forEach(val => {
            val.setAttribute('opacity', '1');
          });
          svg.querySelectorAll('.lollipop-label').forEach(label => {
            label.setAttribute('opacity', '1');
          });
        }
      } else {
        // Forward nav — ensure reset state
        resetMethodComparison();
      }
    }
  });

  // Slide 13 reproducibility — animate matrix when fragment shown + AVL timeline on slide entry
  deck.on('fragmentshown', (event) => {
    event.fragments.forEach(el => {
      if (el.classList.contains('repro-panel') && el.closest('#slide-reproducibility')) {
        if (animationsEnabled()) animateReproMatrix();
        else showReproMatrixFinal();
      }
    });
  });

  deck.on('fragmenthidden', (event) => {
    event.fragments.forEach(el => {
      if (el.classList.contains('repro-panel') && el.closest('#slide-reproducibility')) {
        resetReproMatrix();
      }
    });
  });

  // AVL timeline animates on slide entry, resets on leave
  deck.on('slidechanged', (event) => {
    const currentId = getSlideId(event.currentSlide);
    const prevId = getSlideId(event.previousSlide);

    if (currentId === 'slide-reproducibility') {
      if (animationsEnabled()) animateAVLTimeline();
      else showAVLTimelineFinal();

      const reproPanel = event.currentSlide.querySelector('.repro-panel.fragment');
      if (reproPanel && reproPanel.classList.contains('visible')) {
        showReproMatrixFinal();
      } else {
        resetReproMatrix();
      }
    } else if (prevId === 'slide-reproducibility') {
      // Reset both when leaving
      resetReproMatrix();
      resetAVLTimeline();
    }
  });

  // Slide 14 temperature — animate butterfly chart on entry, reset on leave
  deck.on('slidechanged', (event) => {
    const currentId = getSlideId(event.currentSlide);
    const prevId = getSlideId(event.previousSlide);

    if (currentId === 'slide-temperature') {
      setTimeout(() => animationsEnabled() ? animateTemperature() : showTemperatureFinal(), 50);
    } else if (prevId === 'slide-temperature') {
      resetTemperature();
    }

    if (currentId === 'slide-resistance') {
      setTimeout(() => animationsEnabled() ? animateResistance() : showResistanceFinal(), 50);
    } else if (prevId === 'slide-resistance') {
      resetResistance();
    }

    if (currentId === 'slide-community') {
      setTimeout(() => animationsEnabled() ? animateCommunity() : showCommunityFinal(), 50);
    } else if (prevId === 'slide-community') {
      resetCommunity();
    }

    if (currentId === 'slide-failure') {
      animationsEnabled() ? animateFailure() : showFailureFinal();
    } else if (prevId === 'slide-failure') {
      resetFailure();
    }

    if (currentId === 'slide-intersystem') {
      animationsEnabled() ? animateIntersystem() : showIntersystemFinal();
    } else if (prevId === 'slide-intersystem') {
      resetIntersystem();
    }

    if (currentId === 'slide-ica-dva') {
      animationsEnabled() ? animateIcaDva() : showIcaDvaFinal();
    } else if (prevId === 'slide-ica-dva') {
      resetIcaDva();
    }

    if (currentId === 'slide-discussion') {
      animationsEnabled() ? animateDiscussion() : showDiscussionFinal();
    } else if (prevId === 'slide-discussion') {
      resetDiscussion();
    }

    if (currentId === 'slide-uncertainty') {
      animationsEnabled() ? animateUncertainty() : showUncertaintyFinal();
    } else if (prevId === 'slide-uncertainty') {
      resetUncertainty();
    }

    if (currentId === 'slide-conclusion') {
      animationsEnabled() ? animateConclusion() : showConclusionFinal();
    } else if (prevId === 'slide-conclusion') {
      resetConclusion();
    }

    if (currentId === 'slide-outlook') {
      animationsEnabled() ? animateOutlook() : showOutlookFinal();
    } else if (prevId === 'slide-outlook') {
      resetOutlook();
    }
  });

  // Auto-trigger first fragment on slide entry (no blank slides)
  // Skip in receiver iframes — their fragment events would sync back to the main window
  if (!isSpeakerViewIframe) {
    deck.on('slidechanged', (event) => {
      const slide = event.currentSlide;
      if (!slide) return;
      // Only auto-trigger on forward navigation (no visible fragments yet)
      const visibleFrags = slide.querySelectorAll('.fragment.visible');
      const allFrags = slide.querySelectorAll('.fragment');
      if (allFrags.length > 0 && visibleFrags.length === 0) {
        // Small delay so slide transition finishes first
        setTimeout(() => deck.nextFragment(), 300);
      }
    });
  }

  // Trip computer — show step tip text on hover AND on fragment click (slides 10 & 11)
  function initTripComputer(slideId, displayId) {
    const display = document.getElementById(displayId);
    if (!display) return;
    let scrollTimer = null;
    let activeStep = null;

    function showText(tipEl) {
      if (!tipEl) return;
      const isEn = document.body.classList.contains('lang-en');
      const langSpan = tipEl.querySelector(isEn ? '.lang-en' : '.lang-de') || tipEl;
      const text = langSpan.textContent.trim();
      display.innerHTML =
        `<div style="font-size:${text.length > 60 ? '0.85' : '1'}em;color:#2a3020;line-height:1.1;">${text}</div>`;
      clearTimeout(scrollTimer);
      requestAnimationFrame(() => {
        if (display.scrollHeight > display.clientHeight) {
          const overflow = display.scrollHeight - display.clientHeight;
          display.style.overflowY = 'auto';
          display.scrollTop = 0;
          scrollTimer = setTimeout(() => {
            display.style.scrollBehavior = 'smooth';
            display.scrollTop = overflow;
          }, 600);
        }
      });
    }

    function clearText() {
      clearTimeout(scrollTimer);
      display.style.scrollBehavior = '';
      display.style.overflowY = '';
      display.scrollTop = 0;
      display.innerHTML = '';
    }

    // Hover
    document.querySelectorAll(`#${slideId} .dash-step-label`).forEach(label => {
      const tip = label.querySelector('.dash-step-tip');
      if (!tip) return;
      label.addEventListener('mouseenter', () => showText(tip));
      label.addEventListener('mouseleave', () => {
        if (activeStep) showText(activeStep);
        else clearText();
      });
    });

    // Fragment click
    deck.on('fragmentshown', (event) => {
      const el = event.fragment;
      if (!el.classList.contains('dash-step-label')) return;
      if (!el.closest(`#${slideId}`)) return;
      const tip = el.querySelector('.dash-step-tip');
      activeStep = tip;
      showText(tip);
    });

    deck.on('fragmenthidden', (event) => {
      const el = event.fragment;
      if (!el.classList.contains('dash-step-label')) return;
      if (!el.closest(`#${slideId}`)) return;
      const prev = el.previousElementSibling;
      if (prev && prev.classList.contains('dash-step-label') && prev.classList.contains('visible')) {
        activeStep = prev.querySelector('.dash-step-tip');
        showText(activeStep);
      } else {
        activeStep = null;
        clearText();
      }
    });
  }

  initTripComputer('slide-discharge', 'trip-display');
  initTripComputer('slide-charging', 'trip-display-charging');

  // Discharge gauge animation — needle, SOC, warning lights sync with step fragments
  const gaugeNeedle = document.getElementById('gauge-needle');
  const socFill = document.getElementById('soc-gauge-fill');
  const socText = document.getElementById('soc-gauge-text');
  const warnBattery = document.querySelector('#slide-discharge .warn-battery');

  if (gaugeNeedle && socFill && socText) {
    // Initial state + per-step targets (user-specified angles)
    const INITIAL = { angle: 225, soc: 95, offset: 158 };
    const STEPS = [
      { angle: 279, soc: 72, offset: 280 },  // Click 1: Ausgangszustand — 225→279
      { angle: 333, soc: 45, offset: 422 },  // Click 2: Normale Fahrt — 279→333
      { angle: 387, soc: 10, offset: 607 },  // Click 3: Batterie-Warnung — 333→387
      { angle: 441, soc: 3,  offset: 644 },  // Click 4: Dokumentation — 387→441, yellow
      { angle: 495, soc: 0,  offset: 660 },  // Click 5: Messbereit — 441→495, red
    ];

    const gaugeState = { angle: INITIAL.angle, soc: INITIAL.soc };

    function animateGaugeTo(step, duration = 0.8) {
      const s = STEPS[step];
      const d = animationsEnabled() ? duration : 0;
      gsap.killTweensOf(gaugeState);
      gsap.to(gaugeState, {
        angle: s.angle,
        soc: s.soc,
        duration: d,
        ease: 'power2.inOut',
        onUpdate: () => {
          gaugeNeedle.setAttribute('transform', `rotate(${gaugeState.angle} 180 180)`);
          socText.textContent = Math.round(gaugeState.soc);
        }
      });
      gsap.to(socFill, {
        attr: { 'stroke-dashoffset': s.offset },
        duration: d,
        ease: 'power2.inOut'
      });
      if (warnBattery) {
        const wd = animationsEnabled() ? 0.3 : 0;
        if (step >= 4) {
          gsap.to(warnBattery, { opacity: 1, color: '#ef4444', duration: wd });
        } else if (step >= 3) {
          gsap.to(warnBattery, { opacity: 1, color: '#f59e0b', duration: wd });
        } else {
          gsap.to(warnBattery, { opacity: 0.55, color: '#4a6a20', duration: wd });
        }
      }
    }

    function resetGauge() {
      gaugeState.angle = INITIAL.angle;
      gaugeState.soc = INITIAL.soc;
      gaugeNeedle.setAttribute('transform', `rotate(${INITIAL.angle} 180 180)`);
      socFill.setAttribute('stroke-dashoffset', String(INITIAL.offset));
      socText.textContent = String(Math.round(INITIAL.soc));
      if (warnBattery) { warnBattery.style.opacity = '0.55'; warnBattery.style.color = '#4a6a20'; }
    }

    deck.on('fragmentshown', (event) => {
      const el = event.fragment;
      if (!el.classList.contains('dash-step-label')) return;
      if (!el.closest('#slide-discharge')) return;
      const idx = parseInt(el.getAttribute('data-fragment-index')) - 1;
      if (idx >= 0 && idx < STEPS.length) animateGaugeTo(idx);
    });

    deck.on('fragmenthidden', (event) => {
      const el = event.fragment;
      if (!el.classList.contains('dash-step-label')) return;
      if (!el.closest('#slide-discharge')) return;
      const idx = parseInt(el.getAttribute('data-fragment-index')) - 2;
      if (idx >= 0) {
        animateGaugeTo(idx);
      } else {
        const d = animationsEnabled() ? 0.4 : 0;
        gsap.to(gaugeState, {
          angle: INITIAL.angle, soc: INITIAL.soc, duration: d, ease: 'power2.inOut',
          onUpdate: () => {
            gaugeNeedle.setAttribute('transform', `rotate(${gaugeState.angle} 180 180)`);
            socText.textContent = Math.round(gaugeState.soc);
          }
        });
        gsap.to(socFill, { attr: { 'stroke-dashoffset': INITIAL.offset }, duration: d, ease: 'power2.inOut' });
        if (warnBattery) gsap.to(warnBattery, { opacity: 0.55, color: '#4a6a20', duration: d });
      }
    });

    deck.on('slidechanged', (event) => {
      if (event.currentSlide.id !== 'slide-discharge') return;
      const visible = event.currentSlide.querySelectorAll('.dash-step-label.fragment.visible');
      if (visible.length > 0) {
        const lastIdx = parseInt(visible[visible.length - 1].getAttribute('data-fragment-index')) - 1;
        animateGaugeTo(lastIdx, 0);
      } else {
        resetGauge();
      }
    });
  }

  // Slide 11 (Charging) — gauge animation, SOC goes UP
  const chargingNeedle = document.getElementById('gauge-needle-charging');
  const chargingSlide = document.getElementById('slide-charging');
  if (chargingNeedle && chargingSlide) {
    const CH_INITIAL = { angle: 225, soc: 0, offset: 660 };
    const CH_STEPS = [
      { angle: 279, soc: 5,   offset: 634 },  // Click 1: Vorbereitung
      { angle: 333, soc: 20,  offset: 554 },  // Click 2: OBD Verbindung
      { angle: 387, soc: 60,  offset: 343 },  // Click 3: Ladevorgang
      { angle: 441, soc: 90,  offset: 185 },  // Click 4: Datenexport
      { angle: 495, soc: 100, offset: 132 },  // Click 5: Analyse
    ];
    const chState = { angle: CH_INITIAL.angle, soc: CH_INITIAL.soc };

    // Find SOC elements inside slide-charging (no IDs to avoid conflicts with slide 10)
    const chSocFill = chargingSlide.querySelector('.soc-gauge-fill');
    const chSocText = chargingSlide.querySelector('.dash-gauge text[font-size="56"]');

    function animateChargingTo(step, duration = 0.8) {
      const s = CH_STEPS[step];
      const d = animationsEnabled() ? duration : 0;
      gsap.killTweensOf(chState);
      gsap.to(chState, {
        angle: s.angle,
        soc: s.soc,
        duration: d,
        ease: 'power2.inOut',
        onUpdate: () => {
          chargingNeedle.setAttribute('transform', `rotate(${chState.angle} 180 180)`);
          if (chSocText) chSocText.textContent = Math.round(chState.soc);
        }
      });
      if (chSocFill) {
        gsap.to(chSocFill, {
          attr: { 'stroke-dashoffset': s.offset },
          duration: d,
          ease: 'power2.inOut'
        });
      }
    }

    function resetCharging() {
      chState.angle = CH_INITIAL.angle;
      chState.soc = CH_INITIAL.soc;
      chargingNeedle.setAttribute('transform', `rotate(${CH_INITIAL.angle} 180 180)`);
      if (chSocFill) chSocFill.setAttribute('stroke-dashoffset', String(CH_INITIAL.offset));
      if (chSocText) chSocText.textContent = String(Math.round(CH_INITIAL.soc));
    }

    deck.on('fragmentshown', (event) => {
      const el = event.fragment;
      if (!el.classList.contains('dash-step-label')) return;
      if (!el.closest('#slide-charging')) return;
      const idx = parseInt(el.getAttribute('data-fragment-index')) - 1;
      if (idx >= 0 && idx < CH_STEPS.length) animateChargingTo(idx);
    });

    deck.on('fragmenthidden', (event) => {
      const el = event.fragment;
      if (!el.classList.contains('dash-step-label')) return;
      if (!el.closest('#slide-charging')) return;
      const idx = parseInt(el.getAttribute('data-fragment-index')) - 2;
      if (idx >= 0) {
        animateChargingTo(idx);
      } else {
        const d = animationsEnabled() ? 0.4 : 0;
        gsap.to(chState, {
          angle: CH_INITIAL.angle, soc: CH_INITIAL.soc, duration: d, ease: 'power2.inOut',
          onUpdate: () => {
            chargingNeedle.setAttribute('transform', `rotate(${chState.angle} 180 180)`);
            if (chSocText) chSocText.textContent = Math.round(chState.soc);
          }
        });
        if (chSocFill) gsap.to(chSocFill, { attr: { 'stroke-dashoffset': CH_INITIAL.offset }, duration: d, ease: 'power2.inOut' });
      }
    });

    deck.on('slidechanged', (event) => {
      if (event.currentSlide.id !== 'slide-charging') return;
      const visible = event.currentSlide.querySelectorAll('.dash-step-label.fragment.visible');
      if (visible.length > 0) {
        const lastIdx = parseInt(visible[visible.length - 1].getAttribute('data-fragment-index')) - 1;
        animateChargingTo(lastIdx, 0);
      } else {
        resetCharging();
      }
    });
  }

  // Sync cycle-reveal slides on entry (handles both forward and backward navigation)
  deck.on('slidechanged', (event) => {
    const current = event.currentSlide;
    if (!current.querySelector('.fragment.cycle-reveal')) return;

    const visibleFrags = current.querySelectorAll('.fragment.cycle-reveal.visible');

    // Dim all segments and icons first
    current.querySelectorAll('.cycle-segment[data-segment]').forEach(seg => {
      gsap.set(seg, { opacity: 0.3, filter: 'none' });
    });
    current.querySelectorAll('.cycle-icon-g[data-segment]').forEach(icon => {
      gsap.set(icon, { opacity: 0.3, filter: 'none' });
    });

    if (visibleFrags.length === 0) {
      // Forward navigation — hide all text blocks
      current.querySelectorAll('.fragment.cycle-reveal').forEach(el => {
        if (el.classList.contains('takeaway-box')) {
          gsap.set(el, { opacity: 0, y: 150 });
        } else {
          const isLeft = el.closest('.cycle-texts-left');
          const isRight = el.closest('.cycle-texts-right');
          gsap.set(el, { opacity: 0, x: isLeft ? -30 : isRight ? 30 : 0 });
        }
      });
    } else {
      // Backward navigation — show visible fragments, light up their segments
      visibleFrags.forEach(el => {
        if (el.classList.contains('takeaway-box')) {
          gsap.set(el, { opacity: 1, y: 0 });
        } else {
          gsap.set(el, { opacity: 1, x: 0 });
        }
        const segNum = el.dataset.segment;
        if (segNum) {
          const seg = current.querySelector(`.cycle-segment[data-segment="${segNum}"]`);
          const icon = current.querySelector(`.cycle-icon-g[data-segment="${segNum}"]`);
          const color = seg ? seg.getAttribute('fill') : '#E2001A';
          if (seg) gsap.set(seg, { opacity: 1, filter: `drop-shadow(0 0 14px ${color})` });
          if (icon) gsap.set(icon, { opacity: 1, filter: `drop-shadow(0 0 8px ${color})` });
        }
      });
      // Hide non-visible fragments
      current.querySelectorAll('.fragment.cycle-reveal:not(.visible)').forEach(el => {
        if (el.classList.contains('takeaway-box')) {
          gsap.set(el, { opacity: 0, y: 150 });
        } else {
          const isLeft = el.closest('.cycle-texts-left');
          const isRight = el.closest('.cycle-texts-right');
          gsap.set(el, { opacity: 0, x: isLeft ? -30 : isRight ? 30 : 0 });
        }
      });
    }
  });

  // Sync generic / slide-up / slide-right fragments on slide entry (backward navigation)
  deck.on('slidechanged', (event) => {
    const current = event.currentSlide;

    // Generic fragments (exclude cycle-reveal and agenda-reveal — handled separately)
    current.querySelectorAll('.fragment:not(.agenda-reveal):not(.cycle-reveal):not(.slide-up):not(.slide-right)').forEach(el => {
      if (el.classList.contains('visible')) {
        gsap.set(el, { opacity: 1, y: 0 });
      } else {
        gsap.set(el, { opacity: 0, y: 20 });
      }
    });

    // Slide-up fragments
    current.querySelectorAll('.fragment.slide-up').forEach(el => {
      if (el.classList.contains('visible')) {
        gsap.set(el, { opacity: 1, y: 0 });
      } else {
        gsap.set(el, { opacity: 0, y: 150 });
      }
    });

    // Slide-right fragments
    current.querySelectorAll('.fragment.slide-right').forEach(el => {
      if (el.classList.contains('visible')) {
        gsap.set(el, { opacity: 1, x: 0 });
      } else {
        gsap.set(el, { opacity: 0, x: 200 });
      }
    });
  });

  // ── Animations ON/OFF toggle ──────────────────────────────────────────

  function showAllFinalStates() {
    // Show slide-specific animation final states for ALL slides
    if (pipelineTL) pipelineTL.progress(1);
    showMethodComparisonFinal();
    showReproMatrixFinal();
    showAVLTimelineFinal();
    showTemperatureFinal();
    showResistanceFinal();
    showCommunityFinal();
    showFailureFinal();
    showIntersystemFinal();
    showIcaDvaFinal();
    showDiscussionFinal();
    showUncertaintyFinal();
    showConclusionFinal();
    showOutlookFinal();

    // Discharge gauge → final step 5 (SOC 0%, needle at 495°)
    const gn = document.getElementById('gauge-needle');
    if (gn) gn.setAttribute('transform', 'rotate(495 180 180)');
    const sf = document.getElementById('soc-gauge-fill');
    if (sf) sf.setAttribute('stroke-dashoffset', '660');
    const st = document.getElementById('soc-gauge-text');
    if (st) st.textContent = '0';
    const wb = document.querySelector('#slide-discharge .warn-battery');
    if (wb) { wb.style.opacity = '1'; wb.style.color = '#ef4444'; }

    // Charging gauge → final step 5 (SOC 100%, needle at 495°)
    const cn = document.getElementById('gauge-needle-charging');
    if (cn) cn.setAttribute('transform', 'rotate(495 180 180)');
    const csf = document.querySelector('#slide-charging .soc-gauge-fill');
    if (csf) csf.setAttribute('stroke-dashoffset', '132');
    const cst = document.querySelector('#slide-charging .dash-gauge text[font-size="56"]');
    if (cst) cst.textContent = '100';
  }

  function disableAnimations() {
    // 1. Disable Reveal.js fragment stepping — all content visible immediately
    deck.configure({ fragments: false });

    // 2. Kill all running GSAP tweens
    gsap.globalTimeline.clear();
    stopConvergenceElectrons();

    // 3. Rebuild pipeline timeline (cleared above)
    if (document.getElementById('gsap-pipeline')) {
      pipelineTL = buildPipelineTimeline();
    }

    // 4. Set all fragments to visible (don't use clearProps — it wipes inline
    //    CSS custom properties like --i and --step-color used for gauge positioning)
    document.querySelectorAll('.reveal .fragment').forEach(el => {
      gsap.set(el, { opacity: 1, y: 0, x: 0 });
    });

    // 5. Restore cycle segments/icons to full visibility
    document.querySelectorAll('.cycle-segment[data-segment], .cycle-icon-g[data-segment]').forEach(el => {
      gsap.set(el, { opacity: 1, filter: 'none' });
    });

    // 6. Show all slide-specific chart/animation final states
    showAllFinalStates();
  }

  function enableAnimations() {
    // 1. Re-enable Reveal.js fragment stepping
    deck.configure({ fragments: true });

    // 2. Re-apply GSAP hidden states to non-visible fragments on current slide
    const current = deck.getCurrentSlide();
    if (current) {
      current.querySelectorAll('.fragment:not(.visible)').forEach(el => {
        if (el.classList.contains('agenda-reveal')) {
          gsap.set(el, { opacity: 0.15, y: 0 });
        } else if (el.classList.contains('cycle-reveal')) {
          if (el.classList.contains('takeaway-box')) {
            gsap.set(el, { opacity: 0, y: 150 });
          } else {
            const isLeft = el.closest('.cycle-texts-left');
            const isRight = el.closest('.cycle-texts-right');
            gsap.set(el, { opacity: 0, x: isLeft ? -30 : isRight ? 30 : 0 });
          }
        } else if (el.classList.contains('slide-up')) {
          gsap.set(el, { opacity: 0, y: 150 });
        } else if (el.classList.contains('slide-right')) {
          gsap.set(el, { opacity: 0, x: 200 });
        } else {
          gsap.set(el, { opacity: 0, y: 20 });
        }
      });
      // Re-dim cycle segments for non-visible fragments
      const cycleFrags = current.querySelectorAll('.fragment.cycle-reveal:not(.visible)');
      cycleFrags.forEach(el => {
        const segNum = el.dataset.segment;
        if (segNum) {
          const seg = current.querySelector(`.cycle-segment[data-segment="${segNum}"]`);
          const icon = current.querySelector(`.cycle-icon-g[data-segment="${segNum}"]`);
          if (seg) gsap.set(seg, { opacity: 0.3, filter: 'none' });
          if (icon) gsap.set(icon, { opacity: 0.3, filter: 'none' });
        }
      });
    }
  }

  // Live toggle via settings
  document.addEventListener('settings-changed', (e) => {
    if (e.detail.category !== 'display' || e.detail.key !== 'animationsEnabled') return;
    if (e.detail.value === false) {
      disableAnimations();
    } else {
      enableAnimations();
    }
  });

  // Enhance fragment transitions
  initFragmentAnimations(deck);

  // Boot-time check
  if (isSpeakerViewIframe) {
    // In receiver iframes: show final visual states but do NOT disable Reveal.js
    // fragments — disabling fragments changes the state, which the speaker view
    // popup would sync back to the main window, breaking animations there.
    showAllFinalStates();
  } else if (!animationsEnabled()) {
    // User disabled animations in settings — full disable including fragments
    disableAnimations();
  }
}
