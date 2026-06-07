/* ========================================================
   True 3D Scrollytelling Animations
   Maps scroll progress to Camera Z-axis + DOM Fly-throughs
   ======================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(camera) {
  // 1. CAMERA FLY-THROUGH (The core 3D mechanic)
  // Entire page scroll drives the camera deep into the Z-axis
  const maxDepth = -7000;
  
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5, // 1.5s smoothing
    onUpdate: (self) => {
      // Move camera deep into Z space
      camera.position.z = self.progress * maxDepth;
      
      // Add slight X and Y wobble to make it feel like floating
      camera.position.x = Math.sin(self.progress * Math.PI * 4) * 20;
      camera.position.y = Math.cos(self.progress * Math.PI * 4) * 10;
      
      // Look slightly around
      camera.lookAt(
        Math.sin(self.progress * Math.PI * 2) * 50,
        Math.cos(self.progress * Math.PI * 2) * 50,
        camera.position.z - 1000
      );
    }
  });

  // 2. KINETIC TYPOGRAPHY (Hero)
  const heroText = new SplitType('.split-text', { types: 'chars' });
  const heroTl = gsap.timeline({ delay: 0.2 });
  
  heroTl.fromTo(heroText.chars, 
    { y: '110%', rotateX: 40, opacity: 0 },
    {
      y: '0%',
      rotateX: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.04,
      ease: 'power4.out',
      transformOrigin: 'bottom center'
    }
  )
  .to('#scroll-cue', {
    opacity: 1,
    duration: 1
  }, '-=0.5');

  // Fade out hero as camera flies past it
  gsap.to('#sec-void .layer__content', {
    scrollTrigger: {
      trigger: '#sec-void',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    scale: 2, // Fly past effect
    opacity: 0,
    filter: 'blur(10px)',
    ease: 'power1.in'
  });

  // 3. LAYER FLY-THROUGHS (The DOM elements coming at you from Z depth)
  const layers = document.querySelectorAll('.layer:not(#sec-void)');
  
  layers.forEach((layer) => {
    // Start small and faded (far away), grow to normal, then get huge and fade out (fly past)
    gsap.fromTo(layer.querySelector('.layer__content'), 
      {
        scale: 0.5,
        opacity: 0,
        y: 100
      },
      {
        scrollTrigger: {
          trigger: layer,
          start: 'top bottom', // Start animating when top of layer hits bottom of viewport
          end: 'center center', // Fully visible when centered
          scrub: 1
        },
        scale: 1,
        opacity: 1,
        y: 0,
        ease: 'power2.out'
      }
    );

    // Fly past the camera as user keeps scrolling
    gsap.to(layer.querySelector('.layer__content'), {
      scrollTrigger: {
        trigger: layer,
        start: 'center center',
        end: 'bottom top',
        scrub: 1
      },
      scale: 1.8,
      opacity: 0,
      filter: 'blur(15px)',
      ease: 'power2.in'
    });
  });

  // 4. FLOATING PAIN WORDS
  gsap.utils.toArray('.pain-word').forEach(word => {
    const x = word.dataset.floatX || 0;
    const y = word.dataset.floatY || 0;
    
    // Set initial position immediately
    gsap.set(word, { x: `${x}vw`, y: `${y}vh` });

    gsap.fromTo(word, 
      { opacity: 0, scale: 0.2 },
      {
        scrollTrigger: {
          trigger: '#sec-pain',
          start: 'top 60%',
          end: 'center center',
          scrub: 1
        },
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        color: 'hsla(0,70%,60%,0.6)'
      }
    );
  });

  // 5. MEGA QUOTE STAGGER
  gsap.fromTo('.mega-quote__line', 
    { opacity: 0, rotateX: 20, y: 50 },
    {
      scrollTrigger: {
        trigger: '#sec-bridge',
        start: 'top 60%',
        end: 'center center',
        scrub: 1
      },
      opacity: 1,
      rotateX: 0,
      y: 0,
      stagger: 0.1,
      ease: 'power2.out'
    }
  );

  // 6. RYAN'S VIDEO GLOW
  gsap.fromTo('#video-frame', 
    { opacity: 0, rotateX: 10, scale: 0.9 },
    {
      scrollTrigger: {
        trigger: '#sec-video',
        start: 'top 70%',
        end: 'center center',
        scrub: 1
      },
      opacity: 1,
      rotateX: 0,
      scale: 1,
      ease: 'power2.out'
    }
  );

  // 7. COUNTERS
  document.querySelectorAll('.big-stat__num').forEach((counter) => {
    const target = parseInt(counter.dataset.count, 10);
    ScrollTrigger.create({
      trigger: '#sec-results',
      start: 'top center',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: 'power3.out',
          onUpdate: function() {
            counter.textContent = Math.round(parseFloat(counter.textContent));
          }
        });
      }
    });
  });

  // 8. CTA REVEAL
  gsap.fromTo('.cta-title .cta-line', 
    { opacity: 0, y: 50 },
    {
      scrollTrigger: {
        trigger: '#sec-cta',
        start: 'top 60%',
        end: 'center center',
        scrub: 1
      },
      opacity: 1,
      y: 0,
      stagger: 0.2,
      ease: 'power2.out'
    }
  );
}
