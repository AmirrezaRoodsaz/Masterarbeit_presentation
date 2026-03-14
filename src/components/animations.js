/**
 * GSAP Animations — pipeline build animation (slide 11) + fragment enhancements.
 */
import gsap from 'gsap';

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
  // Set all fragments to initial hidden state
  const fragments = document.querySelectorAll('.reveal .fragment');
  gsap.set(fragments, { opacity: 0, y: 20 });

  deck.on('fragmentshown', (event) => {
    event.fragments.forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.45, ease: 'power2.out',
      });
    });
  });

  deck.on('fragmenthidden', (event) => {
    event.fragments.forEach(el => {
      gsap.to(el, {
        opacity: 0, y: 20, duration: 0.3, ease: 'power2.in',
      });
    });
  });
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
        pipelineTL.restart();
      } else if (prevId === 'slide-pipeline') {
        pipelineTL.pause(0);
      }
    });

    // If we're already on the pipeline slide at load time
    const currentSlide = deck.getCurrentSlide();
    if (getSlideId(currentSlide) === 'slide-pipeline') {
      pipelineTL.play();
    }
  }

  // Enhance fragment transitions
  initFragmentAnimations(deck);
}
