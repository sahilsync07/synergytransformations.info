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
  // 1. Initialize smooth scroll (Lenis + GSAP sync)
  const lenis = initScrollEngine();

  // 2. Initialize Three.js scene (Camera starts at Z=0)
  const { scene, camera, renderer, clock } = initThreeScene();
  
  // 3. Populate 3D space with objects along the negative Z-axis
  const particles = initParticles(scene);

  // 4. Initialize DOM scroll animations & Camera Z-axis mapping
  initAnimations(camera, particles);

  // 5. Initialize navigation
  initNavigation(lenis);

  // 6. Main render loop — tied to GSAP ticker for perf
  gsap.ticker.add(() => {
    const elapsed = clock.getElapsedTime();
    particles.update(elapsed);
    renderer.render(scene, camera);
  });

  // 7. Handle resize
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

  console.log('✦ Synergy Transformations — True 3D Initialized');
});
