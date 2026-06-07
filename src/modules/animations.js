/* ========================================================
   DOM Animations — GSAP ScrollTrigger driven
   Handles all text reveals, card entrances, parallax,
   counter animations, and section transitions.
   ======================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(prefersReducedMotion = false) {
  if (prefersReducedMotion) {
    // Just make everything visible immediately
    document.querySelectorAll(
      '.word-reveal, .hero__tag, .hero__subtitle, .hero__scroll-indicator, ' +
      '.section__label, .section__heading, .problem__card, .bridge__quote, ' +
      '.bridge__sub, .pillar, .timeline__step, .results__stats, ' +
      '.testimonial-card, .coach__info, .cta__heading, .cta__text, ' +
      '.cta__buttons, .cta__note'
    ).forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // ---- Hero Entrance ----
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .to('#hero-tag', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .to('.word-reveal', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.15,
    }, '-=0.4')
    .to('#hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .to('#scroll-indicator', {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.3');

  // Fade out hero on scroll
  ScrollTrigger.create({
    trigger: '#section-hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      gsap.set('#scroll-indicator', { opacity: 1 - progress * 3 });
      gsap.set('.hero', { opacity: 1 - progress * 1.5, y: progress * -80 });
    },
  });

  // ---- Section 2: Problem Cards ----
  gsap.to('#problem-label', {
    scrollTrigger: {
      trigger: '#section-problem',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  });

  gsap.to('#problem-heading', {
    scrollTrigger: {
      trigger: '#section-problem',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  gsap.utils.toArray('.problem__card').forEach((card) => {
    const delay = parseFloat(card.dataset.delay) || 0;
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
    });
  });

  // ---- Section 3: Bridge / Quote ----
  gsap.to('#bridge-label', {
    scrollTrigger: {
      trigger: '#section-bridge',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  });

  gsap.to('#bridge-quote', {
    scrollTrigger: {
      trigger: '#section-bridge',
      start: 'top 65%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
  });

  // Stagger quote lines
  gsap.utils.toArray('.quote-line').forEach((line, i) => {
    gsap.from(line, {
      scrollTrigger: {
        trigger: '#section-bridge',
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'power3.out',
    });
  });

  gsap.to('#bridge-sub', {
    scrollTrigger: {
      trigger: '#section-bridge',
      start: 'top 50%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // ---- Section 4: Program Pillars ----
  gsap.to('#program-label', {
    scrollTrigger: {
      trigger: '#section-program',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  });

  gsap.to('#program-heading', {
    scrollTrigger: {
      trigger: '#section-program',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  gsap.utils.toArray('.pillar').forEach((pillar) => {
    const delay = parseFloat(pillar.dataset.delay) || 0;
    gsap.to(pillar, {
      scrollTrigger: {
        trigger: pillar,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
    });
  });

  // ---- Section 5: Journey / Timeline ----
  gsap.to('#journey-label', {
    scrollTrigger: {
      trigger: '#section-journey',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  });

  gsap.to('#journey-heading', {
    scrollTrigger: {
      trigger: '#section-journey',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Timeline steps
  const timelineSteps = gsap.utils.toArray('.timeline__step');
  timelineSteps.forEach((step, i) => {
    gsap.to(step, {
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        onEnter: () => step.classList.add('is-active'),
        onLeaveBack: () => step.classList.remove('is-active'),
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out',
    });
  });

  // Timeline progress bar
  ScrollTrigger.create({
    trigger: '#section-journey',
    start: 'top 60%',
    end: 'bottom 40%',
    scrub: 1,
    onUpdate: (self) => {
      const progress = document.getElementById('timeline-progress');
      if (progress) {
        progress.style.height = `${self.progress * 100}%`;
      }
    },
  });

  // ---- Section 6: Results — Stats + Testimonials ----
  gsap.to('#results-label', {
    scrollTrigger: {
      trigger: '#section-results',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  });

  gsap.to('#results-heading', {
    scrollTrigger: {
      trigger: '#section-results',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Stats counter animation
  gsap.to('#results-stats', {
    scrollTrigger: {
      trigger: '#results-stats',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      onEnter: () => animateCounters(),
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Testimonial cards
  gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out',
    });
  });

  // ---- Section 7: Coach ----
  gsap.to('#coach-info', {
    scrollTrigger: {
      trigger: '#section-coach',
      start: 'top 60%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    x: 0,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.from('#coach-visual', {
    scrollTrigger: {
      trigger: '#section-coach',
      start: 'top 65%',
      toggleActions: 'play none none reverse',
    },
    opacity: 0,
    scale: 0.9,
    duration: 1,
    ease: 'power3.out',
  });

  // ---- Section 8: CTA ----
  gsap.to('#cta-label', {
    scrollTrigger: {
      trigger: '#section-cta',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out',
  });

  gsap.to('#cta-heading', {
    scrollTrigger: {
      trigger: '#section-cta',
      start: 'top 65%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  gsap.to('#cta-text', {
    scrollTrigger: {
      trigger: '#section-cta',
      start: 'top 60%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  gsap.to('#cta-buttons', {
    scrollTrigger: {
      trigger: '#section-cta',
      start: 'top 55%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  gsap.to('#cta-note', {
    scrollTrigger: {
      trigger: '#section-cta',
      start: 'top 50%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
  });
}

// ---- Counter Animation ----
function animateCounters() {
  document.querySelectorAll('.stat__number').forEach((counter) => {
    const target = parseInt(counter.dataset.target, 10);
    if (isNaN(target)) return;

    gsap.to(counter, {
      innerText: target,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      onUpdate: function () {
        counter.textContent = Math.round(parseFloat(counter.textContent));
      },
    });
  });
}
