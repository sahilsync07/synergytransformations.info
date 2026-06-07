/* ========================================================
   SYNERGY TRANSFORMATIONS — Main Entry Point
   Initializes: Lenis (Smooth Scroll), GSAP, and Navigation
   ======================================================== */
import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initAnimations } from './modules/animations';
import { initNavigation } from './modules/navigation';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis for buttery smooth scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  // 2. Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);

  // 3. Initialize DOM scroll animations
  initAnimations();

  // 4. Initialize sticky navigation & progress bar
  initNavigation(lenis);
});
