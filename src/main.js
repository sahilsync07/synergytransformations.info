/* ========================================================
   SYNERGY TRANSFORMATIONS — Main Entry Point
   Initializes: Lenis, GSAP, Three.js, all modules
   ======================================================== */
import './style.css';
import { gsap } from 'gsap';
import { initScrollEngine, getLenis } from './modules/scroll-engine.js';
import { initThreeScene } from './modules/three-scene.js';
import { initParticles } from './modules/particles.js';
import { initAnimations } from './modules/animations.js';
import { initNavigation } from './modules/navigation.js';

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Initialize smooth scroll (Lenis + GSAP sync)
  const lenis = initScrollEngine();

  // 2. Initialize Three.js scene + particle system
  const { scene, camera, renderer, clock } = initThreeScene();
  const particles = initParticles(scene, prefersReducedMotion);

  // 3. Initialize DOM scroll animations
  initAnimations(prefersReducedMotion);

  // 4. Initialize navigation
  initNavigation(lenis);

  // 5. Main render loop — tied to GSAP ticker for perf
  if (!prefersReducedMotion) {
    gsap.ticker.add(() => {
      const elapsed = clock.getElapsedTime();
      particles.update(elapsed);
      renderer.render(scene, camera);
    });
  } else {
    // Minimal render for reduced motion — just static particles
    function renderOnce() {
      particles.update(0);
      renderer.render(scene, camera);
    }
    renderOnce();

    // Re-render on resize
    window.addEventListener('resize', renderOnce);
  }

  // 6. Handle resize
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Remove loading state
  document.body.classList.add('is-loaded');

  console.log('✦ Synergy Transformations — Initialized');
});
