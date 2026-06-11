/* ════════════════════════════════════════════════════════════════════════════
   Animations — Scroll-triggered reveals for the Minimal Agency System
   ════════════════════════════════════════════════════════════════════════════ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {

  // ── 1. Hero entrance timeline ──────────────────────────────────────────
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl.to('.hero__meta', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
  });

  heroTl.to('.hero__scope', {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
  }, '-=0.5');

  heroTl.to('.hero__title[data-reveal]', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out'
  }, '-=0.4');

  heroTl.to('.hero__sub[data-reveal]', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
  }, '-=0.5');

  heroTl.to('.hero__actions[data-reveal]', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
  }, '-=0.4');

  heroTl.to('.hero__scroll-indicator', {
    opacity: 1, duration: 1, ease: 'power2.out'
  }, '-=0.3');

  // Set initial states for hero elements (they have data-reveal in CSS)
  gsap.set('.hero__meta', { opacity: 0, y: 16 });
  gsap.set('.hero__scope', { opacity: 0, y: 16 });
  gsap.set('.hero__scroll-indicator', { opacity: 0 });


  // ── 2. Scroll-triggered reveals ────────────────────────────────────────
  // All [data-reveal] elements outside the hero and not process steps
  const revealElements = gsap.utils.toArray('[data-reveal]').filter(
    el => !el.closest('.hero') && !el.classList.contains('process__step')
  );

  revealElements.forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 60%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  // ── 3. Dynamic Horizontal Stagger Animations ─────────────────────────────
  const horizontalLists = ['.about__cards', '.pillars__grid', '.process__timeline', '.advantage__list'];
  
  horizontalLists.forEach(selector => {
    const list = document.querySelector(selector);
    if (list) {
      const steps = list.querySelectorAll('.process__step');
      
      // Set initial state for horizontal entrance
      gsap.set(steps, { opacity: 0, x: 40, y: 0, scale: 0.95 });
      
      gsap.to(steps, {
        scrollTrigger: {
          trigger: list,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.2)'
      });
    }
  });


  // ── 3. Cards stagger ───────────────────────────────────────────────────
  const cardGroups = ['.about__cards', '.process__timeline'];

  cardGroups.forEach((groupSelector) => {
    const group = document.querySelector(groupSelector);
    if (!group) return;

    const cards = group.querySelectorAll('[data-reveal]');
    if (cards.length === 0) return;

    gsap.to(cards, {
      scrollTrigger: {
        trigger: group,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
    });
  });


  // ── 4. Stats counter animation ─────────────────────────────────────────
  const statNums = gsap.utils.toArray('.stats-bar__num');
  statNums.forEach((el) => {
    const text = el.textContent.trim();
    // Extract number and suffix (e.g., "500+" → 500, "+")
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return;

    const endVal = parseInt(match[1], 10);
    const suffix = match[2];
    const obj = { val: 0 };

    gsap.to(obj, {
      val: endVal,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val) + suffix;
      },
    });
  });


  // ── 5. Section border fade-in ──────────────────────────────────────────
  const sections = gsap.utils.toArray('.section:not(.hero)');
  sections.forEach((section) => {
    gsap.fromTo(section, 
      { borderTopColor: 'transparent' },
      {
        borderTopColor: 'var(--border)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}
