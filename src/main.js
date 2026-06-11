/* ════════════════════════════════════════════════════════════════════════════
   SYNERGY — Main Entry Point
   Lenis smooth scroll · GSAP ScrollTrigger · Reveal animations
   ════════════════════════════════════════════════════════════════════════════ */
import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initAnimations } from './modules/animations';
import { initNavigation } from './modules/navigation';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 2. Viewport Glow Effect
  const glowOverlay = document.getElementById('viewport-glow');
  if (glowOverlay) {
    let scrollTimeout;
    lenis.on('scroll', (e) => {
      const velocity = Math.abs(e.velocity || 0);
      const intensity = Math.min(0.2 + (velocity * 0.025), 0.5);
      glowOverlay.style.opacity = intensity.toString();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        glowOverlay.style.opacity = '0';
      }, 150);
    });
  }

  // 3. Animations
  initAnimations();

  // 4. Navigation
  initNavigation(lenis);
});
