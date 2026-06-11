/* ==========================================================================
   SYNERGY TRANSFORMATIONS — HERO & NAVIGATION JS ANIMATIONS
   ========================================================================== */

/**
 * INSTRUCTIONS FOR INTEGRATION:
 * 
 * 1. Style Import (src/main.js):
 *    Add the following line to the top of src/main.js to include the new styles:
 *    import './sections/hero-nav.css';
 * 
 * 2. Update Animations (src/modules/animations.js):
 *    Replace the Hero Section scroll triggers in src/modules/animations.js
 *    with the timelines documented below.
 * 
 * 3. Update Navigation (src/modules/navigation.js):
 *    Replace the navigation scroll trigger in src/modules/navigation.js
 *    with the class toggle logic documented below.
 */

/* ==========================================================================
   UPDATED ANIMATIONS (to replace corresponding parts in src/modules/animations.js)
   ========================================================================== */

export function initUpdatedHeroAnimations() {
  
  // 1. KINETIC TYPOGRAPHY (Hero Text & Subtitle Entry)
  let heroText;
  try {
    heroText = new SplitType('.split-text', { types: 'chars' });
  } catch (e) {
    console.warn('SplitType init failed:', e);
    return;
  }
  
  const heroTl = gsap.timeline({ delay: 0.2 });

  // Entrance 1: Kicker Reveal
  heroTl.fromTo(
    '.kicker[data-reveal]',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  );

  // Entrance 2: Title Character Stagger
  heroTl.fromTo(
    heroText.chars,
    { opacity: 0, yPercent: 100, rotateX: -90 },
    {
      opacity: 1,
      yPercent: 0,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.04,
      ease: 'back.out(1.5)',
      transformOrigin: '50% 100%'
    },
    "-=0.6"
  );
  
  // Entrance 3: Subtitle Fade-in & Slide-up (New)
  heroTl.fromTo(
    '.hero__subtitle',
    { opacity: 0, y: 15 },
    { opacity: 0.85, y: 0, duration: 1, ease: 'power2.out' },
    "-=0.7" // Staggered to blend with characters animation
  );
  
  // Entrance 4: Scroll Line Cue Fade-in
  heroTl.fromTo(
    '#scroll-cue',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
    "-=0.5"
  );

  // 2. HERO FADE & PARALLAX SCALE ON SCROLL
  // Animates the main container downwards and fades it out
  gsap.to('.hero__container', {
    scrollTrigger: {
      trigger: '#sec-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    opacity: 0,
    scale: 0.92,
    y: 80,
    ease: 'none'
  });

  // 3. BACKGROUND GLOW DISPERSION (New)
  // Fades out and scales up the glow background on scroll, simulating a lights-out transition
  gsap.to('.hero__glow', {
    scrollTrigger: {
      trigger: '#sec-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    opacity: 0,
    scale: 1.2,
    ease: 'power1.out'
  });
}


/* ==========================================================================
   UPDATED NAVIGATION (to replace corresponding parts in src/modules/navigation.js)
   ========================================================================== */

export function initUpdatedNavigation(lenis) {
  const nav = document.getElementById('nav');

  // ---- Sticky Nav Background Class Toggle on Scroll ----
  // Replacing messy inline styling with highly efficient class toggles
  if (nav) {
    ScrollTrigger.create({
      start: 'top -50', // Triggers as soon as the user scrolls past 50px
      end: 99999,
      onUpdate: (self) => {
        if (self.scroll() > 50) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
      },
    });
  }
}
