/* ════════════════════════════════════════════════════════════════════════════
   Navigation — Scrolled state, logo scroll-to-top, smooth anchor links
   ════════════════════════════════════════════════════════════════════════════ */
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNavigation(lenis) {
  const nav = document.getElementById('nav');

  // ── Scrolled nav state (class toggle via ScrollTrigger) ────────────────
  if (nav) {
    ScrollTrigger.create({
      start: 'top -60',
      end: 99999,
      onUpdate: (self) => {
        if (self.scroll() > 60) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
      },
    });
  }

  // ── Logo → scroll to top ──────────────────────────────────────────────
  const logo = document.getElementById('nav-logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ── Smooth scroll for all internal anchor links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return; // logo handled above
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { duration: 1.5, offset: -20 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
