/* ========================================================
   Navigation — Sticky nav, progress bar, scroll-to
   ======================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initNavigation(lenis) {
  const nav = document.getElementById('nav');
  const progressBar = document.getElementById('progress-bar');

  // ---- Sticky Nav Background on Scroll ----
  if (nav) {
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 80) {
          nav.style.background = 'hsla(230,20%,12%,0.85)';
          nav.style.backdropFilter = 'blur(20px)';
          nav.style.borderBottom = '1px solid hsla(40,20%,90%,0.06)';
        } else if (self.scroll() <= 80) {
          nav.style.background = 'transparent';
          nav.style.backdropFilter = 'none';
          nav.style.borderBottom = 'none';
        }
      },
    });
  }

  // ---- Global Progress Bar ----
  if (progressBar) {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        progressBar.style.width = `${self.progress * 100}%`;
      },
    });
  }

  // ---- Logo Click → Scroll to Top ----
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

  // ---- CTA Click → Scroll to CTA Layer ----
  const cta = document.getElementById('nav-cta');
  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('sec-cta');
      if (target && lenis) {
        lenis.scrollTo(target, { duration: 2 });
      } else if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
