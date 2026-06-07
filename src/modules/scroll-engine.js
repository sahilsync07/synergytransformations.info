/* ========================================================
   Scroll Engine — Lenis + GSAP ScrollTrigger Integration
   Provides buttery-smooth scroll synced with GSAP ticker
   ======================================================== */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initScrollEngine() {
  const isMobile = window.innerWidth < 768;

  // Initialize Lenis smooth scroll
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: !isMobile, // native touch on mobile for better UX
    touchMultiplier: 2,
  });

  // Sync Lenis with GSAP ticker (single RAF loop)
  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  // Disable GSAP's lag smoothing for instant scroll response
  gsap.ticker.lagSmoothing(0);

  // Update ScrollTrigger on Lenis scroll events
  lenisInstance.on('scroll', ScrollTrigger.update);

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

// Utility: scroll to a section smoothly
export function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target && lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: 0,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }
}
