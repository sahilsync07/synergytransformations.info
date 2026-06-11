/* ==========================================================================
   GSAP SCROLLTRIGGER ANIMATION IMPLEMENTATION SPEC
   Section: Architecture & Journey (Horizontal Scroll)
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes advanced cinematic animations for the horizontal scroll section.
 * This includes:
 * 1. Pinned horizontal translation of the entire track.
 * 2. Staggered fade and 3D entrance tilt for glass cards linked directly to scroll progress.
 * 3. A dynamic timeline progress drawing effect for the Journey steps.
 * 4. Automatic cleanup and rebuild on viewport resize.
 */
export function initHorizontalSectionAnimations() {
  const horizontalSection = document.getElementById('sec-horizontal');
  const hTrack = document.getElementById('h-track');
  
  if (!horizontalSection || !hTrack) return;

  // Media Query check — only run horizontal animations on desktop (>768px)
  const isDesktop = window.matchMedia('(min-width: 769px)');

  let scrollTriggerInstance = null;
  let ctx = null;

  function setupAnimations() {
    // Clean up previous animations if any
    if (ctx) ctx.revert();

    // Use GSAP Context for easy scoping and clean garbage collection
    ctx = gsap.context(() => {
      if (isDesktop.matches) {
        const panels = gsap.utils.toArray('.h-panel');
        const cards = gsap.utils.toArray('.glass-card');
        const steps = gsap.utils.toArray('.h-panel--step');
        
        // Calculate total distance to scroll horizontally
        const getScrollAmount = () => -(hTrack.scrollWidth - window.innerWidth);

        // 1. Create Master Scroll-Tied Timeline
        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '#sec-horizontal',
            start: 'top top',
            end: () => `+=${Math.abs(getScrollAmount())}`,
            scrub: 1, // Smoothly ties animation to scrollbar
            pin: true, // Pins the section in viewport
            invalidateOnRefresh: true, // Re-calculates values on window resize
            anticipatePin: 1
          }
        });

        // 2. Animate Track Translation (Core Horizontal Scroll)
        masterTimeline.to(panels, {
          x: getScrollAmount,
          ease: 'none' // Linear ease is critical for scroll-sync alignment
        }, 0);

        // 3. Cinematic Entrance for Glass Cards (3D Tilt & Fade)
        // Since we are moving horizontally, we animate each card relative to its progress
        cards.forEach((card, index) => {
          masterTimeline.fromTo(card,
            {
              opacity: 0.3,
              scale: 0.92,
              transformPerspective: 1000,
              rotationY: 15,
              y: 20
            },
            {
              opacity: 1,
              scale: 1,
              rotationY: 0,
              y: 0,
              ease: 'power1.out',
              // Dynamically stagger entrances based on scroll timeline
              duration: 0.35
            },
            // Start card reveal slightly before it reaches center screen
            `${index * 0.12}`
          );
        });

        // 4. Dynamic Timeline Connector Drawing (Journey Steps)
        steps.forEach((step, index) => {
          const marker = step.querySelector('.step-marker');
          const phaseText = step.querySelector('.step-phase');
          const stepTitle = step.querySelector('h3');
          
          // Animate the step details rising up
          masterTimeline.fromTo([phaseText, stepTitle],
            { opacity: 0.4, y: 15 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: 0.2 },
            `+=0.05`
          );

          // Animate step marker scaling up
          if (marker) {
            masterTimeline.fromTo(marker,
              { scale: 0.75, borderColor: 'rgba(255,255,255,0.25)' },
              { 
                scale: 1.15, 
                borderColor: index === steps.length - 1 ? '#d4a44a' : '#f5c563',
                ease: 'back.out(2)',
                duration: 0.15 
              },
              `-=0.1`
            );
          }
        });

      } else {
        // MOBILE MOBILE — Stacked Fallback
        // Remove track offsets and let CSS flexbox handle vertical flow
        gsap.set('.h-panel', { x: 0, y: 0, opacity: 1, scale: 1 });
        
        // Simple vertical fade-in triggers for cards on mobile
        gsap.utils.toArray('.glass-card').forEach((card) => {
          gsap.fromTo(card,
            { opacity: 0.4, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 60%',
                scrub: true
              }
            }
          );
        });

        // Mobile Journey Steps vertical timeline reveal
        gsap.utils.toArray('.h-panel--step').forEach((step) => {
          const marker = step.querySelector('.step-marker');
          gsap.fromTo(step,
            { opacity: 0.4, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: step,
                start: 'top 90%',
                end: 'top 75%',
                scrub: true
              }
            }
          );
        });
      }
    }, horizontalSection);
  }

  // Initial Run
  setupAnimations();

  // Listen for media query state changes and rebuild
  isDesktop.addEventListener('change', setupAnimations);
}
